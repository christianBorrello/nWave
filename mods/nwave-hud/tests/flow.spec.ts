import { test } from 'node:test'
import assert from 'node:assert/strict'

import { parseState } from '../src/engine-adapter.ts'
import { flowOf } from '../src/flow.ts'
import { textOf } from '../src/hud.ts'
import type { HudView } from '../src/model.ts'
import { fx } from './helpers.ts'

function from(file: string) {
  const out = parseState(fx(file))
  if (out.kind !== 'ok') throw new Error(`${file}: ${out.reason}`)
  const f = out.feature
  const flow = flowOf(f.slices, f.finalReview)
  const view: HudView = { state: 'feature', id: f.id, value: f.value, flow }
  return { flow, text: textOf(view) }
}

test('first open stage of the first unfinished slice; pending = outline mark', () => {
  const { flow, text } = from('valid.json')
  assert.deepEqual(flow, { kind: 'working', phase: 'ORACLE', status: 'pending', slice: 'S2', observation: 'Color persists', progress: '1/2' })
  assert.equal(text, 'widget-color  ○ ORACLE  S2 · Color persists  1/2')
})

test('recording = filled mark', () => {
  assert.equal(from('craft-recording.json').text, 'widget-color  ● CRAFT  S1 · Picking a color changes the widget  0/1')
})

test('slice review recording or rejected keeps the slice current, phase REVIEW', () => {
  const rec = from('review-recording.json')
  assert.equal(rec.text, 'widget-color  ● REVIEW  S1 · Picking a color changes the widget  1/2')
  const rej = from('review-rejected.json')
  assert.equal(rej.text, 'widget-color  ✖ REVIEW  S1 · Picking a color changes the widget  1/2')
  assert.equal(rej.flow.kind === 'working' && rej.flow.status, 'rejected')
})

test('slice review pending does not block', () => {
  const { flow } = from('review-pending-not-blocking.json')
  assert.equal(flow.kind === 'working' && flow.slice, 'S2')
})

test('skipped stages are passed over', () => {
  assert.equal(from('skipped-stage.json').text, 'widget-color  ○ CRAFT  S1 · Picking a color changes the widget  0/1')
})

test('the engine id is shown, not the position (ids need not be contiguous)', () => {
  const { flow, text } = from('non-contiguous-ids.json')
  assert.equal(flow.kind === 'working' && flow.slice, 'S3')
  assert.equal(text, 'widget-color  ○ CRAFT  S3 · Color persists  1/2')
})

test('null stage: phase is a dash, never pending', () => {
  assert.equal(from('null-stage.json').text, 'widget-color  —  S2 · Color persists  1/2')
})

test('null craft: progress is —/total', () => {
  const { flow } = from('null-craft.json')
  assert.equal(flow.kind === 'working' && flow.progress, '—/2')
})

test('all slices built: final review shows candidate.review in the same forms', () => {
  const expected: Record<string, string> = {
    done: '● REVIEW',
    recording: '● REVIEW',
    rejected: '✖ REVIEW',
    pending: '○ REVIEW',
    skipped: '⊘ REVIEW',
    null: '—',
  }
  for (const [state, mark] of Object.entries(expected)) {
    const { flow, text } = from(`candidate-${state}.json`)
    assert.equal(flow.kind, 'final')
    assert.equal(text, `widget-color  ${mark}  finale  ${state === 'null' ? '1/1' : '2/2'}`)
  }
})

test('no slices: no flow, skeleton line stays', () => {
  const { flow, text } = from('no-slices.json')
  assert.deepEqual(flow, { kind: 'none' })
  assert.equal(text, '● widget-color — User selects a widget color')
})
