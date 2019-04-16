import {SELECT_RACE} from "../actionTypes";

export const selectRace = (race) => ({
    type: SELECT_RACE,
    race: race
  });