// import { CONNECTED_TO_GAME } from "../actionTypes";
import { REORDER_CARDS_ON_HAND, SUMMON_CARD, DRAW_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO, CONNECTED_TO_GAME } from "../actionTypes"

export const GAME_STATE = {
    BUSY: 1,
    TARGETING: 2,
    IDLE: 3
}
export const CARD_DRAW_COST = 1;

const MAX_HERO_HEALTH = 10;
const GOLD_ON_START = 1;
const GOLD_TURN_INCOME = 1;

let OFFSET = 15; // Only for test

const getItems = (count, offset = 0) => (
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`,

        health: 2,
        damage: 1,
        cost: 1,
        isReady: false
    }))
)

const DEFAULT_STATE = {
    cardsOnBoard: getItems(0),
    cardsOnHand: getItems(5, 10),

    enemyCardsOnBoard: getItems(2, 20),

    isMyTurn: true,

    gameState: GAME_STATE.IDLE,

    enemyHeroHealth: MAX_HERO_HEALTH,
    playerHeroHealth: MAX_HERO_HEALTH,

    enemyHeroGold: GOLD_ON_START,
    playerHeroGold: GOLD_ON_START,

    gameInfo: null,
};

export default (state = DEFAULT_STATE, action) => {
    let result;
    let removed;

    switch (action.type) {
        case CONNECTED_TO_GAME:
            return { ...state, gameInfo: action.gameInfo };
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

            return { ...newState, playerHeroGold: newGoldAmount };

        case DRAW_CARD:
            OFFSET++; // For test

            if (state.playerHeroGold < CARD_DRAW_COST) throw (new Error("Not enough gold"));
            newGoldAmount = state.playerHeroGold -= CARD_DRAW_COST;

            let newCard = {
                id: `item-${OFFSET}`,
                content: `item ${OFFSET}`,
                health: 2,
                damage: 1,
                cost: 1,
                isReady: false
            }

            return { ...state, cardsOnHand: [...state.cardsOnHand, newCard], playerHeroGold: newGoldAmount, gameState: GAME_STATE.IDLE }

        case END_TURN:
            let playerMinionArray = [...state.cardsOnBoard];
            if (!state.isMyTurn) {
                for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].isReady = true;

                newGoldAmount = state.playerHeroGold += GOLD_TURN_INCOME; // Na testy
            }
            else newGoldAmount = state.playerHeroGold;

            return { ...state, isMyTurn: !state.isMyTurn, playerHeroGold: newGoldAmount };

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
            playerMinionArray.splice(action.playerMinionId, 1, playerMinion);

            return { ...state, enemyHeroHealth: enemyHeroCurrentHp, cardsOnBoard: playerMinionArray };

        default:
            return state;
    }
};


