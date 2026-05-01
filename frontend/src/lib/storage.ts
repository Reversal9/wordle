import { SavedState } from '../types'

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
    return JSON.parse(raw) as SavedState
  } catch {
    return null
  }
}
