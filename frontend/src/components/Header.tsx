import { useGame } from '@/hooks/useGame'
import { ModeToggle } from '@/components/mode-toggle'

export function Header() {
  const { openModal } = useGame()

  return (
    <header className="flex items-center justify-between w-full max-w-[500px] mx-auto px-3 py-3 border-b border-[var(--header-border)]">
      <button
        onClick={() => openModal('how-to-play')}
        className="w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold text-[var(--page-fg)] opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        aria-label="How to play"
      >
        ?
      </button>
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center flex-1 font-display">
        Definitely Not Wordle
      </h1>
      <ModeToggle />
    </header>
  )
}
