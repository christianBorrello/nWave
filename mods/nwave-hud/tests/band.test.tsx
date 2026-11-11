// Run with `claude plugin test mods/nwave-hud` (engine kit); the *.spec.ts files run with `npm test`.
import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  plugin: 'nwave-hud',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, scroll: { offset: 0, bodyRows: 5 } },
} as const
const SURFACES = ['terminal', 'desktop'] as const

const stages = (o: string, c: string) => ({ design: 'done', oracle: o, craft: c, review: 'pending' })
const feature = (id: string, slices: unknown[], review = 'pending') => ({
  id,
  modified: '2026-11-10T12:00:00Z',
  request: 'Let the user pick a widget color',
  value: 'User selects a widget color',
  slices,
  candidate: { review },
})
const stateOf = (...features: unknown[]) => JSON.stringify({ schema: 'nwave.hud_state.v1', features })
const TWO = stateOf(
  feature('widget-color', [
    { id: 'S2', observation: 'Picking a color changes the widget', stages: stages('done', 'done') },
    { id: 'S3', observation: 'Color persists', stages: stages('pending', 'pending') },
  ]),
  feature('older', []),
)
const ENTRY = { name: 'widget-color', kind: 'dir', size: 0, mtimeMs: 0, isLink: false } as const
const OUT = { isStdoutTruncated: false, isStderrTruncated: false, stderr: '' }
const TURN = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' } as const

// The engine, as the test stands for it; `engine.stdout` can change between turns.
function setup($: any, on: any, stdout: string | Error) {
  const engine = { stdout }
  on('session.start', (_: any, e: any) => ({ cwd: e.cwd }))
  on('session.cwd', () => ({ value: '/p' }))
  on('fs.list', () => ({ value: [ENTRY] }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 2, mtimeMs: 5, isLink: false } }))
  on('turn.complete', () => ({ text: '' }))
  on('command.register', () => ({ value: { command: 'nw-flow' } }))
  on('process.run', () => {
    if (engine.stdout instanceof Error) throw engine.stdout
    return { value: { exitCode: 0, stdout: engine.stdout, ...OUT } }
  })
  return engine
}
const start = async ($: any, clock: any) => {
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })
  await clock.advance(1)
}
const texts = async (ui: any, re: RegExp) => (await ui.find({ type: 'Text', text: re }))?.text

test('closed band: the one row, no detail, with the control', async ($, on) => {
  const clock = mock.clock(on)
  setup($, on, TWO)
  await start($, clock)
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await texts(ui, /ORACLE/)).toBe('○ ORACLE')
    expect(await texts(ui, /S3 · Color persists/)).toBe('  S3 · Color persists')
    expect(await texts(ui, /richiesta/)).toBe(undefined)
    expect(await ui.find({ type: 'Button' })).toBeTruthy()
    // The row, in order: two spaces separate the progress from the control.
    expect((await ui.find({ type: 'Box' }))?.text).toBe('widget-color  ○ ORACLE  S3 · Color persists  1/2  Flow ▾')
    await ui.unmount()
  }
})

test('/nw-flow opens and closes the detail, on every surface', async ($, on) => {
  const clock = mock.clock(on)
  setup($, on, TWO)
  await start($, clock)
  expect((await $.command.run({ command: 'nw-flow' })).text).toBe('Flow aperto.')
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await texts(ui, /richiesta/)).toMatch(/Let the user pick a widget color/)
    expect(await texts(ui, /S2/)).toMatch(/■ S2/)
    expect(await texts(ui, /review finale/)).toMatch(/review finale  ○/)
    expect(await texts(ui, /altre feature/)).toMatch(/older/)
    await ui.unmount()
  }
  expect((await $.command.run({ command: 'nw-flow' })).text).toBe('Flow chiuso.')
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await texts(ui, /richiesta/)).toBe(undefined)
  await ui.unmount()
})

test('the control in the band toggles, and the mounted band redraws', async ($, on) => {
  const clock = mock.clock(on)
  setup($, on, TWO)
  await start($, clock)
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await texts(ui, /richiesta/)).toBe(undefined)
    await ui.press({ key: 'flow' })
    expect(await texts(ui, /richiesta/)).toMatch(/richiesta/)
    await ui.press({ key: 'flow' })
    expect(await texts(ui, /richiesta/)).toBe(undefined)
    await ui.unmount()
  }
})

test('the band updates after the end-of-turn event when the engine output changes', async ($, on) => {
  const clock = mock.clock(on)
  const engine = setup($, on, TWO)
  await start($, clock)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await texts(ui, /S3 · Color persists/)).toBeTruthy()

  engine.stdout = stateOf(
    feature('widget-color', [
      { id: 'S2', observation: 'Picking a color changes the widget', stages: stages('done', 'done') },
      { id: 'S3', observation: 'Color persists', stages: stages('done', 'recording') },
    ]),
  )
  await $.turn.complete(TURN)
  await clock.advance(1)
  expect(await texts(ui, /CRAFT/)).toBe('● CRAFT')
  expect(await texts(ui, /ORACLE/)).toBe(undefined)
  await ui.unmount()
})

test('without nwdes the band shows a dash and nothing throws', async ($, on) => {
  const clock = mock.clock(on)
  setup($, on, new Error('ENOENT'))
  await start($, clock)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await texts(ui, /nWave/)).toBe('nWave — stato non disponibile')
  expect(await ui.find({ type: 'Button' })).toBe(undefined)
  await ui.unmount()
})
