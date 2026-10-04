// Main menu: the painted barangay scene with the menu built on top of it as real
// buttons, so it scales, takes keyboard input and reads correctly to a screen reader.
//
// The artwork (public/assets/menu_background.jpg) already has a bamboo panel painted in
// the middle of it. Our panel sits exactly over that one and hides it. If you ever
// export a version of the scene without the painted panel, nothing here needs to
// change — the panel just stops having anything to cover.

import { useCallback, useEffect, useState } from 'react'
import { MENU_ITEMS, MENU_PANELS } from '../data/menuContent.js'
import MenuPanel from './MenuPanel.jsx'
import SettingsPanel from './SettingsPanel.jsx'

export default function MainMenu({ onStart }) {
  // Which menu row the keyboard is on.
  const [cursor, setCursor] = useState(0)
  // Which panel is open ('about' | 'how' | 'settings' | 'credits' | 'quit'), or null.
  const [open, setOpen] = useState(null)

  const closePanel = useCallback(() => setOpen(null), [])

  const activate = useCallback(
    (item) => {
      if (item.action === 'start') onStart()
      else setOpen(item.id)
    },
    [onStart],
  )

  // Arrow keys walk the list, Enter or Space picks, Escape closes a panel.
  useEffect(() => {
    function onKeyDown(event) {
      if (open) {
        if (event.key === 'Escape') {
          event.preventDefault()
          closePanel()
        }
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const step = event.key === 'ArrowDown' ? 1 : -1
        setCursor((index) => (index + step + MENU_ITEMS.length) % MENU_ITEMS.length)
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        activate(MENU_ITEMS[cursor])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cursor, open, activate, closePanel])

  return (
    <main className="menu">
      {/* The scene blurred and darkened, so the letterboxed edges are never bare. */}
      <div className="menu__backdrop" aria-hidden="true" />

      {/* The artwork at its own aspect ratio, as large as fits. The panel is placed in
          percentages of this box, which is what keeps it over the painted one. */}
      <div className="menu__stage">
        <img className="menu__art" src="/assets/menu_background.jpg" alt="" />

        <div className="menu__panel">
          <h1 className="menu__title">TWENTESIXTEN</h1>

          <nav className="menu__items" aria-label="Main menu">
            {MENU_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`menu-button menu-button--${item.tone}${index === cursor ? ' is-selected' : ''}`}
                onClick={() => activate(item)}
                onMouseEnter={() => setCursor(index)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {open && (
        <Overlay onClose={closePanel}>
          {open === 'settings' && <SettingsPanel onClose={closePanel} />}

          {open === 'quit' && (
            <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Quit">
              <h2 className="menu-sheet__title">Quit</h2>
              <div className="menu-sheet__body">
                {/* A page can only close a window it opened itself, so there is nothing
                    honest to do here but say how to leave. */}
                <p className="menu-sheet__text">
                  TWENTESIXTEN runs in your browser, so close this tab or window to quit.
                </p>
                <p className="menu-sheet__note">Salamat sa paglalaro.</p>
              </div>
              <button type="button" className="menu-button menu-button--grey" onClick={closePanel}>
                Back
              </button>
            </div>
          )}

          {MENU_PANELS[open] && <MenuPanel panel={MENU_PANELS[open]} onClose={closePanel} />}
        </Overlay>
      )}
    </main>
  )
}

// Dims the menu behind a panel. Clicking the dimmed area closes it; clicking the panel
// does not. The check is on the event target rather than a wrapper element, because a
// wrapper would have no width of its own and the panel inside would collapse with it.
function Overlay({ onClose, children }) {
  return (
    <div
      className="menu__overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </div>
  )
}
