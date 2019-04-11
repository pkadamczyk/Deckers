import React, {Component} from 'react';
import {getChests} from '../store/actions/shop';
import {connect} from 'react-redux';
import ChestItem from '../components/ChestItem';

class Shop extends Component{
    componentDidMount() {
        this.props.getChests();
      }
    render(){
        const { chests } = this.props;
        let chestList = chests.map(chest => (
            <ChestItem
              key={chest._id}
              name={chest.name}
            />
          ));
        return(
            <div>
                <ul>{chestList}</ul>
            </div>
            
        )
    }
}
function mapStateToProps(state){
    return {
        chests: state.shop,
      };
    }

export default connect(mapStateToProps, { getChests })(Shop);