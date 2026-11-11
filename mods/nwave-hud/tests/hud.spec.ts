import { test } from 'node:test'
import assert from 'node:assert/strict'

import { textOf, resolveView } from '../src/hud.ts'
import { fx } from './helpers.ts'

const run = (stdout: string, exitCode = 0) => async () => ({ exitCode, stdout })

test('resolveView on a valid state', async () => {
  const v = await resolveView(run(fx('valid.json')), '/p')
  assert.equal(textOf(v), 'widget-color  ○ ORACLE  S2 · Color persists  1/2')
})

test('degraded cases never throw and show a neutral dash', async () => {
  const cases: Array<[Parameters<typeof resolveView>[0], string]> = [
    [run(fx('empty-features.json')), '○ nWave — nessuna feature attiva'],
    [async () => { throw new Error('ENOENT') }, '○ nWave — stato non disponibile'],
    [run('oops'), '○ nWave — stato non disponibile'],
    [run('', 1), '○ nWave — stato non disponibile'],
    [run(fx('old-shape.json')), '○ nWave — stato non disponibile'],
  ]
  for (const [r, text] of cases) assert.equal(textOf(await resolveView(r, '/p')), text)
})

test('missing value renders as an em dash', async () => {
  const v = await resolveView(run(fx('no-value.json')), '/p')
  assert.equal(textOf(v), '● widget-color — —')
})
