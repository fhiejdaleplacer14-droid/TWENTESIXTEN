// Dialogue state: which conversation is running and which entry is showing.
// Knows nothing about React or drawing. Game.js reads its state and forwards it to the UI.

import { DIALOGUES } from '../data/dialogues.js'

// Keys that advance dialogue. Any of them counts as one press.
const ADVANCE_KEYS = ['KeyE', 'Enter', 'Space']

// Returns true if an advance key was pressed this step, and consumes all of them
// so a single press cannot advance more than one entry.
export function wasAdvancePressed(input) {
  let pressed = false
  for (const code of ADVANCE_KEYS) {
    if (input.wasPressed(code)) pressed = true
  }
  if (pressed) {
    for (const code of ADVANCE_KEYS) input.consume(code)
  }
  return pressed
}

// Index of the entry after `index`, or null when the conversation ends.
function nextIndex(conversation, index) {
  const entry = conversation.entries[index]
  if (entry.next === null) return null
  if (entry.next !== undefined) {
    const target = conversation.entries.findIndex((other) => other.id === entry.next)
    return target === -1 ? null : target
  }
  return index + 1 < conversation.entries.length ? index + 1 : null
}

export function createDialogue() {
  let conversation = null
  let index = 0

  function view() {
    const entry = conversation.entries[index]
    return {
      speaker: entry.speaker,
      text: entry.text,
      hasMore: nextIndex(conversation, index) !== null,
      style: conversation.style ?? 'dialogue',
      pause: entry.pause ?? null, // seconds before auto-advancing, or null to wait for a key
    }
  }

  return {
    get isActive() {
      return conversation !== null
    },

    // Starts a conversation by id. Returns the first entry view, or null if the id is unknown.
    start(dialogueId) {
      const data = dialogueId && DIALOGUES[dialogueId]
      if (!data || data.entries.length === 0) return null
      conversation = data
      index = 0
      return view()
    },

    // Moves to the next entry. Returns { view, finished }:
    //   view      the new entry's view, or null when the conversation has ended
    //   finished  the conversation data when it has just ended (so its onEnd actions can run), otherwise null
    advance() {
      if (!conversation) return { view: null, finished: null }
      const next = nextIndex(conversation, index)
      if (next === null) {
        const finished = conversation
        conversation = null
        return { view: null, finished }
      }
      index = next
      return { view: view(), finished: null }
    },
  }
}
