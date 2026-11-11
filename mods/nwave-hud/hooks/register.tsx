// Entry point the host loads. All wiring lives in src/host-adapter.tsx.
import type { Register } from 'claude-code'

import { wire } from '../src/host-adapter.tsx'

export const register: Register = on => wire(on)
