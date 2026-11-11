// Pure: which slice and phase are current, and how far along the feature is.
import { PHASES } from './model.ts'
import type { FlowView, SliceModel, Stage } from './model.ts'

const isOpen = (s: Stage) => s !== 'done' && s !== 'skipped'
const isBlockingReview = (s: Stage) => s === 'recording' || s === 'rejected'

/** Craft is finished when done, or when it does not apply to the slice. */
const isCraftFinished = (s: SliceModel) => !isOpen(s.stages.craft)

/** A slice is finished when its craft is, and its own review is not in flight or refused. */
export const isFinished = (s: SliceModel) => isCraftFinished(s) && !isBlockingReview(s.stages.review)

/** Index of the first unfinished slice, or -1 when all are built. */
export const currentIndex = (slices: readonly SliceModel[]): number =>
  slices.findIndex(s => !isFinished(s))

export function flowOf(slices: readonly SliceModel[], finalReview: Stage): FlowView {
  if (slices.length === 0) return { kind: 'none' }
  const total = slices.length
  // Any undeterminable craft makes the count unknowable: "—", never a guess.
  const isUnknown = slices.some(s => s.stages.craft === null)
  const built = slices.filter(isCraftFinished).length
  const progress = `${isUnknown ? '—' : built}/${total}`

  const index = currentIndex(slices)
  const slice = slices[index]
  if (slice === undefined) return { kind: 'final', status: finalReview, progress }

  // A slice held back only by its review shows REVIEW; otherwise the first open stage.
  const phase = isCraftFinished(slice) ? 'review' : PHASES.find(p => isOpen(slice.stages[p]))
  const stage = phase === undefined ? null : slice.stages[phase]
  return {
    kind: 'working',
    phase: stage === null || phase === undefined ? null : phase.toUpperCase(),
    status: stage,
    slice: slice.id,
    observation: slice.observation,
    progress,
  }
}
