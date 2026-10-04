// Story state: the set of story flags the player has earned (e.g. 'foundCamera').
// Everything that is story-gated checks this one place, rather than keeping its own variables.
// Flags are plain strings. Nothing is persisted; a new game starts with no flags.

export function createStoryState() {
  const flags = new Set()

  return {
    set(flag) {
      flags.add(flag)
    },

    has(flag) {
      return flags.has(flag)
    },

    // True when every flag in the list is set. An empty list is always true.
    allMet(list = []) {
      return list.every((flag) => flags.has(flag))
    },

    // True when at least one flag in the list is set. An empty list is always false.
    anyMet(list = []) {
      return list.some((flag) => flags.has(flag))
    },
  }
}
