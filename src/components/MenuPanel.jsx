// One main-menu panel (About, How to Play, Credits). Renders the blocks described in
// data/menuContent.js, so the text lives in data rather than in this component.

export default function MenuPanel({ panel, onClose }) {
  return (
    <div className="menu-sheet" role="dialog" aria-modal="true" aria-label={panel.title}>
      <h2 className="menu-sheet__title">{panel.title}</h2>

      <div className="menu-sheet__body">
        {panel.blocks.map((block, index) => {
          if (block.type === 'keys') {
            return (
              <p className="menu-keys" key={index}>
                <span className="menu-keys__label">{block.label}</span>
                <span className="menu-keys__keys">
                  {block.keys.map((key) => (
                    <kbd className="menu-key" key={key}>
                      {key}
                    </kbd>
                  ))}
                  {block.alt && <span className="menu-keys__alt">or {block.alt}</span>}
                </span>
              </p>
            )
          }

          if (block.type === 'role') {
            return (
              <p className="menu-role" key={index}>
                <span className="menu-role__role">{block.role}</span>
                <span className="menu-role__name">{block.name}</span>
              </p>
            )
          }

          return (
            <p className="menu-sheet__text" key={index}>
              {block.text}
            </p>
          )
        })}
      </div>

      <button type="button" className="menu-button menu-button--grey" onClick={onClose}>
        Back
      </button>
    </div>
  )
}
