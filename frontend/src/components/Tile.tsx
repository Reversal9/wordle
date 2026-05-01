import type { LetterFeedback } from '../types'

type TileProps = {
  letter: string
  feedback: LetterFeedback | null
  isRevealing: boolean
  revealDelay: number
}

const BG: Record<LetterFeedback, string> = {
  G: 'bg-[var(--color-correct)] border-[var(--color-correct)]',
  Y: 'bg-[var(--color-present)] border-[var(--color-present)]',
  X: 'bg-[var(--color-absent)] border-[var(--color-absent)]',
}

export function Tile({ letter, feedback, isRevealing, revealDelay }: TileProps) {
  const hasLetter = letter.length > 0
  const hasFeedback = feedback !== null

  const borderClass = hasFeedback
    ? BG[feedback]
    : hasLetter
      ? 'border-[var(--color-tile-border-filled)] border-2'
      : 'border-[var(--color-tile-border-empty)] border-2'

  const textColor = hasFeedback ? 'text-white' : 'text-black dark:text-white'

  const animationStyle = isRevealing && hasFeedback
    ? { animationDelay: `${revealDelay}ms` }
    : {}

  return (
    <div
      className={`
        flex items-center justify-center
        w-[var(--tile-size)] h-[var(--tile-size)]
        text-2xl font-bold uppercase select-none
        ${borderClass} ${textColor}
        ${isRevealing && hasFeedback ? 'tile-flip' : ''}
      `}
      style={animationStyle}
    >
      {letter}
    </div>
  )
}
