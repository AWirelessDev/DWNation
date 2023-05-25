import { postApi } from "../../../helpers";
const { VITE_EVENTS_FUNCTION_KEY_PMC, VITE_REACT_URL_API_MDM } = import.meta
  .env;

export const handleCreateContractorForm = async (
  Data,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  let companies = [];
  if (Data?.companies) {
    if (!Data?.companies.includes(Data?.mdmCompanyId)) {
      companies = [...Data?.companies, Data?.mdmCompanyId];
    } else {
      companies = Data?.companies;
    }
  } else {
    companies = [Data?.mdmCompanyId];
  }

  const payload = {
    workerData: {
      mdmWorkerTypeId: Data?.classificationId.toString() || null,
      mdmWorkerTitleId: Data?.titleId.toString() || null,
      mdmWorkerJobCodeId: Data?.jobCode || null,
      mdmWorkerProgramCodeId: Data?.programCode || null,
      legalFirstName: Data?.legalFirstName || null,
      legalLastName: Data?.legalLastName || null,
      preferredFirstName: Data?.preferredFirstName || null,
      phone: Data?.officePhone || null,
      mdmWorkerPronounId: Data?.pronounId || null,
      supervisorMDMWorkerId: Data?.supervisorMDMWorkerId || 0,
      mdmWorkerApplicationProvisioningRoleId: Data?.appProvisionRole || null,
      sendToOmni: Data?.sendToOmni || false,
      phoneExt: Data?.officePhoneExt || null,
      hireDate: Data?.rehireDate || null,
      mdmCompanyIds: companies?.length ? companies.toString() : null,
      primaryMDMCompanyId: Data?.mdmCompanyId.toString() || 0,
      mdmOrganizationRoleId: Data?.mdmOrganizationRoleId?.toString() || 0,
      OnePOS: Data?.onePosCode || null,
    },
    locationData: {
      mdmLocationLevelId: Data?.MDMLocationId || 0,
    },
  };

  try {
    const response = await postApi(
      `${VITE_REACT_URL_API_MDM}/CreateMdmWorker`,
      {
        "x-functions-key": `${VITE_EVENTS_FUNCTION_KEY_PMC}`,
      },
      payload,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );

    return response;
  } catch (e) {
    return null;
  }
};
