// Self-contained contract (the validator allows no import). Mirrors the view types in src/model.ts.
export type Stage = 'done' | 'recording' | 'rejected' | 'pending' | 'skipped' | null

export type FlowView =
  | { kind: 'none' }
  | {
      kind: 'working'
      phase: string | null
      status: Stage
      slice: string
      observation: string | null
      progress: string
    }
  | { kind: 'final'; status: Stage; progress: string }

export type HudView =
  | { state: 'feature'; id: string; value: string | null; flow: FlowView }
  | { state: 'degraded'; note: string }

declare module 'claude-code' {
  interface PluginState {
    'nwave-hud': { view: HudView | null }
  }
}
