import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChestItem from '../components/ChestItem';

class Shop extends Component{

    render(){
        const { chests } = this.props;
        let chestList = chests.map(chest => (
            <ChestItem
              key={chest._id}
              name={chest.name}
            />
          ));
        return(
            <div className="col-3">
                {chestList}
            </div>
            
        )
    }
}
function mapStateToProps(state){
    return {
        chests: state.shop
      };
    }

export default connect(mapStateToProps, null)(Shop);