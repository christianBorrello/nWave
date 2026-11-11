// Core: resolves the view. Imports neither the engine adapter's details nor the host.
import { readActiveFeature } from './engine-adapter.ts'
import { detailOf } from './detail.ts'
import { flowOf } from './flow.ts'
import { glyphOf } from './glyphs.ts'
import type { Segment } from './glyphs.ts'
import type { DegradedReason, HudView, RunPort, Stage } from './model.ts'

const NOTES: Record<DegradedReason, string> = {
  'no-feature': 'nessuna feature attiva',
  'engine-missing': 'stato non disponibile',
  'engine-failed': 'stato non disponibile',
  'not-json': 'stato non disponibile',
  'unexpected-schema': 'stato non disponibile',
  malformed: 'stato non disponibile',
  internal: 'stato non disponibile',
}

export const degraded = (reason: DegradedReason): HudView => ({
  state: 'degraded',
  note: NOTES[reason],
})

/** Never throws. */
export async function resolveView(run: RunPort, root: string): Promise<HudView> {
  try {
    const out = await readActiveFeature(run, root)
    if (out.kind === 'degraded') return degraded(out.reason)
    const f = out.feature
    return {
      state: 'feature',
      id: f.id,
      value: f.value,
      flow: flowOf(f.slices, f.finalReview),
      detail: detailOf(f),
    }
  } catch {
    return degraded('internal')
  }
}

function phaseSegment(phase: string | null, status: Stage): Segment {
  if (status === null || phase === null) return { text: '—', tone: 'plain' }
  const g = glyphOf(status)
  return { text: `${g.text} ${phase}`, tone: g.tone }
}

/** The band's single row as tone-tagged segments (no colour knowledge here). */
export function segmentsOf(view: HudView): Segment[] {
  if (view.state === 'degraded') {
    return [
      { text: '○ ', tone: 'dim' },
      { text: `nWave — ${view.note}`, tone: 'dim' },
    ]
  }
  const f = view.flow
  if (f.kind === 'none') {
    return [
      { text: '● ', tone: 'accent' },
      { text: `${view.id} — ${view.value ?? '—'}`, tone: 'plain' },
    ]
  }
  const id: Segment = { text: `${view.id}  `, tone: 'dim' }
  const progress: Segment = { text: `  ${f.progress}`, tone: 'dim' }
  if (f.kind === 'final') {
    return [id, phaseSegment('REVIEW', f.status), { text: '  finale', tone: 'plain' }, progress]
  }
  return [
    id,
    phaseSegment(f.phase, f.status),
    { text: `  ${f.slice} · ${f.observation ?? '—'}`, tone: 'plain' },
    progress,
  ]
}

export const textOf = (view: HudView): string =>
  segmentsOf(view).map(s => s.text).join('')
