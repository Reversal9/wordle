import type { SavedState } from '../types'

function key(dateStr: string): string {
  return `dnw-${dateStr}`
}

export function saveState(dateStr: string, state: SavedState): void {
  localStorage.setItem(key(dateStr), JSON.stringify(state))
}

export function loadState(dateStr: string): SavedState | null {
  const raw = localStorage.getItem(key(dateStr))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.guesses) || !Array.isArray(parsed.feedback)) return null
    return parsed as SavedState
  } catch {
    return null
  }
}
