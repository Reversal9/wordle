import type { LetterFeedback } from '../types'
import { Tile } from './Tile'

type RowProps = {
  letters: string[]
  feedback: LetterFeedback[] | null
  isShaking: boolean
  isRevealing: boolean
}

export function Row({ letters, feedback, isShaking, isRevealing }: RowProps) {
  const tiles = Array.from({ length: 5 }, (_, i) => ({
    letter: letters[i] ?? '',
    feedback: feedback ? feedback[i] : null,
  }))

  return (
    <div className={`flex gap-1.5 ${isShaking ? 'row-shake' : ''}`}>
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          feedback={tile.feedback}
          isRevealing={isRevealing}
          revealDelay={i * 100}
        />
      ))}
    </div>
  )
}
