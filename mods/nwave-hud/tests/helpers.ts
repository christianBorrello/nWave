import { readFileSync } from 'node:fs'

export const fx = (n: string) =>
  readFileSync(new URL(`./fixtures/state/${n}`, import.meta.url), 'utf8')
