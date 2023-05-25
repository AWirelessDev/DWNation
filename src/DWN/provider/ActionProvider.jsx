import { createContext, useReducer } from "react";
import { tabReducer, initialState} from '../../Reducer/TabReducer';

export const ActionContext = createContext();

export const ActionProvider = ({ children }) => {

const [ tabState, tabDispatch ] = useReducer(tabReducer, initialState);
 
  return <ActionContext.Provider value={{tabState, tabDispatch}}>{children}</ActionContext.Provider>;
};
