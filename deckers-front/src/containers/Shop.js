import React, {Component} from 'react';
import {connect} from 'react-redux';
import ChestItem from '../components/ChestItem';
import { buyChest } from '../store/actions/shop';

class Shop extends Component{

    render(){
        const { chests, usr_id, buyChest } = this.props;
        let chestList = chests.map(chest => (
            <ChestItem
              key={chest._id}
              name={chest.name}
              handleClick = {buyChest}
              usr_id={usr_id}
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
        chests: state.shop,
        usr_id: state.currentUser.user._id
      };
    }

export default connect(mapStateToProps, {buyChest})(Shop);