import React, {Component} from 'react';

class ChestItem extends Component{
    render(){
        const {name, usr_id, handleClick} = this.props;
        return(
            <div className="chest-item">
                <h3>{name}</h3><hr/>
                <p>Waiting for backend rework to make below button work</p><hr/>
                <button className="btn btn-success" onClick={e =>{
                    console.log(usr_id);
                    handleClick(usr_id, name)}}>20 gold</button>
            </div>
        );
    }
}

export default ChestItem;