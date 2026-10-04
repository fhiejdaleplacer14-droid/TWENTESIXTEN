import { useState } from 'react'
import GameCanvas from './components/GameCanvas.jsx'
import './App.css'

function App() {
  const [screen, setScreen] = useState('menu')

  if (screen === 'game') {
    return (
      <main className="game-screen">
        <GameCanvas />
        <button type="button" className="button back-button" onClick={() => setScreen('menu')}>
          Back to menu
        </button>
      </main>
    )
  }

  return (
    <main className="shell">
      <h1 className="title">TWENTESIXTEN</h1>
      <button type="button" className="button" onClick={() => setScreen('game')}>
        Start
      </button>
    </main>
  )
}

export default App
