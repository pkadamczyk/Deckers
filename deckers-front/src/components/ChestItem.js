import React, {Component} from 'react';

class ChestItem extends Component{
    render(){
        const {name, usr_id, handleClick, cardAmount} = this.props;
        return(
            <div className="chest-item">
                <h3>{name}</h3><hr/>
                <p>This chest contains:</p>
                    <ul>
                        <li>{cardAmount.common} guaranteed common cards.</li>
                        <li>{cardAmount.rare} guaranteed rare cards.</li>
                        <li>{cardAmount.epic} guaranteed epic cards.</li>
                        <li>{cardAmount.legendary} guaranteed legendary cards.</li>
                        <li>{cardAmount.random} random cards of any rarity.</li>
                    </ul>
                
                <hr/>
                <button className="btn btn-success" onClick={e =>{
                    handleClick(usr_id, name)}}>20 gold</button>
            </div>
        );
    }
}

export default ChestItem;