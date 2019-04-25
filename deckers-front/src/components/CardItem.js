import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addCardToDeck} from '../store/actions/decks';

class CardItem extends Component{
    render(){
        const {card, currentState, addCardToDeck} = this.props;
        return(
            <div className="col-2 card-item m-2">
                <h4 className="mt-2">{card.card.name}</h4><hr/>
                <p>Amount: {card.amount}</p>
                {(currentState==="creating" || currentState==="editing") && (
                    <button onClick={(e)=>{addCardToDeck(card)}} className="btn">Add to deck</button>
                )}
            </div>
        )
    }

}

function mapStateToProps(state){
    return{
        currentState:state.decks.currentState
    }
}

export default connect(mapStateToProps, {addCardToDeck})(CardItem);