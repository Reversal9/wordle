import { describe, it, expect } from 'vitest'
import { buildShareText } from './share'
import { LetterFeedback } from '../types'

describe('buildShareText', () => {
  it('builds win share text with correct emoji grid', () => {
    const feedback: LetterFeedback[][] = [
      ['G','Y','X','X','X'],
      ['G','G','G','G','G'],
    ]
    const result = buildShareText(1, feedback, false)
    expect(result).toBe(
      'Definitely Not Wordle #1 2/6\n\n🟩🟨⬛⬛⬛\n🟩🟩🟩🟩🟩'
    )
  })

  it('uses X/6 on loss', () => {
    const feedback: LetterFeedback[][] = [
      ['X','X','X','X','X'],
    ]
    const result = buildShareText(5, feedback, true)
    expect(result).toBe('Definitely Not Wordle #5 X/6\n\n⬛⬛⬛⬛⬛')
  })

  it('maps G→🟩, Y→🟨, X→⬛', () => {
    const feedback: LetterFeedback[][] = [['G','Y','X','G','Y']]
    const result = buildShareText(1, feedback, false)
    expect(result).toContain('🟩🟨⬛🟩🟨')
  })
})
