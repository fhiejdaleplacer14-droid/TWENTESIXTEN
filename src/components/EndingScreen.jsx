import { ENDING } from '../data/ending.js'

// Shown after the story is complete. Offers a fresh game or a return to the menu.
export default function EndingScreen({ onRestart, onMenu }) {
  return (
    <main className="shell ending-screen">
      <h1 className="title">{ENDING.title}</h1>
      <p className="ending-label">{ENDING.label}</p>
      {ENDING.lines.map((line) => (
        <p key={line} className="ending-line">
          {line}
        </p>
      ))}
      <div className="ending-actions">
        <button type="button" className="button" onClick={onRestart}>
          {ENDING.restartLabel}
        </button>
        <button type="button" className="button" onClick={onMenu}>
          {ENDING.menuLabel}
        </button>
      </div>
    </main>
  )
}
