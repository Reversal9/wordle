import { LetterFeedback } from '../types'

export function computeFeedback(guess: string, answer: string): LetterFeedback[] {
  const result: LetterFeedback[] = Array(5).fill('X')
  const pool = answer.split('')

  // Pass 1: exact matches
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'G'
      pool[i] = ''
    }
  }

  // Pass 2: misplaced letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'G') continue
    const idx = pool.indexOf(guess[i])
    if (idx !== -1) {
      result[i] = 'Y'
      pool[idx] = ''
    }
  }

  return result
}
