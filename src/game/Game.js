// Game engine entry point. Owns the canvas context, the world, the camera, the player,
// NPCs, interaction, dialogue, quests and story state, and draws them in layers.
// Contains no React code.

import { NPC_DEFINITIONS } from '../data/npcs.js'
import { ENVIRONMENT_SHEET_URLS } from '../data/environmentSprites.js'
import { PLAYER_SHEET_URL } from '../data/playerSprites.js'
import { GROUND, PLAYER_START } from '../data/temporaryMap.js'
import { loadImage } from './Assets.js'
import { createCamera } from './Camera.js'
import { createDialogue, wasAdvancePressed } from './Dialogue.js'
import { createInteraction } from './Interaction.js'
import { createNpc } from './NPC.js'
import { createPlayer } from './Player.js'
import { createQuests } from './Quests.js'
import { createStoryState } from './StoryState.js'
import { createWorld } from './World.js'

const SHEET_URLS = { player: PLAYER_SHEET_URL, ...ENVIRONMENT_SHEET_URLS }

// callbacks (all optional):
//   onPromptChange({ id, name } | null)  the interactable in range changed
//   onDialogueChange(view | null)        the dialogue changed: { speaker, text, hasMore, style, pause }, or null when closed
//   onQuestChange(view | null)           the active objective changed: { title, objective, step, total }, or null
//   onQuestNotice({ text })              a short message such as "Objective Complete"
//   onEnding()                           the story reached its end; gameplay stops after this
//
// Game modes: gameplay (player moves, things can be interacted with) and dialogue
// (player is locked, interaction is off, advance keys step through the conversation).
//
// Game events feed the quest system: 'talked' (dialogue with an NPC finished),
// 'reached' (player entered a zone) and 'interacted' (player used an object).
// Story flags are set by dialogue actions and gate NPCs and objects (see data/npcs.js
// and data/neighborhoodLayout.js).
export function createGame(canvas, input, callbacks = {}) {
  const ctx = canvas.getContext('2d')
  const viewport = { width: 0, height: 0 }
  const world = createWorld()
  const camera = createCamera()
  const player = createPlayer(PLAYER_START.x, PLAYER_START.y)

  const npcs = NPC_DEFINITIONS.map(createNpc)
  world.addObjects(npcs)
  const placedInteractables = world.objects.filter((object) => object.isInteractable)
  const interaction = createInteraction()
  const dialogue = createDialogue()
  const quests = createQuests()
  const story = createStoryState()

  // Current things the player can interact with. Rebuilt whenever story flags change.
  let interactables = []

  // The NPC whose conversation is running, so finishing it can count as a 'talked' event.
  let talkingToNpcId = null
  // World point the camera centres on during a scripted scene (null = follow the player).
  let focusPoint = null
  // Seconds left before a timed dialogue entry advances on its own.
  let pauseLeft = 0
  // Set once the story ends. Nothing in the game reacts after that.
  let ended = false

  // Loaded sheets, keyed as in SHEET_URLS. Objects skip drawing until their sheet loads.
  const assets = { sheets: {} }
  for (const [key, url] of Object.entries(SHEET_URLS)) {
    loadImage(url)
      .then((image) => {
        assets.sheets[key] = image
      })
      .catch((error) => console.error(error))
  }

  // An entity is open when every flag in `requires` is set and no flag in `hideWhen` is.
  function gateOpen(entity) {
    return story.allMet(entity.requires) && !story.anyMet(entity.hideWhen)
  }

  // Recomputes what is present and interactable after a story change.
  // NPCs are hidden and non-solid while gated; objects only lose their interaction.
  function refreshGates() {
    for (const npc of npcs) npc.active = gateOpen(npc)
    for (const object of placedInteractables) object.interactActive = gateOpen(object)

    world.replaceSolids(
      world.objects.filter((entity) => entity.solid && (entity.kind !== 'npc' || entity.active)).map((entity) => entity.solid),
    )
    interactables = [
      ...npcs.filter((npc) => npc.active),
      ...placedInteractables.filter((object) => object.interactActive),
    ]
  }
  refreshGates()

  function emitQuest() {
    callbacks.onQuestChange?.(quests.activeView())
  }

  function handleQuestEvent(event) {
    const result = quests.handleEvent(event)
    if (!result.changed) return
    emitQuest()
    for (const notice of result.notices) {
      callbacks.onQuestNotice?.(notice)
    }
  }

  // Applies the actions from a finished conversation. Returns what should happen next:
  // { chain: dialogueId | null, end: boolean }.
  function runActions(actions = []) {
    let chain = null
    let end = false
    let flagsChanged = false
    for (const action of actions) {
      if (action.setFlag) {
        story.set(action.setFlag)
        flagsChanged = true
      }
      if (action.startQuest && quests.start(action.startQuest).changed) emitQuest()
      if (action.dialogue) chain = action.dialogue
      if (action.ending) end = true
    }
    if (flagsChanged) refreshGates()
    return { chain, end }
  }

  function showDialogue(view) {
    pauseLeft = view.pause ?? 0
    callbacks.onDialogueChange?.(view)
  }

  // Starts whatever the player interacted with. Returns the dialogue view, or null if there is none.
  function startInteraction(entity) {
    if (entity.kind === 'object') {
      handleQuestEvent({ type: 'interacted', objectId: entity.id })
    }
    const view = dialogue.start(entity.dialogueId)
    if (view) {
      talkingToNpcId = entity.kind === 'npc' ? entity.id : null
      focusPoint = entity.focus ? { x: entity.x, y: entity.y } : null
    }
    return view
  }

  function advanceDialogue() {
    const step = dialogue.advance()
    if (step.view) {
      showDialogue(step.view)
    } else {
      pauseLeft = 0
      callbacks.onDialogueChange?.(null)
    }
    if (step.finished) finishConversation(step.finished)
  }

  // Runs the conversation's end actions, counts the talk for quests, then continues the story.
  function finishConversation(conversation) {
    const { chain, end } = runActions(conversation.onEnd)
    if (talkingToNpcId) {
      const npcId = talkingToNpcId
      talkingToNpcId = null
      handleQuestEvent({ type: 'talked', npcId })
    }
    focusPoint = null

    if (end) {
      ended = true
      callbacks.onEnding?.()
      return
    }
    if (chain) {
      const view = dialogue.start(chain)
      if (view) showDialogue(view)
    }
  }

  return {
    resize(cssWidth, cssHeight, pixelRatio) {
      viewport.width = cssWidth
      viewport.height = cssHeight
      canvas.width = Math.round(cssWidth * pixelRatio)
      canvas.height = Math.round(cssHeight * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    },

    // Read-only snapshots (useful for debugging and tests).
    playerPosition() {
      return { x: player.x, y: player.y }
    },

    hasFlag(flag) {
      return story.has(flag)
    },

    update(dt) {
      if (ended) return

      for (const npc of npcs) npc.update(dt)

      if (dialogue.isActive) {
        // Dialogue mode: the player is locked. A key press advances the conversation,
        // and a timed entry advances on its own when its pause runs out.
        player.update(dt, input, world, true)
        if (wasAdvancePressed(input)) {
          advanceDialogue()
        } else if (pauseLeft > 0) {
          pauseLeft -= dt
          if (pauseLeft <= 0) advanceDialogue()
        }
      } else {
        player.update(dt, input, world, false)

        const result = interaction.update(player, interactables, input)
        const view = result.triggered ? startInteraction(result.triggered) : null
        if (view) {
          // Dialogue begins: hide the prompt and the target highlight.
          interaction.reset()
          callbacks.onPromptChange?.(null)
          showDialogue(view)
        } else if (result.changed) {
          callbacks.onPromptChange?.(result.target && { id: result.target.id, name: result.target.name })
        }
      }

      if (ended) return

      for (const zoneId of world.updateZones(player)) {
        handleQuestEvent({ type: 'reached', zoneId })
      }

      // Camera follows the player's feet, or the focus point during a scripted scene.
      const target = focusPoint ?? player
      camera.update(dt, target.x, target.y, viewport, world)
    },

    render() {
      // Backdrop covers any part of the view outside the world.
      ctx.fillStyle = GROUND.backdrop
      ctx.fillRect(0, 0, viewport.width, viewport.height)

      ctx.save()
      camera.apply(ctx)

      // Layers, back to front: ground, ground decals, then objects, NPCs and the player
      // sorted by base y. Objects are pre-sorted, so the player is slotted in place.
      world.drawGround(ctx, camera, viewport)
      world.drawGroundDecals(ctx, assets)

      let playerDrawn = false
      for (const object of world.objects) {
        if (!playerDrawn && player.y < object.y) {
          player.render(ctx, assets)
          playerDrawn = true
        }
        object.render(ctx, assets)
      }
      if (!playerDrawn) player.render(ctx, assets)

      ctx.restore()
    },
  }
}
