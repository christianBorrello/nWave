// The ONLY file that knows the mods API (early access: isolate changes here).
import { atom, read, update } from 'claude-code'
import type { Engine, Register } from 'claude-code'

import { openLines } from './detail.ts'
import type { Segment } from './glyphs.ts'
import { resolveView, segmentsOf } from './hud.ts'
import type { HudView } from './model.ts'

const view = atom({ plugin: 'nwave-hud', key: 'view' } as const, null)
const isOpen = atom({ plugin: 'nwave-hud', key: 'isOpen' } as const, false)

let latest = 0

// Measure only: a failure here must never reach the host or block the event.
async function refresh($: Engine): Promise<void> {
  const mine = ++latest
  try {
    const root = await $.session.cwd()
    const next: HudView = await resolveView(
      (argv, init) => $.process.run(argv, init),
      root,
    )
    // A later refresh started meanwhile: its answer wins.
    if (mine === latest) await update($, view, () => next)
  } catch {
    // swallow: the band keeps its last state
  }
}

export const wire = (on: Parameters<Register>[0]): void => {
  // The update runs on a timer of its own (the documented way to outlive a
  // dispatch), so the event reaches the host at once and its errors stay the host's.
  on('session.start', async ($, e, next) => {
    $.clock.after(0, () => refresh($))
    try {
      await $.command.register({
        name: 'nw-flow',
        description: 'Opens or closes the nWave Flow detail under the band.',
      })
    } catch {
      // no command: the band's own control still works
    }
    return next(e)
  })

  on('turn.complete', ($, e, next) => {
    $.clock.after(0, () => refresh($))
    return next(e)
  })

  // Answers for itself: it only flips the mod's own open/closed state.
  on('command.run', { command: 'nw-flow' }, async $ => {
    try {
      const open = !(await read($, isOpen))
      await update($, isOpen, () => open)
      return { text: open ? 'Flow aperto.' : 'Flow chiuso.' }
    } catch {
      return { text: 'Flow non disponibile.' }
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    let node = null
    try {
      const current = await read($, view)
      if (!e.props.hasSurvey && current !== null) {
        const open = current.state === 'feature' && (await read($, isOpen))
        const { Box, Button, Text } = $.ui.resolve(e)
        // Tones become colours here and only here: yellow is the accent, used sparingly.
        const paint = (seg: Segment) =>
          seg.tone === 'accent' ? (
            <Text color="#fac30f">{seg.text}</Text>
          ) : seg.tone === 'danger' ? (
            <Text color="red">{seg.text}</Text>
          ) : (
            <Text dimColor={seg.tone === 'dim'}>{seg.text}</Text>
          )
        const row = (
          <Box>
            {segmentsOf(current).map(paint)}
            {current.state === 'feature' ? <Text>{'  '}</Text> : null}
            {current.state === 'feature' ? (
              <Button
                key="flow"
                label={open ? 'Flow ▴' : 'Flow ▾'}
                onPress={() => update($, isOpen, o => !o)}
              />
            ) : null}
          </Box>
        )
        if (!open || current.state !== 'feature') {
          node = row
        } else {
          node = (
            <Box flexDirection="column">
              {row}
              {openLines(current.value, current.detail).map(line => (
                <Text wrap="truncate-end">{line.map(paint)}</Text>
              ))}
            </Box>
          )
        }
      }
    } catch {
      node = null
    }
    // Outside the try: the host's own error is neither swallowed nor doubled.
    return node ?? next(e)
  })
}
