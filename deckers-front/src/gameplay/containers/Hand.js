import React, { Component } from 'react';
import HandCard from '../components/HandCard';

class Hand extends Component {
    render() {
        let listOfCards = [1,2,3,4,5,6,7,8,9,10];
        let newlistOfCards = listOfCards.map(card =>
            <HandCard/>
        )
        return (
            <div className="Hand">
                
                <div className='cards'>
                    {newlistOfCards}
                </div>
            </div>
        )
    }
}

export default Hand; 