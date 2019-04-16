import React, {Component} from 'react';
import {connect} from 'react-redux';
import CardItem from '../components/CardItem';

class CardsList extends Component{
    render(){
        const {cards} = this.props;
        let cardList = cards.map(card => 
            <CardItem
                card={card}/>);
        return(
            <div>
                {cardList}
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        cards : state.currentUser.user.cards
    }
}

export default connect(mapStateToProps, null) (CardsList);