import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { GameContextValue, LetterFeedback } from '@/types'
import { gameReducer, initialState } from '@/hooks/gameReducer'
import { validWords } from '@/lib/words'
import { getLocalDateStr } from '@/lib/date'
import { loadState, saveState } from '@/lib/storage'

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const dateStr = getLocalDateStr()

  // Fetch today's word on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/word?date=${dateStr}`)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then(data => {
        dispatch({ type: 'LOAD_SUCCESS', word: data.word, puzzleNumber: data.puzzleNumber })
        const saved = loadState(dateStr)
        if (saved) {
          dispatch({ type: 'RESTORE_STATE', guesses: saved.guesses, feedback: saved.feedback, status: saved.status })
          if (saved.status === 'won' || saved.status === 'lost') {
            dispatch({ type: 'OPEN_MODAL', modal: 'game-over' })
          } else if (saved.guesses.length > 0) {
            dispatch({ type: 'OPEN_MODAL', modal: 'welcome-back' })
          } else {
            dispatch({ type: 'OPEN_MODAL', modal: 'how-to-play' })
          }
        } else {
          dispatch({ type: 'OPEN_MODAL', modal: 'how-to-play' })
        }
      })
      .catch(() => dispatch({ type: 'LOAD_ERROR' }))
  }, [dateStr])

  // Sync localStorage after every guess
  useEffect(() => {
    if (state.status === 'loading' || state.status === 'error') return
    saveState(dateStr, { guesses: state.guesses, feedback: state.feedback, status: state.status })
  }, [state.guesses, state.feedback, state.status, dateStr])

  function typeLetter(letter: string) {
    dispatch({ type: 'TYPE_LETTER', letter })
  }

  function deleteLetter() {
    dispatch({ type: 'DELETE_LETTER' })
  }

  // After each guess the tiles flip for 900ms (4 × 100ms stagger + 500ms flip).
  // Block all input during this window, then open the game-over modal if needed.
  const REVEAL_MS = 4 * 100 + 500
  useEffect(() => {
    if (!state.isRevealing) return
    const timer = setTimeout(() => {
      dispatch({ type: 'REVEAL_DONE' })
      if (state.status === 'won' || state.status === 'lost') {
        dispatch({ type: 'OPEN_MODAL', modal: 'game-over' })
      }
    }, REVEAL_MS)
    return () => clearTimeout(timer)
  }, [state.isRevealing, state.status])

  function submitGuess() {
    if (state.status !== 'playing' || state.isRevealing) return
    const guess = state.currentInput.join('')
    if (state.currentInput.length !== 5 || !validWords.has(guess)) {
      dispatch({ type: 'SET_SHAKING', value: true })
      setTimeout(() => dispatch({ type: 'SET_SHAKING', value: false }), 600)
      return
    }
    dispatch({ type: 'SUBMIT_GUESS' })
  }

  function openModal(modal: 'how-to-play' | 'game-over' | 'welcome-back') {
    dispatch({ type: 'OPEN_MODAL', modal })
  }

  function closeModal() {
    dispatch({ type: 'CLOSE_MODAL' })
  }

  // Physical keyboard input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      const tag = (e.target as HTMLElement).tagName
      if (['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(tag)) return
      if (e.key === 'Enter') submitGuess()
      else if (e.key === 'Backspace') deleteLetter()
      else if (/^[a-zA-Z]$/.test(e.key)) typeLetter(e.key.toLowerCase())
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status, state.currentInput, state.isRevealing])
  // React Compiler handles memoization — no useCallback needed

  // Derive keyboard colors: green > yellow > gray priority
  const PRIORITY: Record<LetterFeedback, number> = { G: 2, Y: 1, X: 0 }
  const keyboardColors = new Map<string, LetterFeedback>()
  state.guesses.forEach((guess, i) => {
    guess.split('').forEach((letter, j) => {
      const fb = state.feedback[i][j]
      const current = keyboardColors.get(letter)
      if (!current || PRIORITY[fb] > PRIORITY[current]) {
        keyboardColors.set(letter, fb)
      }
    })
  })

  const value: GameContextValue = {
    state,
    keyboardColors,
    typeLetter,
    deleteLetter,
    submitGuess,
    openModal,
    closeModal,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
