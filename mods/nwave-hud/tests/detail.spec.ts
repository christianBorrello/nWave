import { test } from 'node:test'
import assert from 'node:assert/strict'

import { parseState } from '../src/engine-adapter.ts'
import { detailOf, linesText, MAX_OBSERVATION, openLines, truncate } from '../src/detail.ts'
import { glyphOf } from '../src/glyphs.ts'
import type { Stage } from '../src/model.ts'
import { fx } from './helpers.ts'

function open(file: string) {
  const out = parseState(fx(file))
  if (out.kind !== 'ok') throw new Error(`${file}: ${out.reason}`)
  const d = detailOf(out.feature)
  return { d, lines: openLines(out.feature.value, d) }
}

test('the open Flow on an example with two slices', () => {
  const { lines } = open('flow-open.json')
  assert.deepEqual(linesText(lines), [
    '  richiesta  Let the user pick a widget color',
    '  valore     User selects a widget color',
    '  ■ S1  Picking a color changes the widget  ● ● ● ○',
    '  ▶ S2  Color persists                      ● ○ ○ ○',
    '  review finale  ○',
    '  altre feature: older, oldest',
  ])
})

test('the current slice is yellow (accent); built and future differ by shape', () => {
  const { d, lines } = open('flow-open.json')
  assert.deepEqual(d.slices.map(s => s.position), ['built', 'current'])
  const [, , built, current] = lines
  assert.equal(built[1].text, '■')
  assert.equal(current[1].text, '▶')
  assert.equal(current[1].tone, 'accent')
  assert.equal(current[2].tone, 'accent')
  assert.notEqual(built[2].tone, 'accent')
})

test('a future slice (after the current one) has the outline row mark', () => {
  const out = parseState(fx('flow-open.json'))
  if (out.kind !== 'ok') throw new Error('x')
  const f = { ...out.feature, slices: [out.feature.slices[1], { ...out.feature.slices[1], id: 'S3' }] }
  assert.deepEqual(detailOf(f).slices.map(s => [s.position]), [['current'], ['future']])
  assert.equal(linesText(openLines('v', detailOf(f)))[3].slice(0, 5), '  □ S')
})

test('every stage state has one distinct sign, same everywhere', () => {
  const signs = (['done', 'recording', 'rejected', 'pending', 'skipped', null] as Stage[]).map(s => {
    const g = glyphOf(s)
    return `${g.text}/${g.tone}`
  })
  assert.deepEqual(signs, ['●/plain', '●/accent', '✖/danger', '○/plain', '⊘/dim', '—/plain'])
  assert.equal(new Set(signs).size, 6)
})

test('every combination of stage states renders its four ticks', () => {
  const all: Stage[] = ['done', 'recording', 'rejected', 'pending', 'skipped', null]
  for (const a of all) for (const b of all) {
    const d = {
      request: 'r',
      slices: [{ id: 'S1', observation: 'o', stages: [a, b, a, b] as [Stage, Stage, Stage, Stage], position: 'future' as const }],
      finalReview: b,
      others: [],
    }
    const row = openLines('v', d)[2]
    const ticks = row.slice(3).filter((_, i) => i % 2 === 0).map(s => s.text)
    assert.deepEqual(ticks, [a, b, a, b].map(s => glyphOf(s).text))
  }
})

test('null shows a dash, never pending', () => {
  const d = { request: null, slices: [], finalReview: null, others: [] }
  assert.deepEqual(linesText(openLines(null, d)), [
    '  richiesta  —',
    '  valore     —',
    '  review finale  —',
  ])
})

test('feature without slices: request, value and final review only', () => {
  const { lines } = open('no-slices.json')
  assert.equal(lines.length, 3)
})

test('other features appear only when the engine lists more than one', () => {
  assert.equal(linesText(open('valid.json').lines).some(l => l.includes('altre feature')), false)
  assert.equal(linesText(open('two-features.json').lines).at(-1), '  altre feature: older')
})

test('long observations are cut with an ellipsis, one row per slice', () => {
  const { lines } = open('long-observation.json')
  const row = linesText(lines)[2]
  assert.match(row, /…/)
  assert.equal(lines.length, 4)
  assert.ok([...row].length <= 2 + 1 + 1 + 2 + 2 + MAX_OBSERVATION + 2 + 7 + 2)
})

test('truncate', () => {
  assert.equal(truncate('abc', 3), 'abc')
  assert.equal(truncate('abcd', 3), 'ab…')
})
