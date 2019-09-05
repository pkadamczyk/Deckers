import React, { Component } from 'react';

import styled from "styled-components"

import { connect } from "react-redux"
import EnemyMinion from '../components/EnemyMinion';

const DroppableDiv = styled.div`
    height: 50%;
    position: relative;

    width: 100vw;
    left: calc( -50vw + 50%);

    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin: auto;
    padding: 8px;
`;
class EnemyBoard extends Component {
    constructor(props) {
        super(props);
        this.state = { flipped: null };
    }

    // shouldComponentUpdate(nextProps) {
    //     if (this.props.items === nextProps.items) {
    //         return false;
    //     }
    //     return true;
    // }

    render() {
        const { currentTarget, isMinionDragged, gameState, currentlyDraggedCardId, cardsOnHand } = this.props;
        const { handleCleanTarget, handleSetTarget } = this.props;

        return (
            <DroppableDiv>
                {this.props.items.map((item, index) => (
                    <EnemyMinion
                        key={index + Math.random}
                        index={index}
                        currentTarget={currentTarget}
                        isMinionDragged={isMinionDragged}
                        item={item}
                        gameState={gameState}
                        currentlyDraggedCardId={currentlyDraggedCardId}
                        cardsOnHand={cardsOnHand}

                        handleCleanTarget={handleCleanTarget}
                        handleSetTarget={handleSetTarget}
                    />
                ))}
            </DroppableDiv>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameState: state.game.gameState,
        cardsOnHand: state.game.cardsOnHand,
    }
}

export default connect(mapStateToProps)(EnemyBoard); 