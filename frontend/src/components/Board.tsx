import { useEffect, useState } from 'react'
import { useGame } from '@/hooks/useGame'
import { Row } from '@/components/Row'

export function Board() {
  const { state } = useGame()
  const { guesses, feedback, currentInput, status, isShaking } = state

  const [revealingRow, setRevealingRow] = useState(-1)

  useEffect(() => {
    if (guesses.length === 0) return
    const row = guesses.length - 1
    setRevealingRow(row)
    const timer = setTimeout(() => setRevealingRow(-1), 5 * 100 + 500)
    return () => clearTimeout(timer)
  }, [guesses.length])

  const rows = Array.from({ length: 6 }, (_, i) => {
    if (i < guesses.length) {
      return {
        letters: guesses[i].split(''),
        feedback: feedback[i],
        isShaking: false,
        isRevealing: i === revealingRow,
      }
    }
    if (i === guesses.length && status === 'playing') {
      const letters = [...currentInput]
      while (letters.length < 5) letters.push('')
      return {
        letters,
        feedback: null,
        isShaking,
        isRevealing: false,
      }
    }
    return {
      letters: ['', '', '', '', ''],
      feedback: null,
      isShaking: false,
      isRevealing: false,
    }
  })

  return (
    <div className="flex flex-col gap-1.5 my-4">
      {rows.map((row, i) => (
        <Row key={i} {...row} />
      ))}
    </div>
  )
}
