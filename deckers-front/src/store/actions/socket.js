import { END_TURN, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD } from "../actionTypes";

export const endTurnEvent = () => {
    return {
        type: END_TURN,
    }
}

export const playerDrawCardEvent = (card) => {
    return {
        card,
        type: PLAYER_DRAW_CARD,
    }
}

export const enemyDrawCardEvent = () => {
    return {
        type: ENEMY_DRAW_CARD,
    }
}