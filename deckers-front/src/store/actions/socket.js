import { END_TURN, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD, ENEMY_CARD_ATTACK } from "../actionTypes";

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

export const enemySummonedCardEvent = ({ card, boardPosition, handPosition }) => {
    return {
        card,
        boardPosition,
        handPosition,
        type: ENEMY_SUMMON_CARD,
    }
}

export const enemyCardAttackedEvent = ({ playerMinionId, enemyMinionId, result }) => {
    return {
        playerMinionId,
        enemyMinionId,
        result,
        type: ENEMY_CARD_ATTACK,
    }
}