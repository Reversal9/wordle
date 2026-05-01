import { useGame } from '../hooks/useGame'

export function Header() {
  const { openModal } = useGame()

  return (
    <header className="flex items-center justify-between w-full max-w-[500px] mx-auto px-2 py-3 border-b border-gray-200">
      <button
        onClick={() => openModal('how-to-play')}
        className="text-gray-500 hover:text-black transition-colors text-xl"
        aria-label="How to play"
      >
        ?
      </button>
      <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-center flex-1">
        Definitely Not Wordle
      </h1>
      <div className="w-8" />
    </header>
  )
}
