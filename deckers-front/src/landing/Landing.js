import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components"

import nameBackground from "../graphic/landing/background_landing.jpg"
import devicesBackground from "../graphic/landing/background_devices.png"
import testedBackground from "../graphic/landing/background_tested.jpg"

import logo from "../graphic/landing/logo.svg"

import dwarf from "../graphic/landing/cards/dwarf.png"
import forsaken from "../graphic/landing/cards/forsaken.png"
import order from "../graphic/landing/cards/order.png"
import skaven from "../graphic/landing/cards/skaven.png"


const PanelTitle = styled.div`
    font-size: 80px;
    color: white;
    text-shadow: 2px 2px #000;

    display: flex;
    margin: 0 auto;
    align-items: center;
`

const Wrapper = styled.div`
    font-family: 'Lato', sans-serif;
    background: #424858;

    display: flex;
    flex-direction: column;
`

const Panel = styled.div`
    position: relative;
    height: 100vh;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    color:white;
`

const NamePanel = styled(Panel)`
    background-image: url(${nameBackground});
    background-repeat: no-repeat;
    background-size: cover;
`

const OverlapPanel = styled(Panel)`
    position: absolute;
    top:0;
    left:0;
`

const SubText = styled.div`
    width: 60%;
    margin: 0 auto;

    text-align: center;
    font-size: 22px;
    text-shadow: 2px 2px #000;
`

const Logo = styled.div`
    background-image: url(${logo});
    background-repeat: no-repeat;
    background-size: contain;
    height: 80px;
    width: 80px; 
`

const RaceColumn = styled.div`
    width: 25%;
    height: 100%;
    opacity: 0.6;

    background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-position-x: center;
    background-size:cover;
`

const CardsPanel = styled(Panel)`
    flex-direction: row;
`

const TestedPaned = styled(Panel)`
    position: relative;
    height: 100vh;
`
const BackgroundImage = styled.div`
    height: 100%;
    width: 100%;

    background-image: url(${props => props.img});
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: 45%;

    opacity: ${props => props.opacity};
`

const Footer = styled.footer`
    width: 100%;
    padding: 30px 0;  

    background: linear-gradient(#535969, #424858);
    color: #ccc;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Button = styled.button`
    background: #8FC320 ;
    width: 200px;
    color: white;

    height: 50px;
    margin: auto;

    border:none;
    border-radius: 10px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.4s;

    :focus {outline:0;};
    :hover{ background: #9FD430;};
`

class Landing extends Component {
    render() {
        return (
            <Wrapper>
                <NamePanel>
                    <PanelTitle><Logo />DECKERS </PanelTitle>
                    <SubText>
                        Free-to-play online digital collectible card game with simple play style and complicated deck building where every card matters!
                    </SubText>
                </NamePanel>

                <CardsPanel>
                    <RaceColumn img={dwarf} />
                    <RaceColumn img={order} />
                    <RaceColumn img={skaven} />
                    <RaceColumn img={forsaken} />

                    <OverlapPanel>
                        <PanelTitle>Collect cards </PanelTitle>
                        <SubText>
                            4 races, 8 classes, 64 cards
                        </SubText>
                        <SubText>
                            and You - the greatest summoner those lands has seen.
                        </SubText>
                    </OverlapPanel>
                </CardsPanel>
                <Panel>
                    <BackgroundImage img={devicesBackground} opacity={0.2} />
                    <OverlapPanel>
                        <PanelTitle>Play on anything </PanelTitle>
                        <SubText>
                            Deckers will be available online, as a website to everyone.
                    </SubText>
                        <SubText>
                            We plan to support everything that can run Chrome Browser.
                    </SubText>
                    </OverlapPanel>
                </Panel>
                <TestedPaned>
                    <BackgroundImage img={testedBackground} opacity={0.6} />
                    <OverlapPanel>
                        <PanelTitle>Tested in real life </PanelTitle>
                        <SubText>
                            To be sure its worth Your time we developed paper version first,
                        </SubText>
                        <SubText>
                            throughout many iterations shaped to perfection.
                        </SubText>
                    </OverlapPanel>
                </TestedPaned>
                <Footer>
                    Made by me for myself
                    <br />
                    auu
                    <Link to="/login">
                        <Button>For alpha testers</Button>
                    </Link>
                </Footer>
            </Wrapper>

        );
    }
}

export default Landing;