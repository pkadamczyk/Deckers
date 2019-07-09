import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardsCardItem from '../components/CardsCardItem';
import {cL, tC} from 'react-classlist-helper';

class CardsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //selected race filter
            pickedRace:"",
            //selected class filter
            pickedClass:"",
            //all user cards sorted ascending by cost
            allCards:this.props.cards,
            //cards to be displayed on the page
            cardsToDisplay:this.props.cards.filter((card,index) => index <=7).map(card =>
                <CardsCardItem
                    card={card}
                    key={card._id}/>)};
      }

    
    filterCardsByRace=(cards,race)=>{
       let filteredCards;
       //no race filter picked --> do nothing
       if(this.state.pickedRace==="") return cards;
       // cards is empty --> return empty array
       else if(cards.length===0) filteredCards = [];
       // everything good --> filter and return
       else {filteredCards = cards.filter((card) =>card.card.race === race)
       return filteredCards;
       }
    }


    filterCardsByClass=(cards,role)=>{
       let filteredCards;
       //no class filter picked --> do nothing
       if(this.state.pickedClass==="") return cards;
       // cards is empty --> return empty array
       else if(cards.length===0) filteredCards = [];
       // everything good --> filter and return
       else {filteredCards = cards.filter((card) =>card.card.role === role)
       return filteredCards;
       }

    }
    updateDisplayedCards(cardsToBeDisplayed){
        let finalCardsToDisplay, pages=[];
        //no cards match filters applied --> display nothing
        if(cardsToBeDisplayed===undefined || cardsToBeDisplayed.length===0){
            finalCardsToDisplay=[];
        }else{
            //TEMPORARY SOLUTION (Splitting to pages [one page hardcoded]) <------------------
            pages[0] = this.splitCardsToPages(cardsToBeDisplayed)
            //convert filtered cards to React components
            finalCardsToDisplay = pages[0].map(card =>
                <CardsCardItem
                    card={card}
                    key={card._id}
             />)
        }
        //display cards
        this.setState({cardsToDisplay:finalCardsToDisplay})
    }

    //TEMPORARY <---------------------------------------------------------------------
    splitCardsToPages=(cardsAfterFilters)=>{
        if(cardsAfterFilters.length===0){
            return [];
        }else{
            //check how many cards left
            let max = cardsAfterFilters.length;
            if(max>8) max=8;
            //return first page
            return cardsAfterFilters.slice(0,max);
        }
    }

    //triggered on filter click
    handleFilterSelection=()=>{
        //lastly update displayed cards
        this.updateDisplayedCards(
            //secondly filter by class
            this.filterCardsByClass(
                //firstly filter by race
                this.filterCardsByRace(
                    //get cards, picked class and race from the state
                    this.state.allCards, this.state.pickedRace),this.state.pickedClass)
                )
    }

    //triggered on class filter click
    pickClass=(triggeredClass)=>{
        console.log("Triggered class:"+triggeredClass)
        //none picked yet --> pick this
        if(this.state.pickedClass.length===0){
            this.setState({pickedClass:triggeredClass})
        //triggered the same again --> clear selection
        }else if(this.state.pickedClass===triggeredClass){
            this.setState({pickedClass:""})
        //triggered other filter --> swap to latest pick
        }else this.setState({pickedClass:triggeredClass})
    }

    //triggered on race filter click
    pickRace=(triggeredRace)=>{
        console.log("Triggered race:"+triggeredRace)
        //none picked yet --> pick this
        if(this.state.pickedRace.length===0){
            this.setState({pickedRace:triggeredRace})
        //triggered the same again --> clear selection
        }else if(this.state.pickedRace===triggeredRace){
            this.setState({pickedRace:""})
        //triggered other filter --> swap to latest pick
        }else this.setState({pickedRace:triggeredRace})
    }

    render() {
        let activeClass = "";
        //active-filter
        return (
            <div className="BookOfCards row">
                <div className=" col-11 cards-place">
                    <div className="row">
                        {/* displayed cards */}
                        {this.state.cardsToDisplay}
                    </div>
                </div>

                {/* displaying race filters */}
                <div className="race-filters col-1">
                <div className={cL("race-filter-dwarfs", tC(activeClass, this.state.pickedRace=="0"))}
                    onClick={()=>{
                        this.pickRace(0)
                        this.handleFilterSelection()}}>
                    <img src='/images/icon_race_dwarfs.png' className="race-filter-icon" />
                </div>
                <div className={cL("race-filter-forsaken", tC(activeClass, this.state.pickedRace=="1"))}
                    onClick={()=>{
                        this.pickRace(1)
                        this.handleFilterSelection()}}>
                    <img src='/images/icon_race_forsaken.png' className="race-filter-icon" />
                </div>
                <div className={cL("race-filter-order", tC(activeClass, this.state.pickedRace=="2"))}
                    onClick={()=>{
                        this.pickRace(2)
                        this.handleFilterSelection()}}>
                    <img src='/images/icon_race_order.png' className="race-filter-icon" />
                </div>
                <div className={cL("race-filter-skavens", tC(activeClass, this.state.pickedRace=="3"))}
                    onClick={()=>{
                        this.pickRace(3)
                        this.handleFilterSelection()}}>
                    <img src='/images/icon_race_skaven.png' className="race-filter-icon" />
                </div>
                    
                   
                </div>

                {/* displaying class filters */}
                <div className="col-12 class-filters">
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="0"))}
                        onClick={()=>{
                            this.pickClass(0)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_warrior.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="1"))}
                        onClick={()=>{
                            this.pickClass(1)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_mage.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="2"))}
                        onClick={()=>{
                            this.pickClass(2)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_assassin.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="3"))}
                        onClick={()=>{
                            this.pickClass(3)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_hunter.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="4"))}
                        onClick={()=>{
                            this.pickClass(4)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_priest.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="5"))}
                        onClick={()=>{
                            this.pickClass(5)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_paladin.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="6"))}
                        onClick={()=>{
                            this.pickClass(6)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_merchant.png' className="race-filter-icon" />
                    </div>
                    <div className={cL("class-filter", tC(activeClass, this.state.pickedClass=="7"))}
                        onClick={()=>{
                            this.pickClass(7)
                            this.handleFilterSelection()}}>
                        <img src='/images/icon_class_warlock.png' className="race-filter-icon" />
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        //get cards from redux state and sort them ascending by cost
        cards: state.currentUser.user.cards.sort(
            (first, second)=> (
                first.card.stats[first.level-1].cost - second.card.stats[second.level-1].cost
            )),
    }
}

export default connect(mapStateToProps, null)(CardsContent);