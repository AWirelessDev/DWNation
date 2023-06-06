import moment from "moment";
import { getApi, postApi } from "../../../helpers";

export const UPDATE_CORRECTLY = "No changes made to Employee Profile";
export const VICTRA_CLASSIFICATION_ID = "WRKTP1";
export const dateFormat = "yyyy-MM-DD";

export const getEmployeeDetailsById = async (
  url,
  headers,
  accounts = {},
  instance = {},
  impersonation = false,
  impersonEmail = false
) => {
  return getApi(url, headers, accounts, instance, impersonation, impersonEmail);
};

export const formatDataAndPost = async (
  modifiedData,
  previousData,
  employeeRoles,
  loginUser,
  effectiveDate,
  accounts,
  instance,
  impersonation = false,
  impersonEmail = false
) => {
  const {            
      subscriber_ID,
      status,
      city,
      address_1,
      state,
      zip_Code,
      country,
      current_Losses,
      losses      
  } = modifiedData;  

  const attributes = {
      
    // "Subscriber_ID":1,
    // status: status || null,
    // last_Name : last_Name || null,
    // mdn: mdn || null  
     
      subscriber_ID:1,
      status: status,
      city : city,
      address_1 : address_1,    
      state : state,
      zip_Code : zip_Code,
      country : country,
      current_Losses : current_Losses,
      losses : losses        
   
  };

  

  if (Object.values(attributes).every((x) => x === null)) {
    // all attributes are null then show message "update form correctly"
    return UPDATE_CORRECTLY;
  }
  const payload = {
    attributes    
  };

  const { VITE_REACT_URL_API_SUB, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;

  try {
    return postApi(
      `${VITE_REACT_URL_API_SUB}`,
      { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY },
      payload,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
  } catch (error) {
    return error.message;
  }
};

export const fetchPendingChangesApi = async (
  id,
  accounts,
  instance,
  impersonation = false,
  impersonEmail = false
) => {
  const { VITE_REACT_URL_API_SUB, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;
  try {
    return await getApi(
      `${VITE_REACT_URL_API_SUB}?phoneNumber=${phone}`,
      { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
  } catch (error) {
    return error.message;
  }
};

export const profileFormValidation = [
  {
    key: "supervisorMDMWorkerId",
    name: "Reports To",
    isRequired: true,
  },
  {
    key: "companyId",
    name: "Primary Company",
    isRequired: true,
  },
  {
    key: "visionRole",
    name: "Vision Role",
    isRequired: true,
  },
  {
    key: "officePhone",
    name: "Office Phone Number",
    isValidPhoneNumber: true,
  },
  {
    key: "classificationId",
    name: "Classification",
    isRequired: true,
  },
  {
    key: "organizationRoleId",
    name: "Organization Role",
    isRequired: true,
  },
  {
    key: "hireDate",
    name: "Hire Date",
    isRequired: true,
  },
  {
    key: "programCodeId",
    name: "Program Code",
    isRequired: true,
  },
  {
    key: "jobCodeId",
    name: "Job Code",
    isRequired: true,
  },
];

export const udpateSecondaryLocations = (_locations) => {
  if (_locations?.length) {
    return _locations?.map((_location) => {
      return (
        _location?.assignmentType !== "Primary" && _location?.mdmLocationLevelId
      );
    });
  }
  return [];
};

export const profileFormValidationForVictra = [
  {
    key: "visionRole",
    name: "Vision Role",
    isRequired: true,
  },
  {
    key: "officePhone",
    name: "Office Phone Number",
    isValidPhoneNumber: true,
    isRequired: true,
  },
  {
    key: "programCodeId",
    name: "Program Code",
    isRequired: true,
  },
  {
    key: "jobCodeId",
    name: "Job Code",
    isRequired: true,
  },
];

export const profileFormValidationForOwnVictra = [
  {
    key: "officePhone",
    name: "Office Phone Number",
    isValidPhoneNumber: true,
    isRequired: true,
  },
];

export const profileFormValidationForOwnContractor = [
  {
    key: "officePhone",
    name: "Office Phone Number",
    isValidPhoneNumber: true,
  },
];

export const udpateSecondaryCompanyIds = (_companies) => {
  if (_companies?.length) {
    const secondaryCompanies = _companies?.map((_company) => {
      const companyId = parseInt(_company.mdmCompanyId);
      return !_company?.isPrimary && Number.isInteger(companyId)
        ? companyId
        : null;
    });
    return secondaryCompanies.filter(Boolean); // remove null values from the array
  } else {
    return [];
  }
};
