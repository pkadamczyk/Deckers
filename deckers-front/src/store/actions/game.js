import { CONNECTED_TO_GAME, REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD, END_TURN } from "../actionTypes";
import { SET_GAME_STATE } from "../actionTypes";
import { GAME_STATE } from "../reducers/game";

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
}