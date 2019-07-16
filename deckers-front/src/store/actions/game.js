import { CONNECTED_TO_GAME, REORDER_CARDS_ON_HAND } from "../actionTypes";

export const connectedToGame = (gameInfo) => ({
  type: CONNECTED_TO_GAME,
  gameInfo: gameInfo
});


export const reorderCardsInHand = (list, startIndex, endIndex) => ({
  type: REORDER_CARDS_ON_HAND,
  list, startIndex, endIndex
})