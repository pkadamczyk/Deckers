// import { CONNECTED_TO_GAME } from "../actionTypes";
import { REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO } from "../actionTypes"

export const GAME_STATE = {
    BUSY: 1,
    TARGETING: 2,
    IDLE: 3
}
const MAX_HERO_HEALTH = 10;
const GOLD_ON_START = 1;


let OFFSET = 15; // Only for test


const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`,

        health: 2,
        damage: 1,
        cost: 1,
        isReady: false
    }));

const DEFAULT_STATE = {
    cardsOnBoard: getItems(0),
    cardsOnHand: getItems(5, 10),

    enemyCardsOnBoard: getItems(2, 20),

    isMyTurn: true,

    gameState: GAME_STATE.IDLE,

    enemyHeroHealth: MAX_HERO_HEALTH,
    playerHeroHealth: MAX_HERO_HEALTH,

    enemyHeroGold: GOLD_ON_START,
    playerHeroGold: GOLD_ON_START
};

export default (state = DEFAULT_STATE, action) => {
    let result;
    let removed;

    switch (action.type) {
        // case CONNECTED_TO_GAME:
        //     return action.gameInfo;
        case REORDER_CARDS_ON_HAND:
            result = Array.from(state.cardsOnHand);
            [removed] = result.splice(action.startIndex, 1);
            result.splice(action.endIndex, 0, removed);
            return { ...state, cardsOnHand: result }

        case SUMMON_CARD:
            const sourceClone = Array.from(state.cardsOnHand);
            const destClone = Array.from(state.cardsOnBoard);
            [removed] = sourceClone.splice(action.droppableSource.index, 1);

            if (state.playerHeroGold < removed.cost) throw (new Error("Not enough gold"));
            let newGoldAmount = state.playerHeroGold -= removed.cost;

            destClone.splice(action.droppableDestination.index, 0, removed);

            let newState = { ...state };
            newState["cardsOnHand"] = sourceClone;
            newState["cardsOnBoard"] = destClone;

            return newState;

        case DRAW_CARD:
            OFFSET++;
            let newCard = {
                id: `item-${OFFSET}`,
                content: `item ${OFFSET}`
            }

            return { ...state, cardsOnHand: [...state.cardsOnHand, newCard], playerHeroGold: newGoldAmount }

        case END_TURN:
            let playerMinionArray = [...state.cardsOnBoard];
            for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].isReady = true;

            return { ...state, isMyTurn: !state.isMyTurn };

        case SET_GAME_STATE:
            return { ...state, gameState: action.newGameState };

        case ATTACK_MINION:
            let attackingMinion = { ...state.cardsOnBoard[action.playerMinionId] };
            let attackedMinion = { ...state.enemyCardsOnBoard[action.enemyMinionId] };

            if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
            attackingMinion.isReady = false;

            let enemyMinionArray = [...state.enemyCardsOnBoard];
            playerMinionArray = [...state.cardsOnBoard];

            attackedMinion.health -= attackingMinion.damage;
            attackingMinion.health -= attackedMinion.damage;

            if (attackedMinion.health <= 0) enemyMinionArray.splice(action.enemyMinionId, 1);
            else enemyMinionArray[action.enemyMinionId] = attackedMinion;

            if (attackingMinion.health <= 0) playerMinionArray.splice(action.playerMinionId, 1);
            else playerMinionArray[action.playerMinionId] = attackingMinion;

            return { ...state, enemyCardsOnBoard: enemyMinionArray, cardsOnBoard: playerMinionArray };

        case ATTACK_HERO:
            let playerMinion = { ...state.cardsOnBoard[action.playerMinionId] }

            if (!playerMinion.isReady) throw (new Error("This minion is not ready"));
            playerMinion.isReady = false;

            let enemyHeroCurrentHp = state.enemyHeroHealth - playerMinion.damage;
            playerMinionArray = [...state.cardsOnBoard];
            playerMinionArray[action.playerMinionId] = playerMinion;

            return { ...state, enemyHeroHealth: enemyHeroCurrentHp, cardsOnBoard: playerMinionArray };

        default:
            return state;
    }
};


