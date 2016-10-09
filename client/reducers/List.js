const keys = Object.freeze({
  ITEM_LIST_PAGINATION: 'itemList_pagination',
  ITEM_LIST_FILTERS: 'itemList_filters',
  ITEM_LIST_SELECTED_IDS: 'itemList_selectedIds',
});

const defaults = Object.freeze({
  ITEM_LIST_PAGINATION: Object.freeze({offset: 0, limit: 20, defaultLimit: 20, loadMore: 20}),
  ITEM_LIST_FILTERS: Object.freeze({sorter: 'items.name ASC', name: '', email: '', user_role_ids: [], user_status_ids: []}),
  ITEM_LIST_SELECTED_IDS: [],
});


//------------------------------------------------------------------------------------------------------------------------
// LOCALSTORAGE SECTION
//------------------------------------------------------------------------------------------------------------------------
const getListPagination = () => {
  let retHash;
  if (typeof localStorage !== 'undefined')
    retHash = localStorage.getItem(defaults.ITEM_LIST_PAGINATION);
  retHash = (retHash == null) ? defaults.ITEM_LIST_PAGINATION : JSON.parse(retHash);

  return Object.assign({}, retHash);
}
const setListPagination = (prmHash) => {
  if(prmHash) {
    if(typeof localStorage !== 'undefined')
      localStorage.setItem(keys.ITEM_LIST_PAGINATION, JSON.stringify(prmHash))
  }
}

const getListFilters = () => {
  let retHash;

  if(typeof localStorage !== 'undefined')
    retHash = localStorage.getItem(keys.ITEM_LIST_FILTERS);

  retHash = (retHash == null) ? defaults.ITEM_LIST_FILTERS : JSON.parse(retHash);

  return Object.assign({}, retHash);
}

const setListFilters = (prmHash) => {
  if(prmHash) {
    if(typeof localStorage !== 'undefined')
      localStorage.setItem(keys.ITEM_LIST_FILTERS, JSON.stringify(prmHash))
  }
}

const resetListFilters = () => {
  const tmpFilterHash = Object.assign({}, defaults.ITEM_LIST_FILTERS),
        tmpPaginationHash = Object.assign({}, defaults.ITEM_LIST_PAGINATION);

  setListFilters(tmpFilterHash);
  setListPagination(tmpPaginationHash);
}


//------------------------------------------------------------------------------------------------------------------------
// ITEM SELECTION AND BULK ACTIONS
//------------------------------------------------------------------------------------------------------------------------
const setSelectionSingle = (itemId) => {
  return new Promise((resolve, reject) => {
    let gotItems = this.getItems(), i;

    for(let i=0; i<gotItems.length; i++)
      if(gotItems[i].id === itemId) {
        gotItems[i]._checked = (gotItems[i]._checked === true) ? false : true;
        break;
      }

    resolve();
  })
}

const setSelectionBulk = (prmType) => {
  return new Promise((resolve, reject) => {
    let gotItems = this.getItems(), i;

    if(prmType === 'all')
      for(i=0; i<gotItems.length; i++)
        gotItems[i]._checked = true;
    else if(prmType === 'none')
      for(i=0; i<gotItems.length; i++)
        gotItems[i]._checked = false;
    else if(prmType === 'invert')
      for(i=0; i<gotItems.length; i++)
        gotItems[i]._checked = !gotItems[i]._checked;

    resolve();
  })
}

//------------------------------------------------------------------------------------------------------------------------
// REDUCER
//------------------------------------------------------------------------------------------------------------------------
const List = (state, action) => {
  let i, j, match, gotItems;
  const resetReducer = () => {
    return Object.assign(
      {},
      state,
      {
        items:[],
        matches:0,
        results:0,
        is_loading: false,
        filters: getListFilters(),
        pagination: getListPagination(),
        options:{user_status:[], user_roles:[]
      }
    })
  };

  switch (action.type) {
    case 'ITEMS_LOAD_LIST':
      return {
        ...state,
        items: action.data.items,
        matches: action.data._matches,
        results: action.data._results
      }
      break;


    case 'ITEMS_LIST_SET_OPTIONS_ITEM_ROLES':
      i = Object.assign({}, state.options);
      i.user_roles = action.payload;
      return { ...state, options: i };

    case 'ITEMS_LIST_SET_OPTIONS_ITEM_STATUS':
      i = Object.assign({}, state.options);
      i.user_status = action.payload;
      return { ...state, options: i };

    case 'ITEMS_LIST_SELECT_SINGLE':
      let itemId = parseInt(action.id),
          match=false;

      gotItems = Array.from(state.items);

      for(i=0; i<gotItems.length; i++)
        if(gotItems[i].id === itemId) {
          gotItems[i]._checked = (gotItems[i]._checked === true) ? false : true;
          match = true;
          break;
      }

      if(match)
        return { ...state, items: gotItems };
      else
        return state

    case 'ITEMS_LIST_SELECT_BULK':
      gotItems = Array.from(state.items);

      if(action.selectionType === 'all')
        for(i=0; i<gotItems.length; i++)
          gotItems[i]._checked = true;
      else if(action.selectionType === 'none')
        for(i=0; i<gotItems.length; i++)
          gotItems[i]._checked = false;
      else if(action.selectionType === 'invert')
        for(i=0; i<gotItems.length; i++)
          gotItems[i]._checked = !gotItems[i]._checked;

      return { ...state, items: gotItems };

    case 'ITEMS_LOAD_SET_IS_LOADING_STATUS':
      return { ...state, is_loading: action.payload };

    case 'ITEMS_LIST_SET_FILTERS':
      setListFilters(action.payload);
      return { ...state, filters: action.payload };

    case 'ITEMS_LIST_SET_PAGINATION':
      setListPagination(action.payload);
      return { ...state, pagination: action.payload };

    case 'ITEMS_LIST_FILTERS_RESET':
      resetListFilters();
      return { ...state, filters: getListFilters(), pagination: getListPagination() };

    default:
      if(typeof state === 'undefined')
        return resetReducer();
      else
        return state;
  }
}


export default List
