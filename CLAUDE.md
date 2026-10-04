# TWENTESIXTEN — AI DEVELOPMENT INSTRUCTIONS

## 1. PROJECT IDENTITY

Project name: TWENTESIXTEN

TWENTESIXTEN is a 2D story-driven web game set in a Filipino provincial neighborhood around the year 2016.

The game focuses on exploration, NPC interaction, memories, quests, and an emotional story involving Lola.

The goal is to create a polished, playable 15–20 minute experience suitable for a school project/title defense and portfolio.

The game must feel like an actual small 2D game, NOT a simple Canvas demonstration.

---

# 2. TECHNOLOGY STACK

Use:

* React
* Vite
* JavaScript
* HTML5 Canvas
* CSS
* Tailwind CSS only where appropriate for UI
* Git/GitHub
* Vercel for deployment

Do NOT introduce Godot, Unity, Phaser, PixiJS, or another game engine unless explicitly requested.

Prefer native JavaScript and Canvas for the actual gameplay.

React should primarily manage application/UI state and interface components.

Canvas should handle the game world and gameplay rendering.

---

# 3. DEVELOPMENT PHILOSOPHY

The developer is responsible for:

* Game design decisions
* Story decisions
* Map layout
* Asset selection
* Gameplay feel
* Final playtesting
* Deciding whether something looks/feels correct

Claude Code is responsible for:

* Implementing features
* Creating and modifying code
* Connecting systems
* Refactoring
* Debugging
* Fixing implementation errors
* Running build checks
* Maintaining project structure
* Investigating bugs
* Improving code quality
* Completing repetitive implementation work

Do not repeatedly ask the developer to manually write code when the task can be implemented automatically.

When requirements are sufficiently clear, implement them.

Ask for clarification only when a decision genuinely cannot be inferred safely.

---

# 4. IMPORTANT RULE

DO NOT redesign the game without permission.

Do not:

* Replace the intended gameplay
* Rewrite the story
* Replace the map
* Remove existing features
* Replace assets unnecessarily
* Change the visual direction
* Introduce a different framework
* Simplify the game into a basic demo

If something is technically difficult, find a reasonable implementation rather than changing the game's design.

---

# 5. EXISTING ASSETS

The developer may provide prepared:

* Character sprites
* NPC sprites
* Tiles
* Buildings
* Trees
* Objects
* Backgrounds
* UI assets
* Audio
* Other game assets

Inspect the available assets before creating replacements.

Reuse existing assets whenever possible.

Do not generate placeholder graphics when a suitable existing asset is already available.

If an asset is missing, use a temporary placeholder only when necessary and clearly structure the code so the asset can easily be replaced later.

---

# 6. GAME STRUCTURE

The intended game flow is:

MAIN MENU
↓
START GAME
↓
PLAYER ENTERS NEIGHBORHOOD
↓
EXPLORE
↓
TALK TO NPCs
↓
RECEIVE OBJECTIVES
↓
INTERACT WITH ENVIRONMENT
↓
COMPLETE STORY EVENTS
↓
DISCOVER MEMORIES
↓
LOLA STORY
↓
FINAL STORY EVENT
↓
ENDING

The experience should be approximately 15–20 minutes.

---

# 7. CORE GAME SYSTEMS

Build the game using modular systems.

Expected systems include:

## Player

Responsible for:

* Movement
* Direction
* Animation
* Collision
* Interaction range
* Player position
* Movement speed
* Input

## Camera

Responsible for:

* Following player
* Keeping player within the viewport
* World scrolling
* Map boundaries

## Map

Responsible for:

* World layout
* Walkable areas
* Buildings
* Roads
* Trees
* Objects
* NPC locations
* Collision areas

The developer controls the actual map layout.

Do not automatically redesign map placement.

## Collision

Support collision with:

* Buildings
* Walls
* Trees
* Fences
* Objects
* Other designated obstacles

Collision should be maintainable through clear data/configuration instead of hundreds of unrelated hardcoded conditions.

## NPC

NPCs should support:

* Position
* Sprite
* Name
* Dialogue
* Interaction
* Optional quest
* Optional story trigger
* Optional movement

Create reusable NPC logic.

Do not hardcode every NPC as a completely separate system.

## Interaction

Player should be able to approach an interactable object/NPC and trigger interaction.

Example:

Press E → interact.

The interaction system should be reusable for:

* NPCs
* Items
* Objects
* Quest locations
* Story triggers

## Dialogue

Dialogue should support:

* Speaker name
* Dialogue text
* Multiple lines
* Continue
* Player choices
* Branching responses when necessary
* Story flags

Do not hardcode dialogue directly into rendering logic.

Keep dialogue data separate from UI logic.

## Quest System

Support:

* Quest creation
* Objectives
* Quest progress
* Quest completion
* Story triggers
* Rewards/events

Example:

Quest:
"Talk to Lola"

Objective:
Find Lola

Completion:
Player interacts with Lola.

