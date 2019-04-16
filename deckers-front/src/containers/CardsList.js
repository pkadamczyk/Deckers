import React, {Component} from 'react';
import {connect} from 'react-redux';
import CardItem from '../components/CardItem';
import { cL, tC } from 'react-classlist-helper';

class CardsList extends Component{
    constructor(props){
        super(props);
        this.state={
            currentRace:"Dwarves"
        }
        
    }
    handleRaceChange= (race) => {
        this.setState({currentRace:race});
        console.log(this.state);
    }
       
    render(){
        ///classes
        const isSelected = true;
        const active = 'active';
        const staticClasses = ['list-group-item',  'col-3', 'list-group-item-action'];
    ///
         const {cards} = this.props;
         let cardList = cards.map(card => 
             <CardItem
                 card={card}
                 key={card._id}/>);
        return(
            <div>
                <div className="list-group list-group-horizontal row" id="list-tab" role="tablist">
                    <div onClick={(e) => this.handleRaceChange("Dwarves")} className= { cL(staticClasses, tC(active, this.state.currentRace===this.value)) } id="list-home-list" data-toggle="list" role="tab" aria-controls="home" value="Dwarves">Dwarves</div>
                    <div onClick={(e) => this.handleRaceChange("Dragons")} className="list-group-item list-group-item-action col-3" id="list-profile-list" data-toggle="list" role="tab" aria-controls="profile" value="Dragons">Dragons</div>
                    <div onClick={(e) => this.handleRaceChange("Elves")} className="list-group-item list-group-item-action col-3 active" id="list-messages-list" data-toggle="list" role="tab" aria-controls="messages" value="Elvess">Elves</div>
                    <div onClick={(e) => this.handleRaceChange("Humans")} className="list-group-item list-group-item-action col-3 " id="list-settings-list" data-toggle="list" role="tab" aria-controls="settings" value="Humans">Humans</div>
                </div>
                <div className="row cards-place">
                    {cardList}
                </div>
            </div>



            // <div>
            //     <ul class="list-group list-group-horizontal">
            //         <li class="list-group-item">Dwarfs</li>
            //         <li class="list-group-item">Elves</li>
            //         <li class="list-group-item">Dragons</li>
            //     </ul>
            // </div>
            
            // <div className="row">
            //     
            // </div>
        )
    }
}
function mapStateToProps(state){
    return{
        cards : state.currentUser.user.cards
    }
}

export default connect(mapStateToProps, null) (CardsList);