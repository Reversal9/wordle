import { LetterFeedback } from '../types'

const EMOJI: Record<LetterFeedback, string> = {
  G: '🟩',
  Y: '🟨',
  X: '⬛',
}

export function buildShareText(
  puzzleNumber: number,
  feedback: LetterFeedback[][],
  lost: boolean
): string {
  const score = lost ? 'X' : String(feedback.length)
  const header = `Definitely Not Wordle #${puzzleNumber} ${score}/6`
  const grid = feedback.map(row => row.map(f => EMOJI[f]).join('')).join('\n')
  return `${header}\n\n${grid}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
