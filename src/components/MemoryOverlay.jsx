// Memory presentation: a full-screen overlay for memory scenes (conversations with style 'memory').
// Purely visual; the dialogue state lives in game/Dialogue.js.
export default function MemoryOverlay({ text, hasMore }) {
  return (
    <section className="memory-overlay" role="dialog" aria-label="Memory">
      <p className="memory-text">{text}</p>
      <p className="memory-hint">{hasMore ? 'Press E / Enter / Space to continue' : 'Press E / Enter / Space to close'}</p>
    </section>
  )
}
