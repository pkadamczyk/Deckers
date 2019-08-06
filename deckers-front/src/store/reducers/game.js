import { REORDER_CARDS_ON_HAND, SUMMON_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO, CONNECTED_TO_GAME, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD, ENEMY_CARD_ATTACK, COMBAT_RESULTS_COMPARISON } from "../actionTypes"
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
    enemyDeckCardsAmount: 0,

    gameInfo: null,
};

export default (state = DEFAULT_STATE, action) => {

    switch (action.type) {
        case CONNECTED_TO_GAME:
            return handleConnectToGame(state, action);

        case COMBAT_RESULTS_COMPARISON:
            return handleCombatResultsComparison(state, action);

        case REORDER_CARDS_ON_HAND:
            return handleReorderCardsOnHand(state, action);

        case SUMMON_CARD:
            return handleSummonCard(state, action);

        case ENEMY_SUMMON_CARD:
            return handleEnemySummonCard(state, action);

        case PLAYER_DRAW_CARD:
            return handlePlayerDrawCard(state, action);

        case ENEMY_DRAW_CARD:
            return handleEnemyDrawCard(state, action);

        case END_TURN:
            return handleEndTurn(state, action);

        case SET_GAME_STATE:
            return { ...state, gameState: action.newGameState };

        case ENEMY_CARD_ATTACK:
            return handleEnemyCardAttack(state, action);

        case ATTACK_MINION:
            return handleAttackMinion(state, action);

        case ATTACK_HERO:
            return handleAttackHero(state, action);

        default:
            return state;
    }
};

function handleConnectToGame(state, action) {
    return {
        ...state,
        isMyTurn: !!action.gameInfo.role,
        gameInfo: action.gameInfo,
        deckCardsAmount: action.gameInfo.playerDeckCardsAmount,
        enemyDeckCardsAmount: action.gameInfo.enemyDeckCardsAmount,
    };
}

function handleCombatResultsComparison(state, { result }) {
    const { gameInfo } = state

    let playerData = result[gameInfo.role];
    let enemyData = result[+!gameInfo.role]; // WORKS ONLY FOR 2 PLAYERS

    let cardsOnBoard = playerData.cardsOnBoard;
    let playerHeroHealth = playerData.health

    let enemyCardsOnBoard = enemyData.cardsOnBoard;
    let enemyHeroHealth = enemyData.health

    return { ...state, enemyCardsOnBoard, enemyHeroHealth, cardsOnBoard, playerHeroHealth };
}

function handleReorderCardsOnHand(state, action) {
    const { cardsOnHand } = state;
    const { startIndex, endIndex } = action;

    let result = Array.from(cardsOnHand);
    let [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return { ...state, cardsOnHand: result }
}

function handleSummonCard(state, action) {
    const { playerHeroGold } = state;
    const { droppableDestination } = action;

    let sourceClone = Array.from(state.cardsOnHand);
    let destClone = Array.from(state.cardsOnBoard);
    let [removed] = sourceClone.splice(action.droppableSource.index, 1);

    const cost = removed.stats[removed.level].cost
    if (playerHeroGold < cost) throw (new Error("Not enough gold"));
    let playerGoldAmount = playerHeroGold - cost;

    destClone.splice(droppableDestination.index, 0, removed);

    return { ...state, playerHeroGold: playerGoldAmount, cardsOnHand: sourceClone, cardsOnBoard: destClone };
}

function handleEnemySummonCard(state, action) {
    const { enemyCardsOnHand, enemyCardsOnBoard, enemyHeroGold } = state;
    const { handPosition, boardPosition, card } = action;

    let sourceClone = Array.from(enemyCardsOnHand);
    let destClone = Array.from(enemyCardsOnBoard);
    sourceClone.splice(handPosition, 1);

    const cost = card.stats[card.level].cost;
    let enemyGoldAmount = enemyHeroGold - cost;

    destClone.splice(boardPosition, 0, card);

    return { ...state, enemyHeroGold: enemyGoldAmount, enemyCardsOnHand: sourceClone, enemyCardsOnBoard: destClone };
}

function handlePlayerDrawCard(state, action) {
    let { deckCardsAmount, playerHeroGold } = state
    const { card } = action;

    if (playerHeroGold < CARD_DRAW_COST) throw (new Error("Not enough gold"));
    let playerGoldAmount = playerHeroGold - CARD_DRAW_COST;
    deckCardsAmount--;

    return { ...state, cardsOnHand: [...state.cardsOnHand, card], playerHeroGold: playerGoldAmount, gameState: GAME_STATE.IDLE, deckCardsAmount }
}

function handleEnemyDrawCard(state, action) {
    const { enemyCardsOnHand, enemyHeroGold, enemyDeckCardsAmount } = state;
    let enemyGoldAmount = enemyHeroGold - CARD_DRAW_COST;
    let cardsLeft = enemyDeckCardsAmount - 1;

    return { ...state, enemyCardsOnHand: [...enemyCardsOnHand, {}], enemyHeroGold: enemyGoldAmount, enemyDeckCardsAmount: cardsLeft }
}

function handleEndTurn(state, action) {
    let { cardsOnBoard, currentRound, isMyTurn, playerHeroGold, enemyHeroGold } = state;

    let playerMinionArray = [...cardsOnBoard];
    currentRound++;
    isMyTurn = !isMyTurn

    const income = Math.ceil(currentRound / 2) > 5 ? 5 : Math.ceil(currentRound / 2);

    if (isMyTurn) {
        for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].isReady = true;

        playerHeroGold = playerHeroGold += income;

        const { gameInfo, cardsOnBoard, cardsOnHand, enemyCardsOnBoard, enemyCardsOnHand, enemyHeroHealth, playerHeroHealth, enemyHeroGold } = state;
        SOCKET.emit('data-comparison', {
            currentRound,
            currentPlayer: gameInfo.role,

            cardsOnBoard,
            cardsOnHand,

            enemyCardsOnBoard,
            enemyCardsOnHand,

            enemyHeroHealth,
            playerHeroHealth,

            enemyHeroGold,
            playerHeroGold,
        });

        return { ...state, isMyTurn, playerHeroGold, currentRound }
    }

    enemyHeroGold = enemyHeroGold += income;
    return { ...state, isMyTurn, enemyHeroGold, currentRound };
}