## Story State

Use a centralized story/game state system.

Story flags may include things such as:

* talkedToNPC
* foundCamera
* foundLetter
* talkedToLola
* completedQuest
* triggeredMemory
* reachedEnding

Avoid scattering story variables across unrelated components.

---

# 8. GAME WORLD

The world should feel like a Filipino provincial neighborhood around 2016.

Potential locations include:

* Houses
* Roads
* Sari-sari store
* Basketball court
* Trees
* Small pathways
* Neighborhood objects
* Other environmental details

The world should feel lived-in rather than empty.

However, do not add unnecessary systems simply for complexity.

Prioritize:

1. Playability
2. Story
3. Exploration
4. Interaction
5. Atmosphere
6. Polish

---

# 9. STORY DIRECTION

The story centers around memories and Lola.

The player explores the neighborhood and gradually discovers story elements.

The experience should build toward a meaningful final revelation.

The planned ending involves the realization that the Lola experience is connected to a dream/memory and the player's longing to return to a past time.

Do not rewrite this story direction unless explicitly instructed.

The emotional impact should come from:

* Dialogue
* Environment
* Memories
* Small discoveries
* Pacing
* Music/audio
* The final reveal

Do not overcomplicate the narrative.

---

# 10. LOLA NPC

Lola is a major character.

The long-term design may include an AI-powered Lola conversation system where the player can type natural messages and receive responses.

This feature should be modular.

Do not make the entire game dependent on an external AI API.

The game must remain playable if the AI feature is unavailable.

For the first implementation, prioritize the normal game systems.

AI Lola can be integrated afterward.

If an AI API is added:

* Never expose secret API keys in frontend code.
* Use a secure server-side endpoint.
* Keep API keys in environment variables.
* Handle API errors gracefully.
* Provide a fallback response/system.

---

# 11. ARCHITECTURE

Prefer a structure similar to:

src/
components/
game/
Game.jsx
GameLoop.js
Player.js
Camera.js
Collision.js
Map.js
NPC.js
Interaction.js
Quest.js
StoryState.js
data/
dialogues/
quests/
npcs/
map/
assets/
styles/
App.jsx
main.jsx

Adapt the structure when necessary.

Do not create hundreds of unnecessary files.

Keep responsibilities clear.

---

# 12. GAME LOOP

The Canvas game should have a stable game loop.

Separate:

UPDATE

from:

RENDER

Conceptually:

game loop
↓
handle input
↓
update player
↓
update NPCs
↓
update quests/story
↓
update camera
↓
render world
↓
render entities
↓
repeat

Avoid putting all game logic into one enormous React component.

---

# 13. REACT RESPONSIBILITIES

Use React for:

* Menus
* Dialogue UI
* Quest UI
* HUD
* Pause screen
* Settings
* Game state that benefits from React
* Other interface elements

Do not force every game object to become a React component.

Canvas should handle large numbers of continuously rendered game objects.

---

# 14. PERFORMANCE

Keep the game lightweight.

Avoid unnecessary:

* Re-renders
* Event listeners
* Object creation inside every animation frame
* DOM elements for every game object
* Expensive calculations every frame

Use Canvas for world rendering.

Use React state for interface/game states that actually need React.

---

# 15. ERROR HANDLING

After implementing a feature:

1. Check the affected files.
2. Check imports/exports.
3. Check syntax.
4. Run the appropriate build/test command when available.
5. Fix implementation errors.
6. Check for obvious runtime problems.
7. Only then consider the feature complete.

Do not declare a feature complete simply because the code was written.

---

# 16. BUILD VERIFICATION

Before finishing a major phase, run the project build.

Expected command:

npm run build

If the project contains tests, run the relevant tests.

If there are errors:

* Investigate them.
* Fix them.
* Run the check again.

Do not leave known compilation errors unresolved.

---

# 17. TESTING PHILOSOPHY

Claude is responsible for automated/technical verification where possible.

The developer is responsible for final human gameplay testing.

Claude should verify:

* Build succeeds
* Imports resolve
* No obvious syntax errors
* No obvious runtime errors
* Systems connect correctly
* Data structures are consistent

The developer will verify:

* Does movement feel good?
* Does the map look correct?
* Does the game feel fun?
* Are NPCs positioned correctly?
* Does the story make sense?
* Does the pacing feel right?
* Does the game look good?
* Are there gameplay bugs that automated checks cannot detect?

---

# 18. WHEN THE DEVELOPER REPORTS A BUG

Do not immediately rewrite unrelated systems.

First:

1. Understand the reported behavior.
2. Locate the likely system responsible.
3. Inspect relevant code.
4. Determine the root cause.
5. Make the smallest appropriate fix.
6. Verify the fix.
7. Check that the fix did not break another system.

Example:

Developer:
"Player gets stuck near the sari-sari store."

Claude should investigate:

Player movement
↓
Collision
↓
Store collision rectangle
↓
Map coordinates

