import React, {Component} from 'react';
import CardsDeck from './CardsDeck';
import CardsList from './CardsList';

class Cards extends Component{
    render(){
        return(
            <div className="row">
                <div className="col-9">
                    <CardsList />
                </div>
                <div className="col-3">
                    <CardsDeck />
                </div>
            </div>
        )
    }
}

export default Cards;