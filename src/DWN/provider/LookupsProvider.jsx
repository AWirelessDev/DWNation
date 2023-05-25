import { createContext } from "react";
import { useFetch } from "../../hooks";
export const LookupsContext = createContext();

export const LookupsProvider = ({ children }) => {
  const {
    VITE_REACT_URL_API_MDM,
    VITE_FUNCTION_KEY_MDM,
    VITE_REACT_URL_API_VISION3,
    VITE_FUNCTION_KEY_VISION3,
    VITE_EVENTS_FUNCTION_KEY_PMC,
    VITE_REACT_URL_API_PMC,
    VITE_LOCATIONS_API,
    VITE_OCP_APIM_SUBSCRIPTION_KEY,
  } = import.meta.env;

  const [lookups] = useFetch(`${VITE_REACT_URL_API_MDM}/GetCommonLookups`, {
    "x-functions-key": VITE_FUNCTION_KEY_MDM,
  });
  const [jobCodes] = useFetch(`${VITE_REACT_URL_API_MDM}/GetJobCodesLookup`, {
    "x-functions-key": VITE_FUNCTION_KEY_MDM,
  });
  const [programCodes] = useFetch(
    `${VITE_REACT_URL_API_MDM}/GetProgramCodesLookup`,
    {
      "x-functions-key": VITE_FUNCTION_KEY_MDM,
    }
  );

  const [positions] = useFetch(`${VITE_REACT_URL_API_MDM}/GetTitlesLookup`, {
    "x-functions-key": VITE_FUNCTION_KEY_MDM,
  });

  const [visionRoles] = useFetch(
    `${VITE_REACT_URL_API_VISION3}/GetVisionRoles`,
    {
      "x-functions-key": VITE_FUNCTION_KEY_VISION3,
    }
  );

  const [moveType] = useFetch(`${VITE_REACT_URL_API_PMC}/GetNoticeType/2`, {
    "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
  });

  const [noticeType] = useFetch(`${VITE_REACT_URL_API_PMC}/GetNoticeType/3`, {
    "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
  });

  const [EmploymentTypes] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetEmploymentTypes`,
    {
      "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
    }
  );

  const [conductType] = useFetch(`${VITE_REACT_URL_API_PMC}/GetNoticeType/5`, {
    "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
  });

  const [terminationConductType] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetNoticeType/4`,
    {
      "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
    }
  );
  const [businessGroupType] = useFetch(
    `${VITE_REACT_URL_API_MDM}/GetBusinessGroupLookup`
  );

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
        lookups,
        jobCodes,
        programCodes,
        positions,
        visionRoles,
        moveType,
        EmploymentTypes,
        StoreLocations,
        conductType,
        terminationConductType,
        noticeType,
        businessGroupType,
      }}
    >
      {children}
    </LookupsContext.Provider>
  );
};
