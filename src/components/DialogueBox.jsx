// Dialogue box. Purely visual: the dialogue state lives in game/Dialogue.js.
export default function DialogueBox({ speaker, text, hasMore }) {
  return (
    <section className="dialogue-box" role="dialog" aria-label={`Conversation with ${speaker}`}>
      <p className="dialogue-speaker">{speaker}</p>
      <p className="dialogue-text">{text}</p>
      <p className="dialogue-hint">
        {hasMore ? 'Press E / Enter / Space to continue' : 'Press E / Enter / Space to close'}
      </p>
    </section>
  )
}
