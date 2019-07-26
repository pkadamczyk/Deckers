import { CONNECTED_TO_GAME, REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD, END_TURN, ATTACK_HERO } from "../actionTypes";
import { SET_GAME_STATE, ATTACK_MINION } from "../actionTypes";
import { GAME_STATE } from "../reducers/game";
import { ENEMY_HERO_ID } from "../../gameplay/containers/Game";

export const connectedToGame = (gameInfo) => ({
  type: CONNECTED_TO_GAME,
  gameInfo: gameInfo
});


export const reorderCardsInHand = (startIndex, endIndex) => ({
  type: REORDER_CARDS_ON_HAND,
  startIndex, endIndex
})

export const summonCard = (droppableSource, droppableDestination) => ({
  type: SUMMON_CARD,
  droppableSource, droppableDestination
})

export const drawCard = () => ({
  type: DRAW_CARD,
})

export const endTurn = () => ({
  type: END_TURN,
})

export const setGameState = (newGameState) => {
  if (Object.values(GAME_STATE).includes(newGameState)) {
    return {
      type: SET_GAME_STATE,
      newGameState: newGameState
    }
  }
  throw (new Error("Incorrect game state value"))
}

export const attack = (source, target) => {
  if (target === ENEMY_HERO_ID) return attackHero(source);
  else return attackMinion(source, target);
}

export const attackMinion = (source, target) => {
  let playerMinionId = source.index
  let enemyMinionId = +target.slice(-1)
  return {
    type: ATTACK_MINION,
    playerMinionId, enemyMinionId
  }
}

export const attackHero = (source) => {
  let playerMinionId = source.index

  return {
    type: ATTACK_HERO,
    playerMinionId
  }
}