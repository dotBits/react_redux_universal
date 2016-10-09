import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router'
import * as Actions from '../../actions/ItemSingle'
import { isBrowser } from '../../utils/index'

class SingleItem extends Component {
  constructor(props) {
    super(props);

    this.itemId = parseInt(this.props.params.itemId);
  }

  componentWillMount() {
    if(isBrowser()) {
      return Promise.all([
        this.props.initReducer(),
        this.props.loadItem(this.itemId)
      ])
    }
  }

  static fetchData(dispatch, itemId) {
    return Promise.all([
      dispatch(Actions.initReducer()),
      dispatch(Actions.loadItem(itemId))
    ])
  }

  render() {
    return(
      <div className="clearfix">
        <div className="pull-left">
          {this.props.single._found &&
            <img  src={this.props.single.avatar}
                  className="media-object img-circle thumb"
                  style={{width: '64px', height: '64px', border: '3px solid #d9edf7'}}
                  alt={this.props.single.name} />
          }
        </div>
        <div style={{marginLeft: '90px'}}>
          <h1 style={{marginTop: '0px'}}>{this.props.single.name}</h1>
          {this.props.single._found &&
            <span>
              <p><b>Email</b><br/>{this.props.single.email}</p>
              <p><b>Role</b><br/>{this.props.single._user_role_name}</p>
              <p><b>Status</b><br/>{this.props.single._user_status_name}</p>
            </span>
          }
          <div style={{marginTop: '40px'}}>
            <Link to="/">Go back to the main page</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default SingleItem
