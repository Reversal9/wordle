import raw from '../../data/valid-wordle-words.txt?raw'

export const validWords: Set<string> = new Set(
  raw.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean)
)
