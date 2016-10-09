import Api from '../api/Items'
import { isBrowser } from '../utils/index'

export const initReducer = () => { return dispatch => dispatch({ type: 'ACTIVE_COMPONENT_SET_ITEM', payload: {parent: 'item_single'}}) }

//------------------------------------------------------------------------------------------------------------------------
// LOAD ITEM
//------------------------------------------------------------------------------------------------------------------------
export const setItem = (xhrPayload) => { return { type: 'ITEM_SINGLE_SET', data: xhrPayload } }
export const loadItem = (itemId) => {
  return (dispatch, getState) => {
    if(!itemId) {
      const state = getState();
      if(!state.hasOwnProperty('single')) { return Promise.resolve() }
      if(!state.single.hasOwnProperty('item')) { return Promise.resolve() }
      if(!state.single.item.hasOwnProperty('id')) { return Promise.resolve() }
      itemId = state.single.item.id;
    }

    return Api.getSingle(itemId).then(response => {
      dispatch(setItem(response));
      return(response);

    }).catch(error => {
      console.error(error);
      if (isBrowser()) { notie.alert(3, error.message, 3) }
    });
  }
}
