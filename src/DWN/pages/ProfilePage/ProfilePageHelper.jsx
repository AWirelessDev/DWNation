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
    preferredFirstName,
    gender,
    legalFirstName,
    positionId,
    supervisorMDMWorkerId,
    legalLastName,
    jobCodeId,
    programCodeId,
    companyId,
    organizationRoleId,
    visionRole,
    officePhone,
    appProvisioningRoleId,
    sendToOmni,
    officePhoneExt,
    hireDate,
    terminationDate,
    companies,
    locationLevelId,
    onePOS,
  } = modifiedData;

  const prevSendToOmni = previousData?.sendToOmni || false;

  let previoursCompanyIds = previousData?.companies
    ?.map((x) => (!x?.isPrimary ? x.mdmCompanyId : null))
    .filter(Boolean)
    .sort((a, b) => a - b);
  let updatedCompanyIds = companies?.sort((a, b) => a - b); // adding primary company to the list of companies

  const isCompanyChanged = (a, b) => {
    let result = true; // Initialize to true, assuming arrays will match

    if (a.length !== b.length) {
      result = false; // If arrays have different lengths, they do not match
    } else {
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          result = false; // If values at corresponding indices are not equal, arrays do not match
          break; // Exit the loop early, as no need to continue checking
        }
      }
    }
    return result;
  };

  const attributes = {
    preferredFirstName: preferredFirstName || null,
    phone:
      officePhone && previousData?.officePhone !== officePhone
        ? officePhone
        : null,
    phoneExt:
      previousData?.officePhoneExt !== officePhoneExt
        ? officePhoneExt || ""
        : null,
    hireDate:
      hireDate && previousData?.hireDate !== hireDate
        ? moment(hireDate)?.format(dateFormat)
        : null,
    terminationDate:
      terminationDate && previousData?.terminationDate !== terminationDate
        ? moment(terminationDate)?.format(dateFormat)
        : null,
    mdmCompanyId:
      companyId && previousData.companyId?.toString() !== companyId.toString()
        ? companyId.toString()
        : previousData.companyId?.toString(), //mandaoary even if no change
    mdmCompanyIds: !isCompanyChanged(previoursCompanyIds, updatedCompanyIds)
      ? [...new Set([...updatedCompanyIds, companyId])]
      : [...new Set([...updatedCompanyIds, companyId])],
    legalFirstName: legalFirstName || null,
    legalLastName: legalLastName || null,
    pronounsId: gender || null,
    mdmLocationLevelId: locationLevelId || null,
    positionId: positionId ? positionId : null,
    reportsTo:
      supervisorMDMWorkerId &&
      previousData.supervisorMDMWorkerId?.toString() !==
        supervisorMDMWorkerId.toString()
        ? supervisorMDMWorkerId.toString()
        : null, //
    mdmWorkerApplicationProvisioningRoleId:
      appProvisioningRoleId &&
      previousData.appProvisioningRoleId?.toString() !==
        appProvisioningRoleId.toString()
        ? appProvisioningRoleId.toString()
        : null,
    jobCodeId:
      jobCodeId && previousData.jobCodeId?.toString() !== jobCodeId.toString()
        ? jobCodeId.toString()
        : null,
    programCodeId:
      programCodeId &&
      previousData.programCodeId?.toString() !== programCodeId.toString()
        ? programCodeId.toString()
        : null,
    rqOrganizationRoleId:
      organizationRoleId &&
      previousData.organizationRoleId?.toString() !==
        organizationRoleId?.toString()
        ? organizationRoleId.toString()
        : previousData.organizationRoleId?.toString(), //mandaoary even if no change
    visionRoleId:
      visionRole?.length && employeeRoles?.toString() !== visionRole?.toString()
        ? visionRole
        : null,
    sendToOmni: sendToOmni !== prevSendToOmni ? sendToOmni : null,
    onePOS:
      onePOS?.toString() !== previousData?.onePOS?.toString() ? onePOS : null,
  };

  if (Object.values(attributes).every((x) => x === null)) {
    // all attributes are null then show message "update form correctly"
    return UPDATE_CORRECTLY;
  }
  const payload = {
    attributes,
    isProcessed: true,
    mdmEmployeeId: previousData?.mdmWorkerId,
    effectiveDate: moment.utc(effectiveDate).format("YYYY-MM-DD HH:mm:ss Z"),
    createdBy: loginUser.data.mdmEmployeeId,
    updatedBy: loginUser.data.mdmEmployeeId,
  };

  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  try {
    return postApi(
      `${VITE_REACT_URL_API_PMC}/UpsertEmployeeEvent`,
      { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
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
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;
  try {
    return await getApi(
      `${VITE_REACT_URL_API_PMC}/GetEmployeeEvents/${id}`,
      {
        "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
      },
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
