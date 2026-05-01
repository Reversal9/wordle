import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from './gameReducer'
import { GameState } from '../types'

const playingState: GameState = {
  ...initialState,
  word: 'crane',
  puzzleNumber: 1,
  status: 'playing',
}

describe('gameReducer', () => {
  it('starts in loading status', () => {
    expect(initialState.status).toBe('loading')
  })

  it('LOAD_SUCCESS sets word and switches to playing', () => {
    const next = gameReducer(initialState, { type: 'LOAD_SUCCESS', word: 'crane', puzzleNumber: 1 })
    expect(next.word).toBe('crane')
    expect(next.status).toBe('playing')
  })

  it('LOAD_ERROR switches to error status', () => {
    const next = gameReducer(initialState, { type: 'LOAD_ERROR' })
    expect(next.status).toBe('error')
  })

  it('TYPE_LETTER appends letter to currentInput', () => {
    const next = gameReducer(playingState, { type: 'TYPE_LETTER', letter: 'c' })
    expect(next.currentInput).toEqual(['c'])
  })

  it('TYPE_LETTER ignores input when currentInput is full (5 letters)', () => {
    const full = { ...playingState, currentInput: ['a','b','c','d','e'] }
    const next = gameReducer(full, { type: 'TYPE_LETTER', letter: 'f' })
    expect(next.currentInput).toEqual(['a','b','c','d','e'])
  })

  it('TYPE_LETTER ignores input when status is not playing', () => {
    const won = { ...playingState, status: 'won' as const }
    const next = gameReducer(won, { type: 'TYPE_LETTER', letter: 'a' })
    expect(next.currentInput).toEqual([])
  })

  it('DELETE_LETTER removes last letter', () => {
    const state = { ...playingState, currentInput: ['c','r'] }
    const next = gameReducer(state, { type: 'DELETE_LETTER' })
    expect(next.currentInput).toEqual(['c'])
  })

  it('DELETE_LETTER does nothing on empty input', () => {
    const next = gameReducer(playingState, { type: 'DELETE_LETTER' })
    expect(next.currentInput).toEqual([])
  })

  it('SUBMIT_GUESS appends guess and feedback, clears input', () => {
    const state = { ...playingState, currentInput: ['c','r','a','n','e'] }
    const next = gameReducer(state, { type: 'SUBMIT_GUESS' })
    expect(next.guesses).toEqual(['crane'])
    expect(next.feedback).toEqual([['G','G','G','G','G']])
    expect(next.currentInput).toEqual([])
  })

  it('SUBMIT_GUESS sets status to won when all feedback is G', () => {
    const state = { ...playingState, currentInput: ['c','r','a','n','e'] }
    const next = gameReducer(state, { type: 'SUBMIT_GUESS' })
    expect(next.status).toBe('won')
    expect(next.activeModal).toBe('game-over')
  })

  it('SUBMIT_GUESS sets status to lost after 6 wrong guesses', () => {
    const state = {
      ...playingState,
      guesses: ['abcde','fghij','klmno','pqrst','uvwxy'],
      feedback: [
        ['X','X','X','X','X'],
        ['X','X','X','X','X'],
        ['X','X','X','X','X'],
        ['X','X','X','X','X'],
        ['X','X','X','X','X'],
      ] as const,
      currentInput: ['z','z','z','z','z'],
    }
    const next = gameReducer(state, { type: 'SUBMIT_GUESS' })
    expect(next.status).toBe('lost')
    expect(next.activeModal).toBe('game-over')
  })

  it('RESTORE_STATE replaces guesses, feedback, and status', () => {
    const next = gameReducer(playingState, {
      type: 'RESTORE_STATE',
      guesses: ['crane'],
      feedback: [['G','G','G','G','G']],
      status: 'won',
    })
    expect(next.guesses).toEqual(['crane'])
    expect(next.status).toBe('won')
  })

  it('SET_SHAKING updates isShaking', () => {
    expect(gameReducer(playingState, { type: 'SET_SHAKING', value: true }).isShaking).toBe(true)
    expect(gameReducer(playingState, { type: 'SET_SHAKING', value: false }).isShaking).toBe(false)
  })

  it('OPEN_MODAL sets activeModal', () => {
    const next = gameReducer(playingState, { type: 'OPEN_MODAL', modal: 'how-to-play' })
    expect(next.activeModal).toBe('how-to-play')
  })

  it('CLOSE_MODAL clears activeModal', () => {
    const state = { ...playingState, activeModal: 'how-to-play' as const }
    const next = gameReducer(state, { type: 'CLOSE_MODAL' })
    expect(next.activeModal).toBeNull()
  })
})
