import { ThemeProvider } from '@/components/theme-provider'
import { useGame } from '@/hooks/useGame'
import { Header } from '@/components/Header'
import { Board } from '@/components/Board'
import { Keyboard } from '@/components/Keyboard'
import { ErrorScreen } from '@/components/ErrorScreen'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { GameOverModal } from '@/components/GameOverModal'
import { WelcomeBackModal } from '@/components/WelcomeBackModal'

export default function App() {
  const { state } = useGame()

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center min-h-screen max-w-[500px] mx-auto">
        <Header />
        {state.status === 'error' ? (
          <ErrorScreen />
        ) : (
          <>
            <main className="flex flex-col items-center flex-1 w-full pt-2">
              <Board />
            </main>
            <footer className="w-full pb-4">
              <Keyboard />
            </footer>
          </>
        )}
        <HowToPlayModal />
        <GameOverModal />
        <WelcomeBackModal />
      </div>
    </ThemeProvider>
  )
}
