import { test } from 'node:test'
import assert from 'node:assert/strict'

import { fx } from './helpers.ts'
import { parseState, readActiveFeature, stateArgv } from '../src/engine-adapter.ts'

test('the first feature of the list is the active one, with its slices and final review', () => {
  assert.deepEqual(parseState(fx('two-features.json')), {
    kind: 'ok',
    feature: {
      id: 'widget-color',
      value: 'User selects a widget color',
      slices: [
        {
          id: 'S1',
          observation: 'Picking a color changes the widget',
          stages: { design: 'done', oracle: 'done', craft: 'done', review: 'pending' },
        },
      ],
      finalReview: 'pending',
    },
  })
})

test('missing value is null, not invented', () => {
  const out = parseState(fx('no-value.json'))
  assert.equal(out.kind === 'ok' && out.feature.value, null)
})

test('skipped is a state of its own', () => {
  const out = parseState(fx('skipped-stage.json'))
  assert.equal(out.kind === 'ok' && out.feature.slices[0].stages.oracle, 'skipped')
})

for (const [file, reason] of [
  ['not-json.txt', 'not-json'],
  ['old-shape.json', 'unexpected-schema'],
  ['empty-features.json', 'no-feature'],
  ['features-not-list.json', 'malformed'],
  ['slice-without-id.json', 'malformed'],
] as const) {
  test(`${file} degrades as ${reason}`, () => {
    assert.deepEqual(parseState(fx(file)), { kind: 'degraded', reason })
  })
}

test('empty and non-object output degrade', () => {
  for (const s of ['', '[1]', 'null']) assert.equal(parseState(s).kind, 'degraded')
})

test('an unknown stage value is null, never pending', () => {
  const out = parseState(
    JSON.stringify({
      schema: 'nwave.hud_state.v1',
      features: [{ id: 'x', slices: [{ id: 'S1', stages: { design: 'weird' } }] }],
    }),
  )
  assert.equal(out.kind === 'ok' && out.feature.slices[0].stages.design, null)
  assert.equal(out.kind === 'ok' && out.feature.finalReview, null)
})

test('command shape: no --feature', () => {
  assert.deepEqual(stateArgv(), ['nwdes', 'state'])
})

test('readActiveFeature: ok, missing binary, non-zero exit', async () => {
  const ok = await readActiveFeature(async () => ({ exitCode: 0, stdout: fx('valid.json') }))
  assert.equal(ok.kind, 'ok')
  const missing = await readActiveFeature(async () => { throw new Error('ENOENT') })
  assert.deepEqual(missing, { kind: 'degraded', reason: 'engine-missing' })
  const failed = await readActiveFeature(async () => ({ exitCode: 2, stdout: '' }))
  assert.deepEqual(failed, { kind: 'degraded', reason: 'engine-failed' })
})
