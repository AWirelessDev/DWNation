import { postApi, putApi } from "../../../helpers";
import { updateStatus, effectiveDateFormat } from "../CommonHelper";

import moment from "moment";
const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const denyStatusId = 12;
export const approveStatusId = 7;

export const handleCreateTerminationForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const payload = {
    notes: [
      {
        notes: data?.activityNotes,
        noteTypeId: 1,
      },
    ],
    documents: data?.activityDocuments || [],
    activity: {
      activityId: null,
      activityTypeId: 4,
      activityDatetime: moment(data?.effectiveDatetime)?.format(
        effectiveDateFormat
      ),
      createdBy: loginUserDetails.data.mdmWorkerId,
      updatedBy: loginUserDetails.data.mdmWorkerId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityStatusId: 4,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      activityReasonTypeId: data?.activityReasonTypeId,
      employmentTypeId: data?.employmentTypeId,
      supervisor: employeeDetails?.reportsTo,
      title: employeeDetails?.title,
      channel: employeeDetails?.area,
      region: employeeDetails?.region,
      district: employeeDetails?.district,
      store: employeeDetails?.location,
    },
  };

  try {
    const response = await postApi(
      `${VITE_REACT_URL_API_PMC}/UpsertActivity`,
      {
        "x-functions-key": `${VITE_EVENTS_FUNCTION_KEY_PMC}`,
      },
      payload,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (response?.activityId) {
      return "Success";
    } else {
      return response;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const handleUpdateTerminationForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const reqBody = {
    notes: [
      {
        notes: data?.activityNotes,
        noteTypeId: 1,
      },
    ],
    documents: data?.activityDocuments || [],
    activity: {
      activityId: data?.activityId,
      activityTypeId: 4,
      activityDatetime: moment(data?.effectiveDatetime)?.format(
        effectiveDateFormat
      ),
      createdBy: loginUserDetails.data.mdmWorkerId,
      updatedBy: loginUserDetails.data.mdmWorkerId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityStatusId: data.activityStatusId,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      activityReasonTypeId: data?.activityReasonTypeId,
    },
  };

  try {
    const response = await putApi(
      `${VITE_REACT_URL_API_PMC}/UpsertActivity`,
      {
        "x-functions-key": `${VITE_EVENTS_FUNCTION_KEY_PMC}`,
      },
      reqBody,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (response.activityId) {
      return "Success";
    } else {
      return response;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const handleApprove = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  try {
    await handleUpdateTerminationForm(
      data,
      employeeDetails,
      loginUserDetails,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );

    await updateStatus(
      data.activityId,
      accounts,
      instance,
      impersonation,
      impersonEmail,
      approveStatusId
    );
    return "success";
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const handleDeny = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  try {
    await handleUpdateTerminationForm(
      data,
      employeeDetails,
      loginUserDetails,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );

    await updateStatus(
      data.activityId,
      accounts,
      instance,
      impersonation,
      impersonEmail,
      denyStatusId
    );
    return "success";
  } catch (e) {
    console.log(e.message);
    return null;
  }
};
