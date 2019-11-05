import React, { Component } from 'react';
import Portrait from "./Portrait"

import { connect } from "react-redux"
import styled from "styled-components"
import { SPELL_ROLE } from '../containers/Game';
import { Effect } from '../../store/reducers/helpers/effects';

export const PLAYER_PORTRAIT_ID = "player-portrait";

const Wrapper = styled.div`
    height: 120px;
    width: 120px;

    position: absolute;
    z-index:1;
    right: 660px;
    bottom: 15px;

    -webkit-box-shadow: ${props => props.canBeSpellTargeted ? "0px 0px 4px 7px rgba(255, 153, 0,0.7)" : "0px 0px 4px 7px rgba(0, 0, 0, 0.7)"};
    -moz-box-shadow: ${props => props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "0px 0px 4px 7px rgba(0, 0, 0, 0.7)"};
    box-shadow: ${props => props.canBeSpellTargeted ? "0px -1px 2px 3px rgba(255, 153, 0,0.7)" : "0px 0px 4px 7px rgba(0, 0, 0, 0.7)"};

    transition: all 0.3s;
`
class PlayerHero extends Component {
    render() {
        const { health, gold, currentTarget, avatarID } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        const isBeingTargeted = currentTarget === PLAYER_PORTRAIT_ID;
        const canBeSpellTargeted = this.canBeSpellTargeted()
        const setTargetId = canBeSpellTargeted ? PLAYER_PORTRAIT_ID : null

        return (
            <Wrapper
                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(setTargetId)}
                canBeSpellTargeted={canBeSpellTargeted}
                isBeingTargeted={isBeingTargeted}
            >
                <Portrait
                    health={health}
                    gold={gold}
                    avatarID={avatarID}
                />
            </Wrapper>
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
        avatarID: state.currentUser.user.avatarID,
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(PlayerHero);