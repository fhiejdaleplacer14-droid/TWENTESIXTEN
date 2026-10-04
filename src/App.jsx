import { useCallback, useState } from 'react'
import EndingScreen from './components/EndingScreen.jsx'
import GameScreen from './components/GameScreen.jsx'
import MainMenu from './components/MainMenu.jsx'
import './App.css'

function App() {
  const [screen, setScreen] = useState('menu')
  // Changing the key remounts the game, so each playthrough starts with fresh story state.
  const [gameKey, setGameKey] = useState(0)

  const showEnding = useCallback(() => setScreen('ending'), [])

  function startGame() {
    setGameKey((key) => key + 1)
    setScreen('game')
  }

  if (screen === 'game') {
    return <GameScreen key={gameKey} onBack={() => setScreen('menu')} onFinished={showEnding} />
  }

  if (screen === 'ending') {
    return <EndingScreen onRestart={startGame} onMenu={() => setScreen('menu')} />
  }

  return <MainMenu onStart={startGame} />
}

export default App
