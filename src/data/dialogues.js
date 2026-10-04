// Dialogue data. Edit this file to change what is said; no engine code needs to change.
//
// A conversation is { entries: [...], style?, onEnd? }.
//   style     'dialogue' (default) shows the bottom dialogue box.
//             'memory' shows a full-screen memory overlay.
//   onEnd     optional actions run when the conversation finishes. Each action is one of:
//               { setFlag: 'flagName' }        mark a story flag
//               { startQuest: 'quest-id' }     start a quest (if allowed)
//               { dialogue: 'dialogue-id' }    chain straight into another conversation
//               { ending: true }               end the game and show the ending screen
//
// An entry is { speaker, text, id?, next?, pause?, choices? }.
//   speaker   display name shown above the text
//   text      what is said
//   id        optional. Lets another entry jump here with `next`
//   next      optional. Entry id to continue to, or null to end the conversation.
//             If omitted, the next entry in the list is used.
//   pause     optional seconds. The entry advances on its own after this long
//             (the advance keys still work).
//   choices   reserved for future branching. Not supported yet; the engine ignores it.
//
// NPCs and objects point at a conversation with `dialogueId`.

export const DIALOGUES = {
  // ---- Test quest and town conversations ----

  'neighbor.greeting': {
    entries: [
      { speaker: 'Neighbor', text: 'Maayong hapon! Asa ka padulong?' },
      { speaker: 'Neighbor', text: 'Sa tindahan? Palit ka ug yelo? Init kaayo karon, ha.' },
      { speaker: 'Neighbor', text: 'Sige, ingat ka. Balik ka lang kung naa kay panahon.' },
    ],
    onEnd: [{ startQuest: 'small-errand' }],
  },

  'bench.inspect': {
    entries: [{ speaker: 'Old Bench', text: 'Lumang bangko. Medyo sira na, pero matibay pa.' }],
  },

  'store-owner.greeting': {
    entries: [
      { speaker: 'Store Owner', text: 'Hello! Gusto mo mopalit? Kompleto ang paninda dinhi.' },
      { speaker: 'Store Owner', text: 'May asin, kape, sabon, ug chichirya. Tan-awa lang.' },
      { speaker: 'Store Owner', text: 'Kulang imong pera? Ok lang. Ulian na lang ta.' },
    ],
  },

  'kid.greeting': {
    entries: [
      { speaker: 'Kid', text: 'Hoy! Gusto mo mag-basketball?' },
      { speaker: 'Kid', text: 'Ako si Jun-jun. Dili pa ko kaayo maayo sa shooting, pero practice ra.' },
      { speaker: 'Kid', text: 'Sige, balik ko sa court. Bye!' },
    ],
  },

  'elder.greeting': {
    entries: [
      { speaker: 'Elder', text: "Bag-o ka lang dinhi, 'no?" },
      { speaker: 'Elder', text: "Dati, mas tahimik ang dalan dinhi. Karon, daghan na'g bag-o." },
      { speaker: 'Elder', text: 'Sige, ingat. Dayon lang sa atong lugar.' },
    ],
  },

  // ---- Story chain: camera -> letter -> memory -> Lola -> reveal ----

  'camera.found': {
    entries: [
      { speaker: 'You', text: 'Isang lumang camera, nakasiksik sa ilalim ng bangko.' },
      { speaker: 'You', text: 'May film pa sa loob. Parang may gustong ipakita sa akin.' },
    ],
    onEnd: [{ setFlag: 'foundCamera' }],
  },

  'letter.read': {
    entries: [
      { speaker: 'Letter', text: 'Apo, kung mabasa mo ito, ibig sabihin bumalik ka rin sa atin.' },
      { speaker: 'Letter', text: 'Huwag mong kalimutan ang mga hapon natin sa kalsada.' },
      { speaker: 'Letter', text: 'Mahal kita. Lola.' },
    ],
    onEnd: [{ setFlag: 'foundLetter' }, { dialogue: 'memory.childhood' }],
  },

  'memory.childhood': {
    style: 'memory',
    entries: [
      { speaker: 'Memory', text: 'Tumatakbo ka sa kalsada, may tawanan ng mga bata.', pause: 4 },
      { speaker: 'Memory', text: 'Sa dulo ng kalye, tinatawag ka ni Lola para sa merienda.', pause: 4 },
      { speaker: 'Memory', text: 'Amoy ng kape at pandesal. Hapon na naman, at ayaw pang matapos.', pause: 4 },
    ],
    onEnd: [{ setFlag: 'memoryWatched' }],
  },

  'lola.final': {
    entries: [
      { speaker: 'Lola', text: 'Apo... nandito ka na naman.' },
      { speaker: 'You', text: 'Lola? Akala ko... matagal ka nang wala.' },
      { speaker: 'Lola', text: 'Hindi mo ako nakalimutan. Kaya ako nandito.' },
      { speaker: 'You', text: 'Gusto ko lang balikan ang mga araw natin dito.' },
      { speaker: 'Lola', text: 'Alam ko. Pero kailangan mo nang bumalik sa kasalukuyan, apo.' },
      { speaker: 'You', text: 'Ayoko pang umalis.' },
      { speaker: 'Lola', text: 'Hindi ka naman aalis nang tuluyan. Dala mo na ako sa alaala mo.' },
    ],
    onEnd: [{ setFlag: 'finalScene' }, { dialogue: 'memory.reveal' }],
  },

  'memory.reveal': {
    style: 'memory',
    entries: [
      { speaker: 'Memory', text: 'Unti-unting humihina ang tawanan sa kalsada.', pause: 4 },
      { speaker: 'Memory', text: 'Ang tindahan, ang bangko, ang mga bata... unti-unting naglalaho sa liwanag.', pause: 4 },
      { speaker: 'Memory', text: 'Isa lang pala itong alaala, isang panaginip ng taong nangungulila.', pause: 4 },
      { speaker: 'Memory', text: 'Bumalik ka sa kasalukuyan. Tahimik ang kuwarto. Mahal mo pa rin siya.', pause: 4 },
    ],
    onEnd: [{ ending: true }],
  },
}
