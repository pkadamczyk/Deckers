import { CONNECTED_TO_GAME, REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD } from "../actionTypes";

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