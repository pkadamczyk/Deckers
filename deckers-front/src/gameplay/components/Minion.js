import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { GAME_STATE } from '../../store/reducers/game';

const StyledItem = styled.div` 
    margin: 0 8px 0 0;
    width: ${props => CARD_WIDTH + 'px'};
    height: 130px;

    background: ${props => props.isDragging ? 'lightgreen' : 'grey'};

    border: ${props => props.isDragDisabled ? 'none' : '2px solid rgba(165, 255, 48, 0.7)'};
    border-style: ${props => props.isDragDisabled ? 'none' : 'solid solid none solid'};

    -webkit-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    -moz-box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
    box-shadow: ${props => props.isDragDisabled ? "none" : "0px -1px 2px 3px rgba(165, 255, 48,0.7)"};
`;

function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) return style;
    const { moveTo, curve, duration } = snapshot.dropAnimation;

    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
    return {
        ...style,
        transform: `${translate}`,
        transition: `all ${curve} ${duration}s`,
    };
}

class Content extends Component {
    componentDidUpdate(prevProps) {
        const { snapshot, setIsDragging } = this.props;
        if (prevProps.snapshot.isDragging !== snapshot.isDragging) setIsDragging(snapshot.isDragging)
        if (this.props.snapshot.isDropAnimating) this.props.lockTarget();
    }

    render() {
        const { provided, snapshot, isDragDisabled, item, index } = this.props;
        const cleanTarget = this.props.handleCleanTarget;
        const setTarget = this.props.handleSetTarget;

        return (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
                isDragDisabled={isDragDisabled}
                style={getStyle(provided.draggableProps.style, snapshot)}

                onMouseLeave={() => cleanTarget()}
                onMouseEnter={() => setTarget(`player-minion-${index}`)}
            >
                <div>{item.name}</div>
                <div>Hp: {item.inGame.stats.health}</div>
                <div>Dmg: {item.inGame.stats.damage}</div>
            </StyledItem>
        )
    }
}

class Minion extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9);
        this.state = {
            isDragging: false,
            uniqueId
        }
        this.setIsDragging = this.setIsDragging.bind(this);
    }

    setIsDragging(isDragging) {
        this.setState({ isDragging })
    }

    render() {
        const { item, index, handleCleanTarget, handleSetTarget } = this.props;
        const { uniqueId } = this.state;
        const lockTarget = this.props.handleLockTarget;

        const isDragDisabled = this.shouldDropBeDisabled()
        return (
            <Draggable
                draggableId={uniqueId}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <Content
                        lockTarget={lockTarget}
                        provided={provided}
                        snapshot={snapshot}
                        isDragDisabled={isDragDisabled}
                        item={item}
                        setIsDragging={this.setIsDragging}
                        index={index}

                        handleCleanTarget={handleCleanTarget}
                        handleSetTarget={handleSetTarget}
                    />
                )}
            </Draggable>
        )

    }

    shouldDropBeDisabled() {
        const { item, isMyTurn, gameState, } = this.props;
        const { isDragging } = this.state;

        const hasDamage = item.inGame.stats.damage > 0;
        // const isIdle = gameState === GAME_STATE.IDLE && !isDragging
        // (gameState !== GAME_STATE.IDLE && !isDragging)

        return !isMyTurn || !item.inGame.isReady || !hasDamage || (gameState !== GAME_STATE.IDLE && !isDragging);;
    }
}

export default Minion;