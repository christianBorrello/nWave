// Run with `claude plugin test mods/nwave-hud` (engine kit); the *.spec.ts files run with `npm test`.
import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  plugin: 'nwave-hud',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, scroll: { offset: 0, bodyRows: 5 } },
} as const

const feature = (slices: unknown[]) => ({
  id: 'widget-color',
  modified: '2026-11-10T12:00:00Z',
  value: 'User selects a widget color',
  slices,
  candidate: { review: 'pending' },
})
const STATE = JSON.stringify({ schema: 'nwave.hud_state.v1', features: [feature([])] })
const ENTRY = { name: 'widget-color', kind: 'dir', size: 0, mtimeMs: 0, isLink: false } as const
const OUT = { isStdoutTruncated: false, isStderrTruncated: false, stderr: '' }

test('band shows the active feature and its value', async ($, on) => {
  const clock = mock.clock(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.cwd', () => ({ value: '/p' }))
  on('fs.list', () => ({ value: [ENTRY] }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 2, mtimeMs: 5, isLink: false } }))
  on('process.run', () => ({ value: { exitCode: 0, stdout: STATE, ...OUT } }))
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })
  await clock.advance(1)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Text', text: /widget-color/ }))?.text).toBe('widget-color — User selects a widget color')
    await ui.unmount()
  }
})

test('without nwdes the band shows a dash and nothing throws', async ($, on) => {
  const clock = mock.clock(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.cwd', () => ({ value: '/p' }))
  on('fs.list', () => ({ value: [ENTRY] }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 2, mtimeMs: 5, isLink: false } }))
  on('process.run', () => { throw new Error('ENOENT') })
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })
  await clock.advance(1)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /nWave/ }))?.text).toBe('nWave — stato non disponibile')
  await ui.unmount()
})

const FLOW_STATE = JSON.stringify({
  schema: 'nwave.hud_state.v1',
  features: [
    feature([
      { id: 'S2', observation: 'Picking a color changes the widget', stages: { design: 'done', oracle: 'pending', craft: 'done', review: 'pending' } },
      { id: 'S3', observation: 'Color persists', stages: { design: 'done', oracle: 'pending', craft: 'pending', review: 'pending' } },
    ]),
  ],
})

test('band shows phase, slice and progress on every surface', async ($, on) => {
  const clock = mock.clock(on)
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.cwd', () => ({ value: '/p' }))
  on('fs.list', () => ({ value: [ENTRY] }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 2, mtimeMs: 5, isLink: false } }))
  on('process.run', () => ({ value: { exitCode: 0, stdout: FLOW_STATE, ...OUT } }))
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })
  await clock.advance(1)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Text', text: /ORACLE/ }))?.text).toBe('○ ORACLE')
    expect((await ui.find({ type: 'Text', text: /Color persists/ }))?.text).toBe('  S3 · Color persists')
    expect((await ui.find({ type: 'Text', text: /1\/2/ }))?.text).toBe('  1/2')
    await ui.unmount()
  }
})
