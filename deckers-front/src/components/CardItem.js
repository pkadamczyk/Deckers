import React, {Component} from 'react';

class CardItem extends Component{
    render(){
        const {card} = this.props;
        return(
            <div>
                <h3>{card._id}</h3>
                <h4>You have {card.amount} of these</h4>
            </div>
        )
    }

}

export default CardItem;