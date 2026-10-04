import { useEffect, useRef } from 'react'
import { createGame } from '../game/Game.js'
import { createGameLoop } from '../game/GameLoop.js'
import { createInput } from '../game/Input.js'

// React only mounts the canvas and sizes it. The loop runs outside React, so no
// component re-renders during gameplay. Game events reach React through the callbacks,
// which the engine calls only when something changes (not every frame).
export default function GameCanvas({ onPromptChange, onDialogueChange, onQuestChange, onQuestNotice, onEnding }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  // Keep the latest callbacks without restarting the engine when they change.
  const callbacks = useRef({})
  useEffect(() => {
    callbacks.current = { onPromptChange, onDialogueChange, onQuestChange, onQuestNotice, onEnding }
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const input = createInput(window)
    const game = createGame(canvas, input, {
      onPromptChange: (prompt) => callbacks.current.onPromptChange?.(prompt),
      onDialogueChange: (view) => callbacks.current.onDialogueChange?.(view),
      onQuestChange: (view) => callbacks.current.onQuestChange?.(view),
      onQuestNotice: (notice) => callbacks.current.onQuestNotice?.(notice),
      onEnding: () => callbacks.current.onEnding?.(),
    })
    const loop = createGameLoop({
      update: game.update,
      render: game.render,
      onFrameEnd: input.endFrame,
    })

    function resize() {
      const rect = container.getBoundingClientRect()
      game.resize(rect.width, rect.height, window.devicePixelRatio || 1)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    loop.start()

    return () => {
      loop.stop()
      observer.disconnect()
      input.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className="game-container">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  )
}
