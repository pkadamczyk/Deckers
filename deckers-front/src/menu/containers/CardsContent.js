import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardsCardItem from '../components/CardsCardItem';
import { cL, tC } from 'react-classlist-helper';
// import { icon_race_skavens } from '../../graphic/icon_race_skavens.png'

class CardsContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            race: "Dwarves"
        }
    }
    // onClick event handler
    handleRaceChange = (race) => {
        this.setState({ race: race });
    }

    render() {
        //deconstructing things
        const { cards } = this.props;
        const { race } = this.state;

        let displayCards = cards.map(card =>
            <CardsCardItem
                card={card}
                key={card._id}
            />);

        //conditional classes to make tabs changing
        // let isDwarvesSelected = false, isDragonSelected = false, isElvesSelected = false, isHumansSelected = false;
        // eslint-disable-next-line
        // switch(race){
        //     case "Dwarves":{ isDwarvesSelected = true; isDragonSelected = false; isElvesSelected = false; isHumansSelected = false;break;}
        //     case "Dragons":{ isDragonSelected = true; isDwarvesSelected = false; isElvesSelected = false; isHumansSelected = false;break;}
        //     case "Elves":{ isElvesSelected = true; isDwarvesSelected = false; isDragonSelected = false; isHumansSelected = false;break;}
        //     case "Humans":{ isHumansSelected = true; isDwarvesSelected = false; isDragonSelected = false; isElvesSelected = false;break;}
        // }

        //definitions of those classes
        // const active = 'active';
        // const staticClasses = ['list-group-item',  'col-3', 'list-group-item-action'];

        //filtering cards based on their race
        // let dwarvesCards = cards.filter( card => card.card.race === 0).map(card => 
        //     <CardsCardItem
        //         card={card}
        //         key={card._id}
        //     />);
        // let elvesCards = cards.filter( card => card.card.race === 1).map(card => 
        //     <CardsCardItem
        //         card={card}
        //         key={card._id}
        //     />);
        // let dragonsCards = cards.filter( card => card.card.race === 2).map(card => 
        //     <CardsCardItem
        //         card={card}
        //         key={card._id}
        //     />);
        return (
            <div className="BookOfCards row">
                <div className=" col-11 cards-place">
                    <div className="row">
                        {displayCards}
                    </div>
                </div>
                <div className="race-filters col-1">
                    <div className="race-filter-skavens">
                        <img src='/images/icon_race_skaven.png' className="race-filter-icon" />
                    </div>
                    <div className="race-filter-order">
                        <img src='/images/icon_race_order.png' className="race-filter-icon" />
                    </div>
                    <div className="race-filter-dwarfs">
                        <img src='/images/icon_race_dwarfs.png' className="race-filter-icon" />
                    </div>
                    <div className="race-filter-forsaken">
                        <img src='/images/icon_race_forsaken.png' className="race-filter-icon" />
                    </div>
                </div>
                <div className="col-12 class-filters">
                    <div className="class-filter">
                        <img src='/images/icon_class_warrior.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_mage.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_assassin.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_hunter.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_priest.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_paladin.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_merchant.png' className="race-filter-icon" />
                    </div>
                    <div className="class-filter">
                        <img src='/images/icon_class_warlock.png' className="race-filter-icon" />
                    </div>
                </div>
                {/* displaying tabs
                <div className="list-group list-group-horizontal row" id="list-tab" role="tablist">
                    <div onClick={(e) => this.handleRaceChange("Dwarves")} className={ cL(staticClasses, tC(active, isDwarvesSelected)) } id="list-dwarves" data-toggle="list" role="tab" aria-controls="home" value="Dwarves">Dwarves</div>
                    <div onClick={(e) => this.handleRaceChange("Dragons")} className={ cL(staticClasses, tC(active, isDragonSelected)) } id="list-dragons" data-toggle="list" role="tab" aria-controls="profile" value="Dragons">Dragons</div>
                    <div onClick={(e) => this.handleRaceChange("Elves")} className={ cL(staticClasses, tC(active, isElvesSelected)) } id="list-elves" data-toggle="list" role="tab" aria-controls="messages" value="Elvess">Forsakens</div>
                    <div onClick={(e) => this.handleRaceChange("Humans")} className={ cL(staticClasses, tC(active, isHumansSelected)) } id="list-humans" data-toggle="list" role="tab" aria-controls="settings" value="Humans">Humans</div>
                </div>*/}
                {/* displaying cards 
                <div className="row cards-place">
                    {race==="Dwarves" && dwarvesCards}
                    {race==="Elves" && elvesCards}
                    {race==="Dragons" && dragonsCards}
                </div>*/}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        cards: state.currentUser.user.cards,
    }
}

export default connect(mapStateToProps, null)(CardsContent);