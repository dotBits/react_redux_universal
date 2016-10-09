import { connect } from 'react-redux'
import * as Actions from '../../actions/ItemSingle'
import SingleItem from './Single'

const mapStateToProps = (state) => {
  return {
    single: state.single.item,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initReducer: () => { dispatch(Actions.initReducer()) },
    loadItem: (itemId) => { dispatch(Actions.loadItem(itemId)) }
  }
}

const SingleRx = connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleItem)

export default SingleRx