Then fix the actual cause.

---

# 19. DO NOT OVERENGINEER

This is a school/portfolio game.

Do not create unnecessary enterprise-level architecture.

Prefer:

simple
modular
readable
maintainable
working

over:

complex
abstract
over-engineered

A feature is successful when it works reliably in the game.

---

# 20. DEVELOPMENT PHASES

Work through these phases.

## PHASE 1 — Foundation

* React/Vite setup
* Canvas
* Game container
* Basic game loop
* Basic input system

## PHASE 2 — Player

* Player rendering
* Movement
* Direction
* Animation
* Collision
* Boundaries

## PHASE 3 — Camera + World

* Map rendering
* Camera
* World coordinates
* Map boundaries
* Existing assets

## PHASE 4 — Environment

* Buildings
* Trees
* Roads
* Basketball court
* Sari-sari store
* Collision objects
* Environmental decoration

## PHASE 5 — NPC SYSTEM

* NPC data
* NPC rendering
* NPC interaction
* NPC dialogue

## PHASE 6 — DIALOGUE SYSTEM

* Dialogue UI
* Multiple dialogue lines
* Choices
* Branches
* Story flags

## PHASE 7 — QUEST SYSTEM

* Quest data
* Objectives
* Progress
* Completion
* Story triggers

## PHASE 8 — ITEMS + MEMORIES

* Camera
* Letter/clue
* Collectible/story items
* Memory events

## PHASE 9 — MAIN STORY

Implement the intended story sequence.

Do not invent major story changes.

## PHASE 10 — LOLA

Implement Lola interaction.

Keep AI functionality modular and optional.

## PHASE 11 — ENDING

Implement the final story sequence and reveal.

## PHASE 12 — POLISH

Add:

* UI polish
* Animations
* Sound
* Music
* Visual effects
* Transitions
* Better dialogue presentation
* Environmental atmosphere

## PHASE 13 — QUALITY CHECK

Check:

* Build
* Runtime errors
* Broken imports
* Missing assets
* Collision
* NPC interaction
* Quest progression
* Dialogue
* Story progression
* Restarting the game
* Ending

## PHASE 14 — FINAL PLAYTEST

The developer plays the entire game from beginning to end.

Claude fixes issues reported during playtesting.

---

# 21. WORKING WITH THE DEVELOPER

The developer may give short instructions such as:

"Add collision to the store."

"NPC isn't appearing."

"Make the player faster."

"The dialogue box is too large."

"Make this quest trigger after talking to Lola."

"Move this NPC."

"Fix this error."

Interpret these instructions in the context of the entire project.

Do not require the developer to explain the entire architecture every time.

Inspect the project before making changes.

---

# 22. IMPORTANT: PRESERVE WORKING FEATURES

Before modifying an existing system:

* Inspect how it currently works.
* Identify dependencies.
* Avoid unnecessary rewrites.

If a feature already works, preserve it unless the developer explicitly requests a redesign.

Do not replace working systems merely because another implementation seems cleaner.

---

# 23. GIT

Use Git regularly.

Before major risky changes, create a commit when appropriate.

Use meaningful commit messages.

Example:

feat: add NPC interaction system

fix: resolve player collision near store

feat: add Lola dialogue

refactor: separate story state from dialogue UI

---

# 24. CLAUDE CODE BEHAVIOR

When working on this project:

* Inspect before modifying.
* Reuse existing code when appropriate.
* Implement complete features rather than half-features.
* Fix errors you introduce.
* Avoid unnecessary questions.
* Do not redesign without permission.
* Keep the project runnable.
* Keep code understandable.
* Prefer incremental changes.
* Verify important changes.
* Tell the developer what was changed after completing work.

The developer should not have to manually perform routine implementation steps that Claude can safely perform.

---

# 25. DEFINITION OF DONE

A feature is NOT DONE merely because code exists.

A feature is DONE when:

* Implementation exists.
* Imports work.
* Build succeeds.
* No known implementation errors remain.
* The feature integrates with the existing game.
* It does not unnecessarily break existing functionality.

Final gameplay approval belongs to the developer.

---

# 26. FINAL PRIORITY

When making decisions, prioritize:

1. Game is playable.
2. Game does not break.
3. Story works.
4. Player can navigate the world.
5. Player can interact.
6. Quests progress correctly.
7. Ending can be reached.
8. Game feels polished.
9. Code remains maintainable.
10. Additional features.

Do not sacrifice a working core game for unnecessary features.

---

# 27. MOST IMPORTANT INSTRUCTION

The developer wants to focus on:

GAME DESIGN
MAP
STORY
GAMEPLAY
ASSETS
FINAL TESTING

Claude Code should handle as much of the implementation, debugging, refactoring, and repetitive development work as safely possible.

The objective is to help the developer FINISH TWENTESIXTEN, not to create unnecessary complexity.

Build the game systematically.

Keep it playable.

Keep it stable.

Keep moving forward.
