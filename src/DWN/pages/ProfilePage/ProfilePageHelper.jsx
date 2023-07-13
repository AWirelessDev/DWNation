import moment from "moment";
import { patchApi } from "../../../helpers";

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
  method,
  URL,
  isPayProfile
) => {
  const {
    subscriber_ID,
    subscriber_Status,
    city,
    address_1,
    state,
    zip_Code,
    country,
    email,
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
    CC_PaymentProfile_ID,
    cC_Update_Date_Time,
    service_Plan,
    covered_Since,
    coverage_Effective,
    hotlined,
    term_Date,
    account_Type,
    rowInsertedEST,
    customertype,
    cardnumber,
    expirationdate,
    cardcode,
  } = modifiedData;

  const subscriberAttributes = {
    subscriber_ID: subscriber_ID,
    subscriber_Status: subscriber_Status,
    city: city,
    address_1: address_1,
    state: state,
    zip_Code: zip_Code,
    country: country,
    current_Losses: current_Losses ? current_Losses : "",
    losses: losses ? losses : "",
    dwnation_Subscriber_ID: dwnation_Subscriber_ID,
    mdn: mdn,
    account_Number: account_Number,
    first_Name: fname,
    last_Name: lname,
    feature_Code: feature_Code,
    insurance_Activation_Date: moment(insurance_Activation_Date).format(
      "YYYY-MM-DDTHH:mm:SS"
    ),
    equipment_Purchase_Date: moment(equipment_Purchase_Date).format(
      "YYYY-MM-DDTHH:mm:SS"
    ),
    modality: modality ? modality : "",
    equipment_Description: equipment_Description,
    esN_IMEI: esN_IMEI,
    location_Code: location_Code ? location_Code : "",
    agent_ID: agent_ID ? agent_ID : "",
    mobile_Activation_Date: moment(mobile_Activation_Date).format(
      "YYYY-MM-DDTHH:mm:SS"
    ),
    cC_Profile_ID: cC_Profile_ID,
    CC_PaymentProfile_ID: CC_PaymentProfile_ID,
    cC_Update_Date_Time: moment(new Date()).format("YYYY-MM-DDTHH:mm:SS"),
    service_Plan: service_Plan,
    covered_Since: moment(covered_Since).format("YYYY-MM-DDTHH:mm:SS"),
    coverage_Effective: moment(coverage_Effective).format(
      "YYYY-MM-DDTHH:mm:SS"
    ),
    hotlined: hotlined ? hotlined : "",
    term_Date: moment(term_Date).format("YYYY-MM-DDTHH:mm:SS"),
    account_Type: account_Type ? account_Type : "",
  };

  const paymentAttributes = {
    merchantCustomerId: "Customer from API1",
    description: "",
    email: email,
    paymentProfiles: {
      customerType: "Individual",
      firstName: fname,
      lastName: lname,
      company: "SampleCompany",
      address: address_1,
      city: city,
      state: state,
      zip: zip_Code,
      country: country,
      phoneNumber: mdn,
      faxNumber: "",
      payment: {
        cardNumber: cardnumber,
        expirationDate: expirationdate,
        cardCode: cardcode,
      },
    },
    validationMode: "testMode",
  };

  if (Object.values(subscriberAttributes).every((x) => x === null)) {
    // all attributes are null then show message "update form correctly"
    return UPDATE_CORRECTLY;
  }
  const payload = isPayProfile ? paymentAttributes : subscriberAttributes;

  const {
    VITE_REACT_URL_API_SUB,
    VITE_REACT_URL_API_PAYMENT_PROFILE,
    VITE_OCP_APIM_SUBSCRIPTION_KEY,
  } = import.meta.env;

  try {
    console.log("PayLoad", payload);
    return patchApi(
      `${URL}`,
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
  // {
  //   key: "fname",
  //   name: "First Name",
  //   isRequired: true,
  // },
  // {
  //   key: "lname",
  //   name: "Last Name",
  //   isRequired: true,
  // },
  // {
  //   key: "mdn",
  //   name: "Phone Number",
  //   isValidPhoneNumber: true,
  //   isRequired: true,
  // },
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
