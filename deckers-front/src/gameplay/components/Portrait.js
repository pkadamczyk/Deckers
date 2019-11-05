import React, { Component } from 'react';
import styled from "styled-components"

import avatars from "../../graphic/avatars"
import heroBackground from '../../graphic/background_hero.png';

const Background = styled.div`
    height: 100%;
    width: 100%;

    background-image: url(${heroBackground});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`

const Image = styled.div`
    height: 100%;
    width: 100%;

    background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
`;

const Stat = styled.div`
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background: ${props => props.color};

    -webkit-user-select: none;        
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;

    text-align: center;
`

const Stats = styled.div`
    display: flex;
    justify-content: space-between;

    width: 100%;
`

class Portrait extends Component {
    render() {
        const { health, gold, avatarID } = this.props;
        return (
            <Background>
                <Image img={avatars.get(avatarID)}>
                    <Stats>
                        <Stat color="crimson">{health}</Stat>
                        <Stat color="#D4AF37">{gold}</Stat>
                    </Stats>
                </Image>
            </Background>
        )
    }
}

export default Portrait; 