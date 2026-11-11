// Internal model of the HUD. No import from the engine or the host.

/** A stage's state; `null` = the engine could not determine it. */
export type Stage = 'done' | 'recording' | 'rejected' | 'pending' | 'skipped' | null

export const PHASES = ['design', 'oracle', 'craft', 'review'] as const
export type Phase = (typeof PHASES)[number]

export type SliceModel = {
  id: string
  observation: string | null
  stages: Record<Phase, Stage>
}

/** What the engine tells us about the active feature (only what the band needs). */
export type FeatureModel = {
  id: string
  /** `null` = not available. Never an invented value. */
  value: string | null
  slices: SliceModel[]
  /** State of the final review of the whole feature. */
  finalReview: Stage
}

/** Where the work stands, ready to draw. JSON-serialisable. */
export type FlowView =
  | { kind: 'none' }
  | {
      kind: 'working'
      /** Upper-case phase name; `null` when the stage state is unknown. */
      phase: string | null
      status: Stage
      /** The slice id as the engine emitted it. */
      slice: string
      observation: string | null
      progress: string
    }
  | { kind: 'final'; status: Stage; progress: string }

export type DegradedReason =
  | 'no-feature'
  | 'engine-missing'
  | 'engine-failed'
  | 'not-json'
  | 'unexpected-schema'
  | 'malformed'
  | 'internal'

export type EngineOutcome =
  | { kind: 'ok'; feature: FeatureModel }
  | { kind: 'degraded'; reason: DegradedReason }

/** What the band draws: JSON-serialisable, so it can live in `$.state`. */
export type HudView =
  | { state: 'feature'; id: string; value: string | null; flow: FlowView }
  | { state: 'degraded'; note: string }

/** Minimal process port; `$.process.run` satisfies it structurally. */
export type RunPort = (
  argv: readonly string[],
  init?: { cwd?: string; timeoutMs?: number },
) => Promise<{ exitCode: number; stdout: string }>
