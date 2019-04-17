import React, {Component} from 'react';
import {connect} from 'react-redux';
import CardItem from '../components/CardItem';
import { cL, tC } from 'react-classlist-helper';
import {selectRace} from '../store/actions/cards';

class CardsList extends Component{
    // constructor(props){
    //     super(props);
    //     this.state={
    //         currentRace:"Dwarves"
    //     }
        
    // }
    // handleRaceChange= (race) => {
    //     this.setState({currentRace:race});
    //     console.log(this.state);
    // }
       
    render(){
        const {cards, selectRace, race} = this.props;
        let isDwarvesSelected = false, isDragonSelected = false, isElvesSelected = false, isHumansSelected = false;
        switch(race){
            case "Dwarves":{ isDwarvesSelected = true; isDragonSelected = false; isElvesSelected = false; isHumansSelected = false;break;}
            case "Dragons":{ isDragonSelected = true; isDwarvesSelected = false; isElvesSelected = false; isHumansSelected = false;break;}
            case "Elves":{ isElvesSelected = true; isDwarvesSelected = false; isDragonSelected = false; isHumansSelected = false;break;}
            case "Humans":{ isHumansSelected = true; isDwarvesSelected = false; isDragonSelected = false; isElvesSelected = false;break;}
        }
        const active = 'active';
        const staticClasses = ['list-group-item',  'col-3', 'list-group-item-action'];
        let cardList = cards.map(card => 
            <CardItem
                card={card}
                key={card._id}/>);
        return(
            <div>
                <div className="list-group list-group-horizontal row" id="list-tab" role="tablist">
                    <div onClick={(e) => selectRace("Dwarves")} className={ cL(staticClasses, tC(active, isDwarvesSelected)) } id="list-dwarves" data-toggle="list" role="tab" aria-controls="home" value="Dwarves">Dwarves</div>
                    <div onClick={(e) => selectRace("Dragons")} className={ cL(staticClasses, tC(active, isDragonSelected)) } id="list-dragons" data-toggle="list" role="tab" aria-controls="profile" value="Dragons">Dragons</div>
                    <div onClick={(e) => selectRace("Elves")} className={ cL(staticClasses, tC(active, isElvesSelected)) } id="list-elves" data-toggle="list" role="tab" aria-controls="messages" value="Elvess">Elves</div>
                    <div onClick={(e) => selectRace("Humans")} className={ cL(staticClasses, tC(active, isHumansSelected)) } id="list-humans" data-toggle="list" role="tab" aria-controls="settings" value="Humans">Humans</div>
                </div>
                <div className="row cards-place">
                    {cardList}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        cards : state.currentUser.user.cards,
        race: state.cards.race
    }
}

export default connect(mapStateToProps, {selectRace}) (CardsList);