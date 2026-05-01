import { useGame } from '@/hooks/useGame'
import { Key } from '@/components/Key'

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['Enter','z','x','c','v','b','n','m','Backspace'],
]

export function Keyboard() {
  const { keyboardColors } = useGame()

  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-[500px] mx-auto px-1">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5 justify-center w-full">
          {row.map(key => (
            <Key key={key} value={key} feedback={keyboardColors.get(key)} />
          ))}
        </div>
      ))}
    </div>
  )
}
