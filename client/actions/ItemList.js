import Api from '../api/Items'
import { isBrowser } from '../utils/index'

export const initReducer = () => { return dispatch => dispatch({ type: 'ACTIVE_COMPONENT_SET_ITEM', payload: {parent: 'item_list'}}) }
//------------------------------------------------------------------------------------------------------------------------
// ITEM SELECTION ACTIONS
//------------------------------------------------------------------------------------------------------------------------
export const setSelectionSingle = (id) => { return { type: 'ITEMS_LIST_SELECT_SINGLE', id } };
export const setSelectionBulk = (selectionType) => { return { type: 'ITEMS_LIST_SELECT_BULK', selectionType } };

//------------------------------------------------------------------------------------------------------------------------
// FILTER AND PAGINATION
//------------------------------------------------------------------------------------------------------------------------
export const setFilters = (filters) => {
  return dispatch => {
    dispatch({ type: 'ITEMS_LIST_SET_FILTERS', payload: filters });
    dispatch(loadItemList());
  }
};

export const resetFilters = () => { return dispatch => {
    dispatch({type: 'ITEMS_LIST_FILTERS_RESET'});
    dispatch(loadItemList());
  }
}

export const setPagination = (pagination) => {
  return dispatch => {
    dispatch({ type: 'ITEMS_LIST_SET_PAGINATION', payload: pagination });
    dispatch(loadItemList());
  }
};

//------------------------------------------------------------------------------------------------------------------------
// LOAD ITEM LIST
//------------------------------------------------------------------------------------------------------------------------
export const setItems = (xhrPayload) => { return { type: 'ITEMS_LOAD_LIST', data: xhrPayload } }
export const setIsLoadingStatus = (status) => { return { type: 'ITEMS_LOAD_SET_IS_LOADING_STATUS', payload: status } }
export const loadItemList = () => {
  return (dispatch, getState) => {
    const state = getState(),
          xhrFilterParams = {
            filters: state.list.filters,
            pagination: state.list.pagination
          };

    dispatch(setIsLoadingStatus(true));

    return Api.getList(xhrFilterParams).then(response => {
      dispatch(setItems(response));
      dispatch(setIsLoadingStatus(false));
      return(response);
    }).catch(error => {
      console.error(error);
      dispatch(setIsLoadingStatus(false));
    });
  }
}

export const loadMore = () => {
  return (dispatch, getState) => {
    const state = getState();
    if(state.list.is_loading) { return }

    let pagination = Object.assign({}, state.list.pagination);
    if(pagination.matches < 1) { return }

    pagination.limit += pagination.loadMore;

    if(pagination.limit > pagination.matches)
      pagination.limit = pagination.matches;


    dispatch(setPagination(pagination));
  }
}

//------------------------------------------------------------------------------------------------------------------------
// CREATE NEW ITEM
//------------------------------------------------------------------------------------------------------------------------
export const createNewItem = () => {
  return (dispatch, getState) => {

    Api.createItem({item: {}}).then(response => {
      if (isBrowser()) { notie.alert(1, response.message, 1.5) }

    }).catch(error => {
      console.error(error);
      if (isBrowser()) { notie.alert(3, error.message, 3) }
    });
  }
}

//------------------------------------------------------------------------------------------------------------------------
// DELETE ITEM LIST
//------------------------------------------------------------------------------------------------------------------------
export const deleteItemList = (itemId) => {
  return (dispatch, getState) => {
    let gotItems = getState().list.items, i, idListToDelete = [];

    for(let i=0; i<gotItems.length; i++)
      if(gotItems[i]._checked === true)
        idListToDelete.push(gotItems[i].id);

    Api.deleteItemList({ids: idListToDelete}).then(response => {
      if (isBrowser()) { notie.alert(1, response.message, 1.5) }

    }).catch(error => {
      console.error(error);
      if (isBrowser()) { notie.alert(3, error.message, 3) }
    });

  }
}

//------------------------------------------------------------------------------------------------------------------------
// LOAD ITEM ROLE OPTIONS
//------------------------------------------------------------------------------------------------------------------------
export const setOptionUserRoles = (xhrPayload) => { return { type: 'ITEMS_LIST_SET_OPTIONS_ITEM_ROLES', payload: xhrPayload } }
export const loadOptions_userRoles = () => {
  return (dispatch) => {

    return Api.getItemRoleList({}).then(response => {
      let optionList = response.item_roles.map(function(item) {
        return {value: item.id, label: item.name};
      });

      dispatch(setOptionUserRoles(optionList));
      return(optionList);

    }).catch(error => {
      console.error(error);
      if (isBrowser()) { notie.alert(3, error.message, 3) }
    });
  }
}

//------------------------------------------------------------------------------------------------------------------------
// LOAD ITEM STATUS OPTIONS
//------------------------------------------------------------------------------------------------------------------------
export const setOptionUserStatus = (xhrPayload) => { return { type: 'ITEMS_LIST_SET_OPTIONS_ITEM_STATUS', payload: xhrPayload } }
export const loadOptions_userStatus = () => {
  return (dispatch) => {

    return Api.getItemStatusList({}).then(response => {
      let optionList = response.item_status.map(function(item) {
        return {value: item.id, label: item.name};
      });

      dispatch(setOptionUserStatus(optionList));
      return(optionList);

    }).catch(error => {
      console.error(error);
      if (isBrowser()) { notie.alert(3, error.message, 3) }
    });
  }
}
