// The ONLY file that knows the mods API (early access: isolate changes here).
import { atom, read, update } from 'claude-code'
import type { Engine, Register } from 'claude-code'

import { resolveView, segmentsOf } from './hud.ts'
import type { HudView } from './model.ts'

const view = atom({ plugin: 'nwave-hud', key: 'view' } as const, null)

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
  on('session.start', ($, e, next) => {
    $.clock.after(0, () => refresh($))
    return next(e)
  })

  on('turn.complete', ($, e, next) => {
    $.clock.after(0, () => refresh($))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    let node = null
    try {
      const current = await read($, view)
      if (!e.props.hasSurvey && current !== null) {
        const { Box, Text } = $.ui.resolve(e)
        node = (
          <Box>
            {segmentsOf(current).map(seg =>
              seg.tone === 'accent' ? (
                <Text color="#fac30f">{seg.text}</Text>
              ) : seg.tone === 'danger' ? (
                <Text color="red">{seg.text}</Text>
              ) : (
                <Text dimColor={seg.tone === 'dim'}>{seg.text}</Text>
              ),
            )}
          </Box>
        )
      }
    } catch {
      node = null
    }
    // Outside the try: the host's own error is neither swallowed nor doubled.
    return node ?? next(e)
  })
}
