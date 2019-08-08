import { REORDER_CARDS_ON_HAND, SUMMON_CARD, END_TURN, SET_GAME_STATE, ATTACK_MINION, ATTACK_HERO, CONNECTED_TO_GAME, PLAYER_DRAW_CARD, ENEMY_DRAW_CARD, ENEMY_SUMMON_CARD, ENEMY_CARD_ATTACK, COMBAT_RESULTS_COMPARISON, RESET_GAME_DATA } from "../actionTypes"
import { SOCKET } from "../../gameplay/containers/Socket";
export const GAME_STATE = {
    BUSY: 1,
    TARGETING: 2,
    IDLE: 3
}
export const CARD_DRAW_COST = 1;

const MAX_HERO_HEALTH = 10;
const GOLD_ON_START = 1;
export const MAX_CARDS_ON_HAND = 6;

const DEFAULT_STATE = {
    cardsOnBoard: [],
    cardsOnHand: [],

    enemyCardsOnBoard: [],
    enemyCardsOnHand: [],

    isMyTurn: true,
    currentRound: 1,

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

        case RESET_GAME_DATA:
            return DEFAULT_STATE

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
    const { playerHeroGold, cardsOnHand, cardsOnBoard } = state;
    const { droppableDestination, droppableSource } = action;

    SOCKET.emit('card-summoned', {
        boardPosition: droppableDestination.index,
        handPosition: cardsOnHand[droppableSource.index].position,
    });

    let sourceClone = Array.from(cardsOnHand);
    let destClone = Array.from(cardsOnBoard);
    let [removed] = sourceClone.splice(droppableSource.index, 1);

    sourceClone = sourceClone.map(card => ({ ...card, position: card.position > removed.position ? card.position - 1 : card.position }))

    const cost = removed.inGame.stats.cost
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

    const cost = card.inGame.stats.cost;
    let enemyGoldAmount = enemyHeroGold - cost;

    destClone.splice(boardPosition, 0, card);

    return { ...state, enemyHeroGold: enemyGoldAmount, enemyCardsOnHand: sourceClone, enemyCardsOnBoard: destClone };
}

function handlePlayerDrawCard(state, action) {
    let { deckCardsAmount, playerHeroGold, cardsOnHand } = state
    let { card } = action;
    card.position = cardsOnHand.length;

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
        for (let i = 0; i < playerMinionArray.length; i++) playerMinionArray[i].inGame.isReady = true;

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

    if (!attackingMinion.inGame.isReady) throw (new Error("This minion is not ready"));
    attackingMinion.inGame.isReady = false;

    let enemyMinionArray = [...enemyCardsOnBoard];
    let playerMinionArray = [...cardsOnBoard];

    attackedMinion.inGame.stats.health -= attackingMinion.inGame.stats.damage;
    attackingMinion.inGame.stats.health -= attackedMinion.inGame.stats.damage;

    if (attackedMinion.inGame.stats.health <= 0) enemyMinionArray.splice(enemyMinionId, 1);
    else enemyMinionArray[enemyMinionId] = attackedMinion;

    if (attackingMinion.inGame.stats.health <= 0) playerMinionArray.splice(playerMinionId, 1);
    else playerMinionArray[playerMinionId] = attackingMinion;

    return { ...state, enemyCardsOnBoard: enemyMinionArray, cardsOnBoard: playerMinionArray };
}

function handleAttackHero(state, action) {
    const { cardsOnBoard, enemyHeroHealth } = state;
    const { playerMinionId } = action;

    let playerMinion = { ...cardsOnBoard[playerMinionId] }

    if (!playerMinion.inGame.isReady) throw (new Error("This minion is not ready"));
    playerMinion.inGame.isReady = false;

    let enemyHeroCurrentHp = enemyHeroHealth - playerMinion.inGame.stats.damage;
    let playerMinionArray = [...cardsOnBoard];
    playerMinionArray.splice(playerMinionId, 1, playerMinion);

    return { ...state, enemyHeroHealth: enemyHeroCurrentHp, cardsOnBoard: playerMinionArray };
}