function handleEnemyCardAttack(state, action) {
    const { gameInfo } = state;
    const { result, playerMinionId, enemyMinionId } = action
    const { role } = gameInfo;

    let playerData = result[role];
    let enemyData = result[+!role]; // WORKS ONLY FOR 2 PLAYERS

    let cardsOnBoard = playerData.cardsOnBoard;
    let playerHeroHealth = playerData.health

    let enemyCardsOnBoard = enemyData.cardsOnBoard;
    let enemyHeroHealth = enemyData.health

    return { ...state, enemyCardsOnBoard, enemyHeroHealth, cardsOnBoard, playerHeroHealth };
}

function handleAttackMinion(state, action) {
    const { cardsOnBoard, enemyCardsOnBoard } = state;
    const { playerMinionId, enemyMinionId } = action;

    let attackingMinion = { ...cardsOnBoard[playerMinionId] };
    let attackedMinion = { ...enemyCardsOnBoard[enemyMinionId] };

    if (!attackingMinion.isReady) throw (new Error("This minion is not ready"));
    attackingMinion.isReady = false;

    let enemyMinionArray = [...enemyCardsOnBoard];
    let playerMinionArray = [...cardsOnBoard];

    attackedMinion.stats[attackedMinion.level].health -= attackingMinion.stats[attackingMinion.level].damage;
    attackingMinion.stats[attackingMinion.level].health -= attackedMinion.stats[attackedMinion.level].damage;

    if (attackedMinion.stats[attackedMinion.level].health <= 0) enemyMinionArray.splice(action.enemyMinionId, 1);
    else enemyMinionArray[action.enemyMinionId] = attackedMinion;

    if (attackingMinion.stats[attackingMinion.level].health <= 0) playerMinionArray.splice(action.playerMinionId, 1);
    else playerMinionArray[action.playerMinionId] = attackingMinion;

    return { ...state, enemyCardsOnBoard: enemyMinionArray, cardsOnBoard: playerMinionArray };
}

function handleAttackHero(state, action) {
    const { cardsOnBoard, enemyHeroHealth } = state;
    const { playerMinionId } = action;

    let playerMinion = { ...cardsOnBoard[playerMinionId] }

    if (!playerMinion.isReady) throw (new Error("This minion is not ready"));
    playerMinion.isReady = false;

    let enemyHeroCurrentHp = enemyHeroHealth - playerMinion.stats[playerMinion.level].damage;
    let playerMinionArray = [...cardsOnBoard];
    playerMinionArray.splice(playerMinionId, 1, playerMinion);

    return { ...state, enemyHeroHealth: enemyHeroCurrentHp, cardsOnBoard: playerMinionArray };
}