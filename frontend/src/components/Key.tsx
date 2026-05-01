import { LetterFeedback } from '../types'
import { useGame } from '../hooks/useGame'

type KeyProps = {
  value: string
  feedback: LetterFeedback | undefined
}

const KEY_BG: Record<LetterFeedback, string> = {
  G: 'bg-[var(--color-correct)] text-white',
  Y: 'bg-[var(--color-present)] text-white',
  X: 'bg-[var(--color-absent)] text-white',
}

export function Key({ value, feedback }: KeyProps) {
  const { typeLetter, deleteLetter, submitGuess } = useGame()

  function handleClick() {
    if (value === 'Enter') submitGuess()
    else if (value === 'Backspace') deleteLetter()
    else typeLetter(value)
  }

  const isWide = value === 'Enter' || value === 'Backspace'
  const label = value === 'Backspace' ? '⌫' : value.toUpperCase()
  const colorClass = feedback ? KEY_BG[feedback] : 'bg-[#d3d6da] text-black'

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center rounded
        h-[var(--key-height)] min-w-[44px]
        ${isWide ? 'px-3 text-sm font-semibold' : 'w-[44px] text-base font-bold'}
        ${colorClass}
        select-none cursor-pointer transition-colors duration-200
      `}
    >
      {label}
    </button>
  )
}
