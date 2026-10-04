// NPC definitions (temporary test cast). Edit this file to add, move or restyle NPCs;
// no engine code needs to change.
//
// Fields:
//   id, name           identifiers shown in the interaction prompt
//   x, y               feet position in world coordinates
//   direction          'down' | 'up' | 'left' | 'right' (which way they face)
//   solid              true blocks the player from walking through them
//   interactionRange   how close the player's feet must be (world pixels)
//   appearance         placeholder colours until real NPC sprites exist
//   dialogueId         conversation to start on interact (key in data/dialogues.js)
//   focus              optional. Camera centres on this NPC during its conversation
//   requires           optional story flags that must all be set before the NPC appears
//   metadata           reserved for future hooks

export const NPC_DEFINITIONS = [
  {
    id: 'store-owner',
    name: 'Store Owner',
    x: 980,
    y: 672,
    direction: 'down',
    solid: true,
    interactionRange: 56,
    appearance: { shirt: '#d9a441', pants: '#3b4a6b', skin: '#c68642', hair: '#2b1d14' },
    dialogueId: 'store-owner.greeting',
    metadata: {},
  },
  {
    id: 'neighbor',
    name: 'Neighbor',
    x: 700,
    y: 870,
    direction: 'down',
    solid: true,
    interactionRange: 56,
    appearance: { shirt: '#5b8fb9', pants: '#33333a', skin: '#8d5524', hair: '#1a1410' },
    dialogueId: 'neighbor.greeting',
    metadata: {},
  },
  {
    id: 'kid',
    name: 'Kid',
    x: 1230,
    y: 1180,
    direction: 'left',
    solid: true,
    interactionRange: 56,
    appearance: { shirt: '#e4572e', pants: '#2e4057', skin: '#c68642', hair: '#120c08' },
    dialogueId: 'kid.greeting',
    metadata: {},
  },
  {
    id: 'elder',
    name: 'Elder',
    x: 1700,
    y: 1060,
    direction: 'right',
    solid: true,
    interactionRange: 56,
    appearance: { shirt: '#8d6e63', pants: '#4e4e4e', skin: '#a0724a', hair: '#d9d9d9' },
    dialogueId: 'elder.greeting',
    metadata: {},
  },
  {
    // Story NPC. Hidden until the story flags are earned (see requires).
    id: 'lola',
    name: 'Lola',
    x: 2320,
    y: 540,
    direction: 'down',
    solid: true,
    interactionRange: 56,
    appearance: { shirt: '#e07a9b', pants: '#7a4f2e', skin: '#a0724a', hair: '#e8e8e8' },
    dialogueId: 'lola.final',
    focus: true, // camera centres on her during the conversation
    requires: ['foundCamera', 'foundLetter', 'memoryWatched'],
    metadata: {},
  },
]
