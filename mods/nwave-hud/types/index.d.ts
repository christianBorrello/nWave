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

export type Stages4 = [Stage, Stage, Stage, Stage]

export type DetailView = {
  request: string | null
  slices: Array<{
    id: string
    observation: string | null
    stages: Stages4
    position: 'built' | 'current' | 'future'
  }>
  finalReview: Stage
  others: string[]
}

export type HudView =
  | { state: 'feature'; id: string; value: string | null; flow: FlowView; detail: DetailView }
  | { state: 'degraded'; note: string }

declare module 'claude-code' {
  interface PluginState {
    'nwave-hud': { view: HudView | null; isOpen: boolean }
  }
}
