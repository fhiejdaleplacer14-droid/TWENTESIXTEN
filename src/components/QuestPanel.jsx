// Current objective panel. Purely visual: quest state lives in game/Quests.js.
export default function QuestPanel({ quest }) {
  return (
    <section className="quest-panel" aria-label="Current objective">
      <p className="quest-label">Current Objective</p>
      <p className="quest-title">{quest.title}</p>
      <p className="quest-objective">{quest.objective}</p>
      <p className="quest-step">
        {quest.step} / {quest.total}
      </p>
    </section>
  )
}
