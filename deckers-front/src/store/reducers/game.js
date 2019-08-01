import { REORDER_CARDS_ON_HAND, SUMMON_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO, CONNECTED_TO_GAME, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD } from "../actionTypes"

export const GAME_STATE = {
    BUSY: 1,
    TARGETING: 2,
    IDLE: 3
}
export const CARD_DRAW_COST = 1;

const MAX_HERO_HEALTH = 10;
const GOLD_ON_START = 1;
const GOLD_TURN_INCOME = 1;

const DEFAULT_STATE = {
    cardsOnBoard: [],
    cardsOnHand: [],

    enemyCardsOnBoard: [],
    enemyCardsOnHand: [],

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

    let sourceClone
    let destClone

    let cost
    let newGoldAmount
    let newState

    switch (action.type) {
        case CONNECTED_TO_GAME:
            let isMyTurn = !!action.gameInfo.role

            return { ...state, isMyTurn, gameInfo: action.gameInfo };
        case REORDER_CARDS_ON_HAND:
            result = Array.from(state.cardsOnHand);
            [removed] = result.splice(action.startIndex, 1);
            result.splice(action.endIndex, 0, removed);

            return { ...state, cardsOnHand: result }

        case SUMMON_CARD:
            sourceClone = Array.from(state.cardsOnHand);
            destClone = Array.from(state.cardsOnBoard);
            [removed] = sourceClone.splice(action.droppableSource.index, 1);

            cost = removed.stats[removed.level].cost
            if (state.playerHeroGold < cost) throw (new Error("Not enough gold"));
            newGoldAmount = state.playerHeroGold -= cost;

            destClone.splice(action.droppableDestination.index, 0, removed);

            newState = { ...state };
            newState["cardsOnHand"] = sourceClone;
            newState["cardsOnBoard"] = destClone;

            return { ...newState, playerHeroGold: newGoldAmount };

        case ENEMY_SUMMON_CARD:
            var { handPosition, boardPosition, card } = action;

            sourceClone = Array.from(state.enemyCardsOnHand);
            destClone = Array.from(state.enemyCardsOnBoard);
            sourceClone.splice(handPosition, 1);

            cost = card.stats[card.level].cost
            newGoldAmount = state.enemyHeroGold -= cost;

            destClone.splice(boardPosition, 0, card);

            newState = { ...state };
            newState["enemyCardsOnHand"] = sourceClone;
            newState["enemyCardsOnBoard"] = destClone;

            return { ...newState, enemyHeroGold: newGoldAmount };

        case PLAYER_DRAW_CARD:
            var { card } = action;
            if (state.playerHeroGold < CARD_DRAW_COST) throw (new Error("Not enough gold"));
            newGoldAmount = state.playerHeroGold -= CARD_DRAW_COST;

            return { ...state, cardsOnHand: [...state.cardsOnHand, card], playerHeroGold: newGoldAmount, gameState: GAME_STATE.IDLE }
        case ENEMY_DRAW_CARD:
            var { enemyCardsOnHand, enemyHeroGold } = state;
            enemyHeroGold = state.enemyHeroGold -= CARD_DRAW_COST;
            return { ...state, enemyCardsOnHand: [...enemyCardsOnHand, {}], enemyHeroGold }

        case END_TURN:
            let playerMinionArray = [...state.cardsOnBoard];
            if (!state.isMyTurn) {
                for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].isReady = true;

                newGoldAmount = state.playerHeroGold += GOLD_TURN_INCOME; // Na testy
                return { ...state, isMyTurn: !state.isMyTurn, playerHeroGold: newGoldAmount }
            }

            var enemyHeroGold = state.enemyHeroGold += GOLD_TURN_INCOME;
            return { ...state, isMyTurn: !state.isMyTurn, enemyHeroGold };

        case SET_GAME_STATE:
            return { ...state, gameState: action.newGameState };

        case ATTACK_MINION:
            let attackingMinion = { ...state.cardsOnBoard[action.playerMinionId] };
            let attackedMinion = { ...state.enemyCardsOnBoard[action.enemyMinionId] };

            if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
            attackingMinion.isReady = false;

            let enemyMinionArray = [...state.enemyCardsOnBoard];
            playerMinionArray = [...state.cardsOnBoard];

            attackedMinion[attackedMinion.level].health -= attackingMinion.stats[attackingMinion.level].damage;
            attackingMinion[attackingMinion.level].health -= attackedMinion[attackedMinion.level].damage;

            if (attackedMinion[attackedMinion.level].health <= 0) enemyMinionArray.splice(action.enemyMinionId, 1);
            else enemyMinionArray[action.enemyMinionId] = attackedMinion;

            if (attackingMinion[attackingMinion.level].health <= 0) playerMinionArray.splice(action.playerMinionId, 1);
            else playerMinionArray[action.playerMinionId] = attackingMinion;

            return { ...state, enemyCardsOnBoard: enemyMinionArray, cardsOnBoard: playerMinionArray };

        case ATTACK_HERO:
            let playerMinion = { ...state.cardsOnBoard[action.playerMinionId] }

            if (!playerMinion.isReady) throw (new Error("This minion is not ready"));
            playerMinion.isReady = false;

            let enemyHeroCurrentHp = state.enemyHeroHealth - playerMinion.stats[playerMinion.level].damage;
            playerMinionArray = [...state.cardsOnBoard];
            playerMinionArray.splice(action.playerMinionId, 1, playerMinion);

            return { ...state, enemyHeroHealth: enemyHeroCurrentHp, cardsOnBoard: playerMinionArray };

        default:
            return state;
    }
};


