// Main menu text. Edit freely; no component code needs to change.
//
// `items` is the order the menu shows and the order the arrow keys walk through.
// Each item's `action` is handled in components/MainMenu.jsx:
//   start  begins the game        panel  opens the matching panel below
//   quit   tries to close the tab
//
// The wording here is a first draft. Rewrite it in your own voice before the defense.

export const MENU_ITEMS = [
  { id: 'start', label: 'Start Game', action: 'start', tone: 'green' },
  { id: 'about', label: 'About the Game', action: 'panel', tone: 'blue' },
  { id: 'how', label: 'How to Play', action: 'panel', tone: 'yellow' },
  { id: 'settings', label: 'Settings', action: 'panel', tone: 'orange' },
  { id: 'credits', label: 'Credits', action: 'panel', tone: 'grey' },
  { id: 'quit', label: 'Quit', action: 'quit', tone: 'plain' },
]

export const MENU_PANELS = {
  about: {
    title: 'About the Game',
    // Deliberately says nothing about the ending.
    blocks: [
      {
        type: 'text',
        text: 'TWENTESIXTEN is a short story game set in a Filipino provincial neighborhood in 2016.',
      },
      {
        type: 'text',
        text: 'You walk the barangay, talk to the people who live there, and piece together small memories hidden in ordinary places: a stall, a bench, a house on stilts.',
      },
      {
        type: 'text',
        text: 'It takes about fifteen to twenty minutes to reach the end.',
      },
    ],
  },

  how: {
    title: 'How to Play',
    blocks: [
      { type: 'keys', label: 'Walk', keys: ['W', 'A', 'S', 'D'], alt: 'Arrow keys' },
      { type: 'keys', label: 'Talk or examine', keys: ['E'] },
      { type: 'keys', label: 'Continue dialogue', keys: ['E', 'Enter', 'Space'] },
      {
        type: 'text',
        text: 'Walk up to a person or an object. When its name appears at the bottom of the screen you are close enough to interact.',
      },
      {
        type: 'text',
        text: 'Your current objective sits in the top left. Finish one and the next appears.',
      },
    ],
  },

  credits: {
    title: 'Credits',
    blocks: [
      { type: 'role', role: 'Design, story and development', name: 'Fhiej Dale Placer' },
      { type: 'role', role: 'Art', name: 'Sprite sheets in public/assets' },
      { type: 'role', role: 'Built with', name: 'React, Vite and HTML5 Canvas' },
      {
        type: 'text',
        text: 'Made as a school project. Replace these lines with the real credits before the defense.',
      },
    ],
  },
}
