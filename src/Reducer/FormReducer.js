export const initialState = {
    form: {},
    hasFormChanges: false
  };
  
  export const formReducer = (state, action) => {
    switch (action.type) {
      case 'INITIAL_FORM_DATA':
      return { form: action.form, hasFormChanges: false};
      case 'UPDATE_FORM_DATA':
        return {form: action.form, hasFormChanges: action.hasFormChanges};
      case 'UPDATE_FORM_DYNAMIC_DATA': 
      return {...state, action};
      default:
        return state;
    }
  };