import { useEffect, useState } from 'react'
import DialogueBox from './DialogueBox.jsx'
import GameCanvas from './GameCanvas.jsx'
import MemoryOverlay from './MemoryOverlay.jsx'
import QuestPanel from './QuestPanel.jsx'

const NOTICE_DURATION_MS = 2500
const FADE_DURATION_MS = 2500

// The game screen: the canvas plus React overlays (interaction prompt, dialogue box or
// memory overlay, quest panel, quest notices, fade and back button).
// onFinished is called once the story's ending fade has finished.
export default function GameScreen({ onBack, onFinished }) {
  const [prompt, setPrompt] = useState(null)
  const [dialogue, setDialogue] = useState(null)
  const [quest, setQuest] = useState(null)
  // Notices carry an id so repeating the same text still restarts the timer.
  const [notice, setNotice] = useState(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!fading) return undefined
    const timer = setTimeout(onFinished, FADE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [fading, onFinished])

  function handleQuestNotice({ text }) {
    setNotice({ id: Date.now(), text })
  }

  const isMemory = dialogue?.style === 'memory'

  return (
    <main className="game-screen">
      <GameCanvas
        onPromptChange={setPrompt}
        onDialogueChange={setDialogue}
        onQuestChange={setQuest}
        onQuestNotice={handleQuestNotice}
        onEnding={() => setFading(true)}
      />

      {quest && !fading && <QuestPanel quest={quest} />}

      {notice && !fading && (
        <div key={notice.id} className="overlay-message quest-notice" role="status">
          {notice.text}
        </div>
      )}

      {prompt && !dialogue && (
        <div className="overlay-message interaction-prompt" role="status">
          Press E to interact · {prompt.name}
        </div>
      )}

      {dialogue && !isMemory && <DialogueBox speaker={dialogue.speaker} text={dialogue.text} hasMore={dialogue.hasMore} />}

      {dialogue && isMemory && <MemoryOverlay text={dialogue.text} hasMore={dialogue.hasMore} />}

      {fading && <div className="fade-overlay" aria-hidden="true" />}

      {!fading && (
        <button type="button" className="button back-button" onClick={onBack}>
          Back to menu
        </button>
      )}
    </main>
  )
}
