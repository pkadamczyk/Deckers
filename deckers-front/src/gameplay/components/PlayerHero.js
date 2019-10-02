import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import styled from "styled-components"
import { SPELL_ROLE } from '../containers/Game';
import { Effect } from '../../store/reducers/helpers/effects';

export const PLAYER_PORTRAIT_ID = "player-portrait";

const Div = styled.div`
    height: ${props => props.isBeingTargeted ? "110px" : "100px"};
    width: ${props => props.isBeingTargeted ? "110px" : "100px"};

    position: absolute;
    z-index:1;
    left: 5px;
    bottom: 5px;

    border: ${props => props.canBeSpellTargeted ? '2px solid rgba(255, 153, 0, 0.7)' : 'none'};
    border-style: ${props => props.canBeSpellTargeted ? 'solid solid none solid' : 'none'};

    -webkit-box-shadow: ${props => props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    -moz-box-shadow: ${props => props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};
    box-shadow: ${props => props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "none"};

    transition: all 0.4s;
`
class PlayerHero extends Component {
    render() {
        const { health, gold, username, currentTarget } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isBeingTargeted = currentTarget === PLAYER_PORTRAIT_ID;
        const canBeSpellTargeted = this.canBeSpellTargeted()
        const setTargetId = canBeSpellTargeted ? PLAYER_PORTRAIT_ID : null

        return (
            <Div
                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(setTargetId)}
                canBeSpellTargeted={canBeSpellTargeted}
                isBeingTargeted={isBeingTargeted}
            >
                <Portrait
                    health={health}
                    gold={gold}
                    username={username}
                />
            </Div>
        )
    }

    canBeSpellTargeted() {
        const { currentlyDraggedCardId, cardsOnHand } = this.props;
        if (currentlyDraggedCardId === null) return false;

        const currentlyDraggedCard = cardsOnHand[currentlyDraggedCardId]
        const isSpellDragged = currentlyDraggedCard.role === SPELL_ROLE

        if (!currentlyDraggedCard.effects) return false;
        const spellTarget = currentlyDraggedCard.effects.onSummon.length > 0 ? currentlyDraggedCard.effects.onSummon[0].target : null;
        const canBeTargeted = [Effect.TARGET_LIST.SINGLE_TARGET.ALL, Effect.TARGET_LIST.SINGLE_TARGET.ALLY].includes(spellTarget)

        return canBeTargeted && isSpellDragged;
    }
}

function mapStateToProps(state) {
    return {
        health: state.game.playerHeroHealth,
        gold: state.game.playerHeroGold,
        username: state.game.gameInfo.player,
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(PlayerHero);