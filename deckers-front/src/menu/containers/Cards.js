import React, {Component} from 'react';
import CardsContent from './CardsContent';
import CardsNavbar from './CardsNavbar';

class Cards extends Component{
    render(){
        return(
            <div className="row">
                <div className="col-10">
                    <CardsContent />
                </div>
                <div className="col-2">
                    <CardsNavbar />
                </div>
            </div>
        )
    }
}

export default Cards;