import React, {Component} from 'react';

class ShopItem extends Component{
    render(){
        const {name, usr_id, handleClick, cardAmount,price} = this.props;
        return(
            <div className="chest-item">
                <h3 className="chest-item-name">{name}</h3>
                <div className="chest-item-img">
                    <p><img/></p>
                </div>
                    <p>This chest contains:</p>
                    <ul>
                        <li>{cardAmount.common} guaranteed common cards.</li>
                        <li>{cardAmount.rare} guaranteed rare cards.</li>
                        <li>{cardAmount.epic} guaranteed epic cards.</li>
                        <li>{cardAmount.legendary} guaranteed legendary cards.</li>
                        <li>{cardAmount.random} random cards of any rarity.</li>
                    </ul>
                <button className=" btn-buychest" onClick={e =>{
                    handleClick(usr_id, name)}}>
                        <span className="shop-price-gold">{price.amount}</span>
                    </button>
            </div>
        );
    }
}

export default ShopItem;