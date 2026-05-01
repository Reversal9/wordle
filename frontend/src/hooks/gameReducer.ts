import type { GameState, GameAction } from '../types'
import { computeFeedback } from '../lib/feedback'

export const initialState: GameState = {
  word: '',
  puzzleNumber: 0,
  guesses: [],
  feedback: [],
  currentInput: [],
  status: 'loading',
  activeModal: null,
  isShaking: false,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, word: action.word, puzzleNumber: action.puzzleNumber, status: 'playing' }

    case 'LOAD_ERROR':
      return { ...state, status: 'error' }

    case 'RESTORE_STATE':
      return { ...state, guesses: action.guesses, feedback: action.feedback, status: action.status }

    case 'TYPE_LETTER': {
      if (state.status !== 'playing') return state
      if (state.currentInput.length >= 5) return state
      return { ...state, currentInput: [...state.currentInput, action.letter] }
    }

    case 'DELETE_LETTER': {
      if (state.status !== 'playing') return state
      if (state.currentInput.length === 0) return state
      return { ...state, currentInput: state.currentInput.slice(0, -1) }
    }

    case 'SUBMIT_GUESS': {
      const guess = state.currentInput.join('')
      const fb = computeFeedback(guess, state.word)
      const newGuesses = [...state.guesses, guess]
      const newFeedback = [...state.feedback, fb]
      const won = fb.every(f => f === 'G')
      const lost = !won && newGuesses.length === 6
      const status = won ? 'won' : lost ? 'lost' : ('playing' as const)
      return {
        ...state,
        guesses: newGuesses,
        feedback: newFeedback,
        currentInput: [],
        status,
        activeModal: won || lost ? 'game-over' : state.activeModal,
      }
    }

    case 'SET_SHAKING':
      return { ...state, isShaking: action.value }

    case 'OPEN_MODAL':
      return { ...state, activeModal: action.modal }

    case 'CLOSE_MODAL':
      return { ...state, activeModal: null }

    default:
      return state
  }
}
