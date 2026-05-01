import type { LetterFeedback } from '@/types'

type TileProps = {
  letter: string
  feedback: LetterFeedback | null
  isRevealing: boolean
  revealDelay: number
}

const FEEDBACK_BG: Record<LetterFeedback, string> = {
  G: 'bg-[var(--color-correct)]',
  Y: 'bg-[var(--color-present)]',
  X: 'bg-[var(--color-absent)]',
}

const FEEDBACK_BORDER: Record<LetterFeedback, string> = {
  G: 'border-[var(--color-correct)]',
  Y: 'border-[var(--color-present)]',
  X: 'border-[var(--color-absent)]',
}

const FEEDBACK_COLOR: Record<LetterFeedback, string> = {
  G: 'var(--color-correct)',
  Y: 'var(--color-present)',
  X: 'var(--color-absent)',
}

export function Tile({ letter, feedback, isRevealing, revealDelay }: TileProps) {
  const hasLetter = letter.length > 0
  const hasFeedback = feedback !== null
  // isAnimating: currently mid-flip (has feedback + actively being revealed)
  const isAnimating = isRevealing && hasFeedback

  let bgClass: string
  let textClass: string
  let borderClass: string

  if (!isAnimating && hasFeedback) {
    // Fully revealed: feedback color bg, white text
    bgClass = FEEDBACK_BG[feedback]
    textClass = 'text-white'
    borderClass = FEEDBACK_BORDER[feedback]
  } else {
    // Empty, filled-but-unsubmitted, or mid-animation: page bg, page fg text
    bgClass = 'bg-background'
    textClass = 'text-foreground'
    borderClass = hasLetter || isAnimating
      ? 'border-[var(--color-tile-border-filled)]'
      : 'border-[var(--color-tile-border-empty)]'
  }

  const style: React.CSSProperties = {
    ...(isRevealing && hasFeedback ? { animationDelay: `${revealDelay}ms` } : {}),
    // --flip-color drives the CSS keyframe color switch at 50% mid-flip
    ...(isAnimating && feedback ? { '--flip-color': FEEDBACK_COLOR[feedback] } as React.CSSProperties : {}),
  }

  return (
    <div
      className={`
        flex items-center justify-center
        w-[var(--tile-size)] h-[var(--tile-size)]
        text-2xl font-bold uppercase select-none
        border-2 transition-colors duration-200 ${bgClass} ${textClass} ${borderClass}
        ${isAnimating ? 'tile-flip' : ''}
      `}
      style={style}
    >
      {letter}
    </div>
  )
}
