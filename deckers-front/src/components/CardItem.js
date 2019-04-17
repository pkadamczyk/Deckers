import React, {Component} from 'react';

class CardItem extends Component{
    render(){
        const {card} = this.props;
        return(
            <div className="col-2 card-item m-2">
                <h4>{card.card.name}</h4><hr/>
                <p>Amount: {card.amount}</p>
            </div>
        )
    }

}

export default CardItem;