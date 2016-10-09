import { combineReducers } from 'redux'
import active from './AppActiveComponent'
import list from './List'
import single from './Single'

const rootReducer = combineReducers({
  active,
  list,
  single,
})

export default rootReducer
