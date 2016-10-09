

const Single = (state, action) => {
  const resetReducer = () => {
          return {
            item:{name:'', email:''},
          }
        };

  switch (action.type) {
    case 'ITEM_SINGLE_SET':
      return { ...state, item: Object.assign({}, action.data.item)};
      break;

    default:
      if(typeof state === 'undefined')
        return resetReducer();
      else
        return state;
  }
}

export default Single
