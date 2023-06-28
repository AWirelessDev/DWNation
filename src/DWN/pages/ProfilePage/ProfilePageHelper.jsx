import moment from "moment";
import { getApi, patchApi } from "../../../helpers";

export const UPDATE_CORRECTLY = "No changes made to Customer Profile";
export const VICTRA_CLASSIFICATION_ID = "WRKTP1";
export const dateFormat = "yyyy-MM-DD";

export const formatDataAndPost = async (
  modifiedData,
  previousData,
  employeeRoles,
  loginUser,
  effectiveDate,
  accounts,
  instance,
  impersonation = false,
  impersonEmail = false,
  method
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
      losses,
      dwnation_Subscriber_ID,
      mdn,
      account_Number,
      fname,
      lname,
      feature_Code,
      insurance_Activation_Date,
      equipment_Purchase_Date,
      modality,
      equipment_Description,
      esN_IMEI,
      location_Code,
      agent_ID,
      mobile_Activation_Date,
      cC_Profile_ID,
      cC_Update_Date_Time,
      service_Plan,
      covered_Since,
      coverage_Effective,      
      hotlined,      
      term_Date,
      account_Type,
      rowInsertedEST       
  } = modifiedData;  


  const attributes = {
    
      subscriber_ID:subscriber_ID,
      status: status,
      city : city,
      address_1 : address_1,    
      state : state,
      zip_Code : zip_Code,
      country : country,
      current_Losses : current_Losses,
      losses : losses,      
      dwnation_Subscriber_ID: dwnation_Subscriber_ID,
      mdn: mdn,
      account_Number: account_Number,
      first_Name: fname,
      last_Name: lname,
      feature_Code :  feature_Code,
      insurance_Activation_Date : insurance_Activation_Date,
      equipment_Purchase_Date : equipment_Purchase_Date,
      modality :  modality,
      equipment_Description : equipment_Description,
      esN_IMEI :  esN_IMEI,
      location_Code :  location_Code,
      agent_ID : agent_ID,
      mobile_Activation_Date :  mobile_Activation_Date,
      cC_Profile_ID : cC_Profile_ID,
      cC_Update_Date_Time : cC_Update_Date_Time,
      service_Plan :  service_Plan,
      covered_Since :  covered_Since,
      coverage_Effective : coverage_Effective,      
      hotlined : hotlined,      
      term_Date : term_Date,
      account_Type :  account_Type,
      rowInsertedEST :  rowInsertedEST
  };


  if (Object.values(attributes).every((x) => x === null)) {
    // all attributes are null then show message "update form correctly"
    return UPDATE_CORRECTLY;
  }
  const payload = attributes ;

  const { VITE_REACT_URL_API_SUB, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;

  try {  
    
    return patchApi(
      `${VITE_REACT_URL_API_SUB}`,
      { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY },
      payload,
      method,
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
    key: "fname",
    name: "First Name",
    isRequired: true,
  },
  {
    key: "lname",
    name: "Last Name",
    isRequired: true,
  },
  {
    key: "mdn",
    name: "Phone Number",
    isValidPhoneNumber: true,
    isRequired: true,
  },
  // {
  //   key: "classificationId",
  //   name: "Classification",
  //   isRequired: true,
  // },
  // {
  //   key: "organizationRoleId",
  //   name: "Organization Role",
  //   isRequired: true,
  // },
  // {
  //   key: "hireDate",
  //   name: "Hire Date",
  //   isRequired: true,
  // },
  // {
  //   key: "programCodeId",
  //   name: "Program Code",
  //   isRequired: true,
  // },
  // {
  //   key: "jobCodeId",
  //   name: "Job Code",
  //   isRequired: true,
  // },
];
