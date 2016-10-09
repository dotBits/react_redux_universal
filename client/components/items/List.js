import React, { Component, PropTypes } from 'react'
import ListFilter from './ListFilters'
import ListItems from './ListItems'
import * as Actions from '../../actions/ItemList'
import { isBrowser } from '../../utils/index'


class UserList extends Component {
  componentWillMount() {
    if(isBrowser()) {
      return Promise.all([
        this.props.initReducer(),
        this.props.loadList(),
        this.props.loadUserStatus(),
        this.props.loadUserRoles()
      ])
    }
  }

  static fetchData(dispatch) {
    return Promise.all([
      dispatch(Actions.initReducer()),
      dispatch(Actions.loadItemList()),
      dispatch(Actions.loadOptions_userStatus()),
      dispatch(Actions.loadOptions_userRoles()),
    ])
  }

  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="row">
          <ListFilter list={this.props.list}
                      setFilters={this.props.setFilters}
                      resetFilters={this.props.resetFilters} />

          <ListItems  list={this.props.list}
                      loadList={this.props.loadList}
                      loadMore={this.props.loadMore}
                      deleteItemList={this.props.deleteItemList}
                      createNewItem={this.props.createNewItem}
                      setSelectionSingle={this.props.setSelectionSingle}
                      setSelectionBulk={this.props.setSelectionBulk}
                      setFilters={this.props.setFilters}
                      resetFilters={this.props.resetFilters} />
        </div>
      </div>
    )
  }
}

UserList.propTypes = {
  list: PropTypes.object.isRequired,
  loadList: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  createNewItem: PropTypes.func.isRequired,
  setSelectionSingle: PropTypes.func.isRequired,
  setSelectionBulk: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired
}

export default UserList
