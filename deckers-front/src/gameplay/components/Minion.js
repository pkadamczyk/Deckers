import React, { Component } from 'react';
import styled from "styled-components"

import { Draggable } from 'react-beautiful-dnd';
import { CARD_WIDTH } from '../containers/Board';

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

class Item extends Component {
    componentDidUpdate() {
        if (this.props.snapshot.isDropAnimating) this.props.lockTarget();
    }

    render() {
        const { provided, snapshot, isDragDisabled, item } = this.props;

        return (
            <StyledItem
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
                isDragDisabled={isDragDisabled}
                style={getStyle(provided.draggableProps.style, snapshot)}
            >
                <div>{item.name}</div>
                <div>Hp: {item.stats[item.level - 1].health}</div>
                <div>Dmg: {item.stats[item.level - 1].damage}</div>
            </StyledItem>
        )
    }
}

class Minion extends Component {
    render() {
        const lockTarget = this.props.handleLockTarget;
        const { item, index, isMyTurn } = this.props;
        const isDragDisabled = !isMyTurn || !item.isReady;

        return (
            <Draggable
                draggableId={item._id}
                index={index}
                isDragDisabled={isDragDisabled}
            >
                {(provided, snapshot) => (
                    <Item
                        lockTarget={lockTarget}
                        provided={provided}
                        snapshot={snapshot}
                        isDragDisabled={isDragDisabled}
                        item={item}
                    />
                )}
            </Draggable>
        )

    }
}

export default Minion;