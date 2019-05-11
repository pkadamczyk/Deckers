import { CONNECTED_TO_GAME} from "../actionTypes";
import {apiCall} from "../../services/api";

export const connectedToGame = (gameInfo) => ({
    type: CONNECTED_TO_GAME,
    gameInfo: gameInfo
  });