import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import { GameProvider } from './hooks/useGame'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <GameProvider>
        <App />
        <Toaster richColors />
      </GameProvider>
    </ThemeProvider>
  </StrictMode>,
)
