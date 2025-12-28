/* ------------------------------------------------------------------ */
/* Time constants */
/* ------------------------------------------------------------------ */

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30

/* ------------------------------------------------------------------ */
/* Food States */
/* ------------------------------------------------------------------ */

export const FOOD_STATES = {
  OVERFULL: 'Overfull',
  FULL: 'Full',
  CONTENT: 'Content',
  NEUTRAL: 'Neutral',
  HUNGRY: 'Hungry',
  STARVING: 'Starving',
}

/* ------------------------------------------------------------------ */
/* Play States */
/* ------------------------------------------------------------------ */

export const PLAY_STATES = {
  NEUTRAL: 'Neutral',
  RESTLESS: 'Restless',
  LONELY: 'Lonely',
  NEARLY_FORGOTTEN: 'Nearly Forgotten',

  HOPEFUL: 'Hopeful',
  HAPPY: 'Happy',

  HYPER: 'Hyper',
  SLEEPING: 'Sleeping',
  OUT_OF_CONTROL: 'Out Of Control',
}

/* ------------------------------------------------------------------ */
/* Context Builder */
/* ------------------------------------------------------------------ */

function buildContext(panther, now = Date.now()) {
  return {
    fedAgo: panther.lastFedAt ? now - panther.lastFedAt : Infinity,
    playedAgo: panther.lastPlayedAt ? now - panther.lastPlayedAt : Infinity,
    hopefulAgo: panther.hopefulAt ? now - panther.hopefulAt : Infinity,
    sleptAgo: panther.sleptAt ? now - panther.sleptAt : Infinity,
  }
}

/* ------------------------------------------------------------------ */
/* Food State Machine */
/* ------------------------------------------------------------------ */

export const FOOD_STATE_MACHINE = {
  [FOOD_STATES.FULL]: [
    { to: FOOD_STATES.CONTENT, when: ctx => ctx.fedAgo > DAY * 2 },
    { to: FOOD_STATES.OVERFULL, when: ctx => ctx.fedAgo < HOUR },
  ],

  [FOOD_STATES.CONTENT]: [
    { to: FOOD_STATES.NEUTRAL, when: ctx => ctx.fedAgo > WEEK },
    { to: FOOD_STATES.OVERFULL, when: ctx => ctx.fedAgo < HOUR },
  ],

  [FOOD_STATES.NEUTRAL]: [
    { to: FOOD_STATES.HUNGRY, when: ctx => ctx.fedAgo > WEEK * 2 },
    { to: FOOD_STATES.FULL, when: ctx => ctx.fedAgo < HOUR },
  ],

  [FOOD_STATES.HUNGRY]: [
    { to: FOOD_STATES.STARVING, when: ctx => ctx.fedAgo > MONTH },
    { to: FOOD_STATES.FULL, when: ctx => ctx.fedAgo < HOUR },
  ],

  [FOOD_STATES.STARVING]: [
    { to: FOOD_STATES.FULL, when: ctx => ctx.fedAgo < HOUR },
  ],

  [FOOD_STATES.OVERFULL]: [
    { to: FOOD_STATES.FULL, when: ctx => ctx.fedAgo > DAY },
  ],
}

/* ------------------------------------------------------------------ */
/* Play State Machine */
/* ------------------------------------------------------------------ */

export const PLAY_STATE_MACHINE = {
  [PLAY_STATES.NEUTRAL]: [
    { to: PLAY_STATES.HAPPY, when: ctx => ctx.playedAgo < HOUR },
    { to: PLAY_STATES.RESTLESS, when: ctx => ctx.playedAgo > WEEK },
  ],

  [PLAY_STATES.RESTLESS]: [
    { to: PLAY_STATES.HAPPY, when: ctx => ctx.playedAgo < HOUR },
    { to: PLAY_STATES.LONELY, when: ctx => ctx.playedAgo > WEEK * 2 },
  ],

  [PLAY_STATES.LONELY]: [
    { to: PLAY_STATES.HAPPY, when: ctx => ctx.playedAgo < HOUR },
    { to: PLAY_STATES.NEARLY_FORGOTTEN, when: ctx => ctx.playedAgo > MONTH * 2 },
  ],

  [PLAY_STATES.NEARLY_FORGOTTEN]: [
    { to: PLAY_STATES.HOPEFUL, when: ctx => ctx.playedAgo < HOUR },
  ],

  [PLAY_STATES.HOPEFUL]: [
    { to: PLAY_STATES.HAPPY, when: ctx => ctx.hopefulAgo > 30 * SECOND },
  ],

  [PLAY_STATES.HAPPY]: [
    { to: PLAY_STATES.NEUTRAL, when: ctx => ctx.playedAgo > DAY * 3 },
    { to: PLAY_STATES.HYPER, when: ctx => ctx.playedAgo < MINUTE },
  ],

  [PLAY_STATES.HYPER]: [
    { to: PLAY_STATES.SLEEPING, when: ctx => ctx.playedAgo > MINUTE },
  ],

  [PLAY_STATES.SLEEPING]: [
    { to: PLAY_STATES.OUT_OF_CONTROL, when: ctx => ctx.playedAgo < MINUTE },
    { to: PLAY_STATES.NEUTRAL, when: ctx => ctx.sleptAgo > DAY * 2 },
  ],

  [PLAY_STATES.OUT_OF_CONTROL]: [
    { to: PLAY_STATES.SLEEPING, when: ctx => ctx.playedAgo > MINUTE },
  ],
}

/* ------------------------------------------------------------------ */
/* Generic State Machine Runner */
/* ------------------------------------------------------------------ */

function runStateMachine(machine, currentState, panther, now = Date.now()) {
  const ctx = buildContext(panther, now)
  const transitions = machine[currentState] ?? []

  for (const { to, when } of transitions) {
    if (when(ctx)) return to
  }

  return currentState
}

/* ------------------------------------------------------------------ */
/* Public API */
/* ------------------------------------------------------------------ */

export function getNextFoodState(currentState, panther, now = Date.now()) {
  return runStateMachine(FOOD_STATE_MACHINE, currentState, panther, now)
}

export function getNextPlayState(currentState, panther, now = Date.now()) {
  return runStateMachine(PLAY_STATE_MACHINE, currentState, panther, now)
}
