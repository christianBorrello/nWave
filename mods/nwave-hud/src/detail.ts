// Pure: the lines of the open Flow. No colours, no host: tone-tagged segments.
import { currentIndex, isFinished } from './flow.ts'
import { glyphOf } from './glyphs.ts'
import type { Segment } from './glyphs.ts'
import { PHASES } from './model.ts'
import type { DetailView, FeatureModel, SliceRow, Stages4 } from './model.ts'

export const MAX_TEXT = 100
export const MAX_OBSERVATION = 48

export function truncate(text: string, max: number): string {
  const chars = [...text]
  return chars.length <= max ? text : `${chars.slice(0, Math.max(0, max - 1)).join('')}…`
}

const pad = (text: string, width: number) =>
  text + ' '.repeat(Math.max(0, width - [...text].length))

export function detailOf(f: FeatureModel): DetailView {
  const current = currentIndex(f.slices)
  const slices: SliceRow[] = f.slices.map((s, i) => ({
    id: s.id,
    observation: s.observation,
    stages: PHASES.map(p => s.stages[p]) as Stages4,
    position: i === current ? 'current' : isFinished(s) ? 'built' : 'future',
  }))
  return { request: f.request, slices, finalReview: f.finalReview, others: f.otherIds }
}

// Shape of the row marker: built = filled square, current = arrow (yellow), future = outline.
const ROW_MARK = {
  built: { text: '■', tone: 'plain' },
  current: { text: '▶', tone: 'accent' },
  future: { text: '□', tone: 'dim' },
} as const

/** The lines under the closed row; each line is a list of segments. */
export function openLines(
  value: string | null,
  d: DetailView,
  maxObservation = MAX_OBSERVATION,
): Segment[][] {
  const lines: Segment[][] = []
  const field = (label: string, v: string | null): Segment[] => [
    { text: `  ${pad(label, 11)}`, tone: 'dim' },
    { text: truncate(v ?? '—', MAX_TEXT), tone: 'plain' },
  ]
  lines.push(field('richiesta', d.request))
  lines.push(field('valore', value))

  const observations = d.slices.map(s => truncate(s.observation ?? '—', maxObservation))
  const obsWidth = Math.max(0, ...observations.map(o => [...o].length))
  const idWidth = Math.max(0, ...d.slices.map(s => [...s.id].length))
  d.slices.forEach((s, i) => {
    const text: Segment['tone'] = s.position === 'current' ? 'accent' : 'plain'
    const row: Segment[] = [
      { text: '  ', tone: 'plain' },
      { ...ROW_MARK[s.position] },
      { text: ` ${pad(s.id, idWidth)}  ${pad(observations[i], obsWidth)}  `, tone: text },
    ]
    s.stages.forEach((st, k) => {
      if (k > 0) row.push({ text: ' ', tone: 'plain' })
      row.push(glyphOf(st))
    })
    lines.push(row)
  })

  lines.push([
    { text: '  review finale  ', tone: 'plain' },
    glyphOf(d.finalReview),
  ])
  if (d.others.length > 0) {
    lines.push([{ text: truncate(`  altre feature: ${d.others.join(', ')}`, MAX_TEXT), tone: 'dim' }])
  }
  return lines
}

export const linesText = (lines: Segment[][]): string[] =>
  lines.map(l => l.map(s => s.text).join(''))
