// Quest state: which quests exist, their status, and which objective is current.
// Knows nothing about React or drawing. Game.js feeds it events and reads its state.
//
// Quest status: 'inactive' -> 'active' -> 'completed'
// Only one quest can be active at a time, and each quest's objectives are completed in order.

import { QUESTS } from '../data/quests.js'

const NO_CHANGE = Object.freeze({ changed: false, notices: Object.freeze([]) })

// Does this event complete this objective?
function matches(objective, event) {
  switch (objective.type) {
    case 'talk':
      return event.type === 'talked' && event.npcId === objective.target
    case 'reach':
      return event.type === 'reached' && event.zoneId === objective.target
    case 'interact':
      return event.type === 'interacted' && event.objectId === objective.target
    default:
      return false
  }
}

export function createQuests() {
  // Runtime state per quest, kept apart from the static definitions in data/quests.js.
  const state = new Map()
  for (const definition of Object.values(QUESTS)) {
    state.set(definition.id, { definition, status: 'inactive', index: 0 })
  }

  function activeState() {
    for (const quest of state.values()) {
      if (quest.status === 'active') return quest
    }
    return null
  }

  function start(id) {
    const quest = state.get(id)
    if (!quest || quest.status !== 'inactive' || activeState()) return NO_CHANGE

    const prerequisite = quest.definition.prerequisite
    if (prerequisite && state.get(prerequisite)?.status !== 'completed') return NO_CHANGE

    quest.status = 'active'
    quest.index = 0
    return { changed: true, notices: [] }
  }

  return {
    start,

    status(id) {
      return state.get(id)?.status ?? 'unknown'
    },

    // Feeds a game event (talked / reached / interacted) into the active quest.
    // Returns { changed, notices }; notices are short messages for the UI.
    handleEvent(event) {
      const quest = activeState()
      if (!quest) return NO_CHANGE

      const objectives = quest.definition.objectives
      if (!matches(objectives[quest.index], event)) return NO_CHANGE

      quest.index += 1
      const notices = []
      if (quest.index >= objectives.length) {
        quest.status = 'completed'
        notices.push({ text: `Quest Complete: ${quest.definition.title}` })
        // Chain to the next quest if this one says so.
        const next = quest.definition.onComplete?.startQuest
        if (next) start(next)
      } else {
        notices.push({ text: 'Objective Complete' })
      }
      return { changed: true, notices }
    },

    // What the quest panel should show, or null when no quest is active.
    activeView() {
      const quest = activeState()
      if (!quest) return null
      const objectives = quest.definition.objectives
      return {
        title: quest.definition.title,
        objective: objectives[quest.index].text,
        step: quest.index + 1,
        total: objectives.length,
      }
    },
  }
}
