import { CONNECTED_TO_GAME, REORDER_CARDS_ON_HAND, SUMMON_CARD, END_TURN, ATTACK_HERO, UPDATE_USER_AFTER_GAME } from "../actionTypes";
import { SET_GAME_STATE, ATTACK_MINION } from "../actionTypes";
import { GAME_STATE } from "../reducers/game";
import { ENEMY_HERO_ID } from "../../gameplay/containers/Game";

import openSocket from 'socket.io-client';
export let SOCKET;

export const connectedToGame = (gameInfo) => {
  SOCKET = openSocket('http://localhost:8080/game')

  SOCKET.emit('join', {
    gameId: gameInfo.gameId,
    role: gameInfo.role
  });

  return {
    type: CONNECTED_TO_GAME,
    gameInfo,
  }
};

export const reorderCardsInHand = (startIndex, endIndex) => ({
  type: REORDER_CARDS_ON_HAND,
  startIndex, endIndex
})

export const summonCard = (droppableSource, droppableDestination) => {
  return {
    type: SUMMON_CARD,
    droppableSource, droppableDestination
  }
}

export const drawCard = () => {
  SOCKET.emit('card-drew');

  return {
    type: "NONE",
  }
}

export const endTurn = () => {
  SOCKET.emit('turn-ended');
  return {
    type: END_TURN,
  }
}

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
  SOCKET.emit('minion-attacked', {
    playerMinionId: source.index,
    enemyMinionId: target === ENEMY_HERO_ID ? null : +target.slice(-1)
  });
  if (target === ENEMY_HERO_ID) return attackHero(source);
  else return attackMinion(source, target);
}

export const attackMinion = (source, target) => {
  let playerMinionId = source.index;
  let enemyMinionId = +target.slice(-1);

  return {
    type: ATTACK_MINION,
    playerMinionId, enemyMinionId
  }
}

export const attackHero = (source) => {
  let playerMinionId = source.index;

  return {
    type: ATTACK_HERO,
    playerMinionId
  }
}

export const updateUserAfterGame = ({ usersData }) => {
  return {
    usersData,
    type: UPDATE_USER_AFTER_GAME
  }
}

export const pickStarterCards = (selected, role) => {
  SOCKET.emit('pick-starter-cards', {
    selected,
    role,
  });

  return {
    type: "NONE",
  }
}

