
export const initialState = {
    tabIndex: 0,
  };

  export const tabReducer = (state, action) => {
    switch (action.type) {
      case 'CURRENT_TAB':
      return { tabIndex: action.tabIndex };
      default:
        return state;
    }
  };