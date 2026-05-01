export type GameStatus = 'loading' | 'error' | 'playing' | 'won' | 'lost'
export type LetterFeedback = 'G' | 'Y' | 'X'
export type ActiveModal = 'how-to-play' | 'game-over' | 'welcome-back' | null

export type GameState = {
  word: string
  puzzleNumber: number
  guesses: string[]
  feedback: LetterFeedback[][]
  currentInput: string[]
  status: GameStatus
  activeModal: ActiveModal
  isShaking: boolean
  isRevealing: boolean
}

export type GameAction =
  | { type: 'LOAD_SUCCESS'; word: string; puzzleNumber: number }
  | { type: 'LOAD_ERROR' }
  | { type: 'RESTORE_STATE'; guesses: string[]; feedback: LetterFeedback[][]; status: GameStatus }
  | { type: 'TYPE_LETTER'; letter: string }
  | { type: 'DELETE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'REVEAL_DONE' }
  | { type: 'SET_SHAKING'; value: boolean }
  | { type: 'OPEN_MODAL'; modal: 'how-to-play' | 'game-over' | 'welcome-back' }
  | { type: 'CLOSE_MODAL' }

export type GameContextValue = {
  state: GameState
  keyboardColors: Map<string, LetterFeedback>
  typeLetter: (letter: string) => void
  deleteLetter: () => void
  submitGuess: () => void
  openModal: (modal: 'how-to-play' | 'game-over' | 'welcome-back') => void
  closeModal: () => void
}

export type SavedState = {
  guesses: string[]
  feedback: LetterFeedback[][]
  status: GameStatus
}
