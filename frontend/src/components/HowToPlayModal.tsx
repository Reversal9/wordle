import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGame } from '@/hooks/useGame'
import { Tile } from '@/components/Tile'

export function HowToPlayModal() {
  const { state, closeModal } = useGame()
  const open = state.activeModal === 'how-to-play'

  return (
    <Dialog open={open} onOpenChange={open => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>Guess the <strong>word</strong> in 6 tries.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was.</li>
          </ul>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Tile letter="W" feedback="G" isRevealing={false} revealDelay={0} />
              <span><strong>W</strong> is in the word and in the correct spot.</span>
            </div>
            <div className="flex items-center gap-2">
              <Tile letter="I" feedback="Y" isRevealing={false} revealDelay={0} />
              <span><strong>I</strong> is in the word but in the wrong spot.</span>
            </div>
            <div className="flex items-center gap-2">
              <Tile letter="U" feedback="X" isRevealing={false} revealDelay={0} />
              <span><strong>U</strong> is not in the word in any spot.</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 pt-1">A new puzzle is available each day at midnight.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
