import { describe, it, expect } from 'vitest'
import { computeFeedback } from './feedback'

describe('computeFeedback', () => {
  it('returns all G for a correct guess', () => {
    expect(computeFeedback('crane', 'crane')).toEqual(['G','G','G','G','G'])
  })

  it('returns all X when no letters match', () => {
    expect(computeFeedback('xxxxx', 'crane')).toEqual(['X','X','X','X','X'])
  })

  it('returns Y for correct letters in wrong position', () => {
    // answer: crane, guess: acids
    // a→in crane at pos2 (not pos0) → Y, c→in crane at pos0 (not pos1) → Y, i/d/s not in crane → X
    expect(computeFeedback('acids', 'crane')).toEqual(['Y','Y','X','X','X'])
  })

  it('handles duplicate guess letter where answer has one — spell/speed', () => {
    // answer: spell, guess: speed
    // s=G, p=G, e=G, e→not in remaining [l] → X, d→not in [l] → X
    expect(computeFeedback('speed', 'spell')).toEqual(['G','G','G','X','X'])
  })

  it('handles duplicate answer letters — teeth/teems', () => {
    // answer: teeth (e at pos1, e at pos2), guess: teems (e at pos1, e at pos2)
    // t=G, e=G (pos1 exact), e=G (pos2 exact), m→X, s→X
    expect(computeFeedback('teems', 'teeth')).toEqual(['G','G','G','X','X'])
  })

  it('gives Y when guess has a letter that appears in answer but wrong position', () => {
    // answer: crane, guess: rance
    expect(computeFeedback('rance', 'crane')).toEqual(['Y','Y','Y','Y','G'])
  })

  it('does not double-count — only one Y for a letter that appears once in answer', () => {
    // answer: banal, guess: added
    // a is in answer at pos1 and pos3 — guess has a at pos0 only
    expect(computeFeedback('added', 'banal')).toEqual(['Y','X','X','X','X'])
  })
})
