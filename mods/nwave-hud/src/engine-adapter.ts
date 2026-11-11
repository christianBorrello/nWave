// The ONLY file that knows the engine's command and JSON (`nwdes state`).
import type { EngineOutcome, FeatureModel, RunPort, SliceModel, Stage } from './model.ts'

const SCHEMA = 'nwave.hud_state.v1'
const TIMEOUT_MS = 5000

/** No `--feature`: the engine lists features, newest first; the first is active. */
export const stateArgv = (): string[] => ['nwdes', 'state']

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const STAGES = ['done', 'recording', 'rejected', 'pending', 'skipped']

// Anything unknown is "not determinable" (null), never guessed as pending.
const toStage = (v: unknown): Stage =>
  typeof v === 'string' && STAGES.includes(v) ? (v as Stage) : null

const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim() !== ''

/** `null` = the slice is not valid (no id): the whole output degrades. */
function toSlice(raw: unknown): SliceModel | null {
  if (!isRecord(raw) || !nonEmpty(raw.id)) return null
  const st = isRecord(raw.stages) ? raw.stages : {}
  return {
    id: raw.id,
    observation: nonEmpty(raw.observation) ? raw.observation : null,
    stages: {
      design: toStage(st.design),
      oracle: toStage(st.oracle),
      craft: toStage(st.craft),
      review: toStage(st.review),
    },
  }
}

function toFeature(raw: unknown): FeatureModel | null {
  if (!isRecord(raw) || !nonEmpty(raw.id) || !Array.isArray(raw.slices)) return null
  const slices: SliceModel[] = []
  for (const s of raw.slices) {
    const slice = toSlice(s)
    if (slice === null) return null
    slices.push(slice)
  }
  const candidate = isRecord(raw.candidate) ? raw.candidate : {}
  return {
    id: raw.id,
    value: nonEmpty(raw.value) ? raw.value : null,
    slices,
    finalReview: toStage(candidate.review),
  }
}

/** Translates the engine's stdout into the internal model. Never throws. */
export function parseState(stdout: string): EngineOutcome {
  let doc: unknown
  try {
    doc = JSON.parse(stdout)
  } catch {
    return { kind: 'degraded', reason: 'not-json' }
  }
  if (!isRecord(doc)) return { kind: 'degraded', reason: 'not-json' }
  if (doc.schema !== SCHEMA) return { kind: 'degraded', reason: 'unexpected-schema' }
  if (!Array.isArray(doc.features)) return { kind: 'degraded', reason: 'malformed' }
  if (doc.features.length === 0) return { kind: 'degraded', reason: 'no-feature' }
  const feature = toFeature(doc.features[0])
  if (feature === null) return { kind: 'degraded', reason: 'malformed' }
  return { kind: 'ok', feature }
}

/** Runs the verb through the injected process port; never throws. */
export async function readActiveFeature(run: RunPort, cwd?: string): Promise<EngineOutcome> {
  let result
  try {
    result = await run(stateArgv(), { cwd, timeoutMs: TIMEOUT_MS })
  } catch {
    return { kind: 'degraded', reason: 'engine-missing' }
  }
  if (result.exitCode !== 0) return { kind: 'degraded', reason: 'engine-failed' }
  return parseState(result.stdout)
}
