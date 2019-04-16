import React, {Component} from 'react';

class CardItem extends Component{
    render(){
        const {card} = this.props;
        return(
            <div className="col-2 card-item m-2">
                <h3>{card.card.name}</h3>
                <h4>Amount: {card.amount}</h4>
            </div>
        )
    }

}

export default CardItem;