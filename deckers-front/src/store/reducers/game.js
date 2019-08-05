import { REORDER_CARDS_ON_HAND, SUMMON_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO, CONNECTED_TO_GAME, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD, ENEMY_CARD_ATTACK } from "../actionTypes"
import { SOCKET } from "../../gameplay/containers/Socket";
export const GAME_STATE = {
    BUSY: 1,
    TARGETING: 2,
    IDLE: 3
}
export const CARD_DRAW_COST = 1;

const MAX_HERO_HEALTH = 10;
const GOLD_ON_START = 1;

const DEFAULT_STATE = {
    cardsOnBoard: [],
    cardsOnHand: [],

    enemyCardsOnBoard: [],
    enemyCardsOnHand: [],

    isMyTurn: true,
    currentRound: 0,

    gameState: GAME_STATE.IDLE,

    enemyHeroHealth: MAX_HERO_HEALTH,
    playerHeroHealth: MAX_HERO_HEALTH,

    enemyHeroGold: GOLD_ON_START,
    playerHeroGold: GOLD_ON_START,

    deckCardsAmount: 0,

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

            return { ...state, isMyTurn, gameInfo: action.gameInfo, deckCardsAmount: action.playerDeckCardsAmount };
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
            let { deckCardsAmount } = state
            var { card } = action;
            if (state.playerHeroGold < CARD_DRAW_COST) throw (new Error("Not enough gold"));
            newGoldAmount = state.playerHeroGold -= CARD_DRAW_COST;
            deckCardsAmount--;

            return { ...state, cardsOnHand: [...state.cardsOnHand, card], playerHeroGold: newGoldAmount, gameState: GAME_STATE.IDLE, deckCardsAmount }

        case ENEMY_DRAW_CARD:
            var { enemyCardsOnHand, enemyHeroGold } = state;
            enemyHeroGold = state.enemyHeroGold -= CARD_DRAW_COST;
            return { ...state, enemyCardsOnHand: [...enemyCardsOnHand, {}], enemyHeroGold }

        case END_TURN:
            let playerMinionArray = [...state.cardsOnBoard];

            let { currentRound } = state;
            currentRound++
            const income = Math.ceil(currentRound / 2) > 5 ? 5 : Math.ceil(currentRound / 2);

            if (!state.isMyTurn) {
                for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].isReady = true;

                newGoldAmount = state.playerHeroGold += income;

                SOCKET.emit('data-comparison', {
                    currentRound: currentRound,
                    currentPlayer: state.gameInfo.role,

                    cardsOnBoard: state.cardsOnBoard,
                    cardsOnHand: state.cardsOnHand,

                    enemyCardsOnBoard: state.enemyCardsOnBoard,
                    enemyCardsOnHand: state.enemyCardsOnHand,

                    enemyHeroHealth: state.enemyHeroHealth,
                    playerHeroHealth: state.playerHeroHealth,

                    enemyHeroGold: state.enemyHeroGold,
                    playerHeroGold: newGoldAmount,
                });

                return { ...state, isMyTurn: !state.isMyTurn, playerHeroGold: newGoldAmount, currentRound }
            }

            var enemyHeroGold = state.enemyHeroGold += income;
            return { ...state, isMyTurn: !state.isMyTurn, enemyHeroGold, currentRound };

        case SET_GAME_STATE:
            return { ...state, gameState: action.newGameState };

        case ENEMY_CARD_ATTACK:
            const { gameInfo } = state;
            const { role } = gameInfo;

            result = action.result;
            var { playerMinionId, enemyMinionId } = action;

            let playerData = result[role];
            let enemyData = result[+!role]; // WORKS ONLY FOR 2 PLAYERS

            let { cardsOnBoard, health } = playerData;

            let enemyCardsOnBoard = enemyData.cardsOnBoard;
            let enemyHeroHealth = enemyData.health

            return { ...state, enemyCardsOnBoard, enemyHeroHealth, cardsOnBoard, playerHeroHealth: health };

        case ATTACK_MINION:
            let attackingMinion = { ...state.cardsOnBoard[action.playerMinionId] };
            let attackedMinion = { ...state.enemyCardsOnBoard[action.enemyMinionId] };

            if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
            attackingMinion.isReady = false;

            let enemyMinionArray = [...state.enemyCardsOnBoard];
            playerMinionArray = [...state.cardsOnBoard];

            attackedMinion.stats[attackedMinion.level].health -= attackingMinion.stats[attackingMinion.level].damage;
            attackingMinion.stats[attackingMinion.level].health -= attackedMinion.stats[attackedMinion.level].damage;

            if (attackedMinion.stats[attackedMinion.level].health <= 0) enemyMinionArray.splice(action.enemyMinionId, 1);
            else enemyMinionArray[action.enemyMinionId] = attackedMinion;

            if (attackingMinion.stats[attackingMinion.level].health <= 0) playerMinionArray.splice(action.playerMinionId, 1);
            else playerMinionArray[action.playerMinionId] = attackingMinion;

            debugger
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


