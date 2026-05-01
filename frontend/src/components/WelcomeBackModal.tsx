import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGame } from '@/hooks/useGame'

export function WelcomeBackModal() {
  const { state, closeModal } = useGame()
  const open = state.activeModal === 'welcome-back'
  const remaining = 6 - state.guesses.length

  return (
    <Dialog open={open} onOpenChange={open => !open && closeModal()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>Welcome back!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            Puzzle #{state.puzzleNumber} — you've made{' '}
            <strong className="text-neutral-900 dark:text-white">
              {state.guesses.length} of 6
            </strong>{' '}
            {state.guesses.length === 1 ? 'guess' : 'guesses'}.{' '}
            {remaining === 1 ? 'One guess left — make it count.' : `${remaining} guesses remaining.`}
          </p>
          <button
            onClick={closeModal}
            className="w-full py-3 bg-[var(--color-correct)] text-white font-bold rounded hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
