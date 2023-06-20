import { createContext } from "react";
import { useFetch } from "../../hooks";
export const LookupsContext = createContext();

export const LookupsProvider = ({ children }) => {
  const {
    VITE_REACT_URL_API_MDM,
    VITE_FUNCTION_KEY_MDM,
  } = import.meta.env;

  const [lookups] = useFetch(`${VITE_REACT_URL_API_MDM}/GetCommonLookups`, {
    "x-functions-key": VITE_FUNCTION_KEY_MDM,
  });
  
  
  const StoreLocations = [
    {
      storeNameRqId: 1,
      storeName: "GA-Canton 140",
    },
    {
      storeNameRqId: 2,
      storeName: "GA-Canton 142",
    },
  ];

  return (
    <LookupsContext.Provider
      value={{
        StoreLocations,
      }}
    >
      {children}
    </LookupsContext.Provider>
  );
};
