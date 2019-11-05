import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux"
import styled from "styled-components"

export const SPELL_FIX_ID = "spell-fix"

const FullScreenDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: red;
    opacity: ${props => props.isNeeded ? "0.05" : "0"};
`

class SpellFix extends Component {
    render() {
        const { isNeeded } = this.props
        return (
            <Droppable
                droppableId={SPELL_FIX_ID}
                direction="horizontal"
                isDropDisabled={!isNeeded}
            >
                {(provided, snapshot) => (
                    <FullScreenDiv
                        isNeeded={isNeeded}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    />
                )}
            </Droppable>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.game.gameInfo.role,
        cards: state.game.gameInfo.starterCards,
    }
}

export default connect(mapStateToProps)(SpellFix);