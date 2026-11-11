// The ONE vocabulary of state signs: closed row, open Flow and every tick use it.
import type { Stage } from './model.ts'

export type Tone = 'accent' | 'danger' | 'dim' | 'plain'
export type Segment = { text: string; tone: Tone }

/** done = filled, recording = filled in yellow, pending = outline, rejected = cross,
 *  skipped = slashed (does not apply), null = dash (not determinable). */
export function glyphOf(stage: Stage): Segment {
  switch (stage) {
    case 'done':
      return { text: '●', tone: 'plain' }
    case 'recording':
      return { text: '●', tone: 'accent' }
    case 'pending':
      return { text: '○', tone: 'plain' }
    case 'rejected':
      return { text: '✖', tone: 'danger' }
    case 'skipped':
      return { text: '⊘', tone: 'dim' }
    default:
      return { text: '—', tone: 'plain' }
  }
}
