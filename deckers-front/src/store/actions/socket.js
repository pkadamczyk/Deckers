import { END_TURN, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD, ENEMY_CARD_ATTACK, COMBAT_RESULTS_COMPARISON, RESET_GAME_DATA, STARTER_CARDS_PICKED, SERVER_READY, RECONNECTED_TO_GAME, SERVER_RECONNECTED } from "../actionTypes";

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

export const combatResultsComparison = ({ result }) => {
    return {
        result,
        type: COMBAT_RESULTS_COMPARISON,
    }
}

export const clearGameData = ({ winner }) => {
    return {
        winner,
        type: RESET_GAME_DATA,
    }
}

export const starterCardsPicked = ({ starterCards }) => {
    return {
        type: STARTER_CARDS_PICKED,
        starterCards,
    }
}

export const serverReadyEvent = ({ starterCards }) => {
    return {
        type: SERVER_READY,
        starterCards,
    }
}

export const reconnectedToGameEvent = (data) => {
    return {
        type: SERVER_RECONNECTED,
        data,
    }
}