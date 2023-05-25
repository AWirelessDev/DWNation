import { postApi, putApi } from "../../../helpers";
import { effectiveDateFormat } from "../CommonHelper";

import moment from "moment";

const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const SAVED = "Saved";
export const ACKNOWLEDGED = "Acknowledged";
export const APPROVED = "Approved";
export const DENIED = "Denied";
export const MADEVISIBLE = "Made Visible";

export const denyStatusId = 13;
export const approveStatusId = 8;

export const handleCreateMovDemForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const mdmWId = loginUserDetails?.data?.mdmWorkerId;
  const payload = {
    activity: {
      activityId: null,
      activityTypeId: 2,
      createdBy: mdmWId,
      updatedBy: mdmWId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      newLocationLevelId: data?.newLocationLevelId,
      newLocationLevelTypeId: data?.newLocationLevelTypeId,
      newTitleId: data?.newTitleId,
      activityStatusId: 4,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      userSigned: true,
      activityQuarter: 1,
      excessiveInfractionFlag: true,
      employmentTypeId: data?.employmentTypeId,
      noticeProvidedFlag: true,
      activityDatetime: moment(data?.effectiveDatetime)?.format(
        effectiveDateFormat
      ),
      supervisor: employeeDetails?.reportsTo,
      title: employeeDetails?.title,
      channel: employeeDetails?.area,
      region: employeeDetails?.region,
      district: employeeDetails?.district,
      store: employeeDetails?.location,
    },
    notes: [
      {
        notes: data?.activityNotes,
        noteTypeId: 1,
      },
    ],
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

export const handleUpdateMovDemForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const mdmWId = loginUserDetails?.data?.mdmWorkerId;
  const reqBody = {
    activity: {
      activityId: data?.activityId,
      activityTypeId: 2,
      createdBy: data?.createdBy,
      updatedBy: mdmWId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      newLocationLevelId: data?.newLocationLevelId,
      newLocationLevelTypeId: data?.newLocationLevelTypeId,
      newTitleId: data?.newTitleId,
      activityStatusId: data?.activityStatusId,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      userSigned: true,
      activityQuarter: 1,
      excessiveInfractionFlag: true,
      employmentTypeId: data?.employmentTypeId,
      noticeProvidedFlag: true,
      activityDatetime: moment(data?.effectiveDatetime)?.format(
        effectiveDateFormat
      ),
    },
    notes: [
      {
        notes:
          typeof data?.activityNotes === "object"
            ? data.activityNotes[0]?.["notes"]
            : data?.activityNotes,
        noteTypeId: 1,
      },
    ],
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
      return null;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const updateStatus = async (
  activityId,
  accounts,
  instance,
  impersonation,
  impersonEmail,
  statusId
) => {
  try {
    const response = await putApi(
      `${VITE_REACT_URL_API_PMC}/UpdateActivityStatus/${activityId}/${statusId}`,
      {
        "x-functions-key": `${VITE_EVENTS_FUNCTION_KEY_PMC}`,
      },
      null,
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
export const handelApprove = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  try {
    await handleUpdateMovDemForm(
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
    await handleUpdateMovDemForm(
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
