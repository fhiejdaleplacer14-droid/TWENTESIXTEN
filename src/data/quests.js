// Quest data (temporary test quest). Edit this file to change quests; no engine code needs to change.
//
// A quest:
//   id, title, description
//   prerequisite   optional quest id that must be completed before this one can start
//   objectives     ordered list. Only the current objective can progress.
//   onComplete     optional actions run when the quest completes, e.g. { startQuest: 'next-id' }
//
// An objective:
//   id     unique within the quest
//   type   'talk' | 'reach' | 'interact'
//   target 'talk': npc id     'reach': zone id     'interact': interactable id
//   text   what the player sees in the quest panel
//
// Dialogue can start a quest by listing { startQuest: id } in the conversation's onEnd
// (see data/dialogues.js).

export const QUESTS = {
  'small-errand': {
    id: 'small-errand',
    title: 'A Small Errand',
    description: 'A neighbor has a few things to check around the barangay.',
    prerequisite: null,
    objectives: [
      { id: 'talk-store-owner', type: 'talk', target: 'store-owner', text: 'Talk to the Store Owner' },
      { id: 'reach-court', type: 'reach', target: 'basketball-court', text: 'Go to the basketball court' },
      { id: 'inspect-bench', type: 'interact', target: 'old-bench', text: 'Inspect the bench' },
    ],
    onComplete: null,
  },
}
