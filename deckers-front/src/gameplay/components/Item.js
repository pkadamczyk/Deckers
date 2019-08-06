import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';
import { PLAYER_HAND_ID } from '../containers/PlayerHand';
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

function getStyle(style, snapshot, cardsOnBoardLength, currentTarget) {
    if (!snapshot.isDropAnimating) return style;

    const { moveTo, curve, duration } = snapshot.dropAnimation;
    let translate;

    if (currentTarget == PLAYER_HAND_ID) translate = `translate(${moveTo.x}px, ${moveTo.y}px)`
    else translate = cardsOnBoardLength == 0 ? `translate(${moveTo.x}px, ${moveTo.y + 330}px)` : `translate(${moveTo.x - 50}px, ${moveTo.y}px)`;

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
    }

    render() {
        const { provided, snapshot, item, isDragDisabled, cardsOnBoard, currentTarget } = this.props;
        return (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
                isDragDisabled={isDragDisabled}
                style={getStyle(provided.draggableProps.style, snapshot, cardsOnBoard.length, currentTarget)}
            >
                <div>{item.name}</div>
                <div>Hp: {item.stats[item.level - 1].health}</div>
                <div>Dmg: {item.stats[item.level - 1].damage}</div>
                <div>Cost: {item.stats[item.level - 1].cost}</div>
            </StyledItem>
        )

    }
}
class Item extends Component {
    constructor(props) {
        super(props);
        const uniqueId = '_' + Math.random().toString(36).substr(2, 9);
        this.state = { isDragging: false, uniqueId }
        this.setIsDragging = this.setIsDragging.bind(this);
    }

    setIsDragging(isDragging) {
        this.setState({ isDragging })
    }

    render() {
        const { item, index, isMyTurn, cardsOnBoard, currentTarget, gold, gameState } = this.props;
        const { isDragging, uniqueId } = this.state;

        const isAffordable = gold >= item.stats[item.level - 1].cost;
        const isDragDisabled = !isAffordable || !isMyTurn;

        return (
            <Draggable
                draggableId={uniqueId}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <Content
                        item={item}
                        provided={provided}
                        snapshot={snapshot}
                        isDragDisabled={isDragDisabled}
                        setIsDragging={this.setIsDragging}
                        cardsOnBoard={cardsOnBoard}
                        currentTarget={currentTarget}
                    >
                    </Content>
                )}
            </Draggable>
        )
    }
}

export default Item;