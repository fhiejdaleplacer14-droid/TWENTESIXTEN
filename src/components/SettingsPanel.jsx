// Settings panel. Only holds settings that actually do something — there are no
// placeholder switches here. Sound and music join this panel once the game has audio.

import { useEffect, useState } from 'react'

function isFullscreen() {
  return typeof document !== 'undefined' && document.fullscreenElement !== null
}

export default function SettingsPanel({ onClose }) {
  const [fullscreen, setFullscreen] = useState(isFullscreen)
  const [unsupported, setUnsupported] = useState(false)

  // The browser can leave fullscreen on its own (Escape, or the user's window controls),
  // so the switch follows the document rather than its own state.
  useEffect(() => {
    const sync = () => setFullscreen(isFullscreen())
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  async function toggleFullscreen() {
    try {
      if (isFullscreen()) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Some browsers refuse fullscreen (notably iOS Safari). Say so rather than
      // leaving a switch that silently does nothing.
      setUnsupported(true)
    }
  }

  return (
    <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Settings">
      <h2 className="menu-sheet__title">Settings</h2>

      <div className="menu-sheet__body">
        <div className="menu-setting">
          <span className="menu-setting__label">Fullscreen</span>
          <button
            type="button"
            className={`menu-switch${fullscreen ? ' menu-switch--on' : ''}`}
            onClick={toggleFullscreen}
            aria-pressed={fullscreen}
          >
            {fullscreen ? 'On' : 'Off'}
          </button>
        </div>

        {unsupported && <p className="menu-sheet__note">This browser would not allow fullscreen.</p>}

        <p className="menu-sheet__note">
          Music and sound effects will appear here once the game has audio. Nothing else is
          adjustable yet, so there is nothing else listed.
        </p>
      </div>

      <button type="button" className="menu-button menu-button--grey" onClick={onClose}>
        Back
      </button>
    </div>
  )
}
