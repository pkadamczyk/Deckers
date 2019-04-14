import { CHOOSE_MODE, FIND_GAME, LEAVE_QUE, ACCEPT_GAME, DISCONNECT_FROM_GAME, ABANDON_GAME, RECONNECT_GAME } from "../actionTypes";

export const setGameMode = (mode) => ({
  type: CHOOSE_MODE,
  mode
}) 

export const findGame = () => ({
  type: FIND_GAME,
});

export const leaveQue = () => ({
  type: LEAVE_QUE,
});

export const acceptGame = () => ({
    type: ACCEPT_GAME,
  });

export const disconnectFromGame = () => ({
    type: DISCONNECT_FROM_GAME,
  });

export const abandonGame = () => ({
    type: ABANDON_GAME,
  });

export const reconnectGame = () => ({
    type: RECONNECT_GAME,
  });