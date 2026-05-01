import { describe, it, expect, beforeEach } from 'vitest'
import { saveState, loadState } from './storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when no state saved for date', () => {
    expect(loadState('2026-04-30')).toBeNull()
  })

  it('saves and loads state for a date', () => {
    const state = {
      guesses: ['crane'],
      feedback: [['G','Y','X','X','X']] as const,
      status: 'playing' as const,
    }
    saveState('2026-04-30', state)
    expect(loadState('2026-04-30')).toEqual(state)
  })

  it('uses date-namespaced key so different dates do not collide', () => {
    saveState('2026-04-30', { guesses: ['crane'], feedback: [['G','G','G','G','G']], status: 'won' })
    expect(loadState('2026-05-01')).toBeNull()
  })

  it('returns null if stored value is corrupted JSON', () => {
    localStorage.setItem('dnw-2026-04-30', 'not-json')
    expect(loadState('2026-04-30')).toBeNull()
  })
})
