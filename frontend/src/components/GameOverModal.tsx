import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { useGame } from '../hooks/useGame'
import { buildShareText, copyToClipboard } from '../lib/share'
import { toast } from 'sonner'
import { LetterFeedback } from '../types'

const WIN_TIERS = ['🤯 Genius', '🔥 Magnificent', '⭐ Impressive', '👍 Splendid', '😅 Great', '😤 Phew']

function getTier(guessCount: number, won: boolean): string {
  if (!won) return '💀 Better luck tomorrow'
  return WIN_TIERS[guessCount - 1] ?? '😤 Phew'
}

export function GameOverModal() {
  const { state, closeModal } = useGame()
  const open = state.activeModal === 'game-over'
  const won = state.status === 'won'
  const tier = getTier(state.guesses.length, won)

  async function handleShare() {
    const text = buildShareText(state.puzzleNumber, state.feedback, !won)
    const success = await copyToClipboard(text)
    toast(success ? 'Copied to clipboard!' : "Couldn't copy — try manually.")
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && closeModal()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>{won ? 'You won! 🎉' : 'Game over'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-2xl font-bold">{tier}</p>
          {!won && (
            <p className="text-gray-600">
              The word was <strong className="text-black uppercase">{state.word}</strong>
            </p>
          )}
          <p className="text-gray-500 text-sm">
            Puzzle #{state.puzzleNumber} — {state.guesses.length}/6
          </p>
          {(won || state.status === 'lost') && (
            <button
              onClick={handleShare}
              className="w-full py-3 bg-[var(--color-correct)] text-white font-bold rounded hover:opacity-90 transition-opacity"
            >
              Share
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
