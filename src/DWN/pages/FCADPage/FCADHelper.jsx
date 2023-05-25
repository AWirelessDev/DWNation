import { postApi, putApi } from "../../../helpers";
import { updateStatus, effectiveDateFormat } from "../CommonHelper";
import moment from "moment";

const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const handleCreateFCADForm = async (
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
      activityTypeId: 5,
      activityDatetime: moment(data?.infractionDate)?.format(
        effectiveDateFormat
      ),
      createdBy: mdmWId,
      updatedBy: mdmWId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityStatusId: 1,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      activityReasonTypeId: data?.activityReasonTypeId,
      userSigned: true,
      activityQuarter: 1,
      incidentDescription: data?.incidentDescription,
      infractionCount: data?.infractionCount,
      infractionDate: moment(data?.infractionDate)?.format(effectiveDateFormat),
      excessiveInfractionFlag: data?.excessiveInfractionFlag || false,
      noticeProvidedFlag: data?.noticeProvidedFlag || false,
      infractionStartTime: data?.infractionStartTime || "",
      infractionEndTime: data?.infractionEndTime || "",
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

export const handleUpdateFCADForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const reqBody = {
    activity: {
      activityId: data?.activityId,
      activityTypeId: 5,
      activityDatetime: moment(data?.infractionDate)?.format(
        effectiveDateFormat
      ),
      createdBy: data?.createdBy,
      updatedBy: loginUserDetails.data.mdmWorkerId,
      userCanView: data?.userCanView || false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityStatusId: data.activityStatusId,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      activityReasonTypeId: data?.activityReasonTypeId,
      userSigned: true,
      activityQuarter: 1,
      incidentDescription: data?.incidentDescription,
      infractionCount: data?.infractionCount,
      infractionDate: moment(data?.infractionDate)?.format(effectiveDateFormat),
      excessiveInfractionFlag: data?.excessiveInfractionFlag || false,
      noticeProvidedFlag: data?.noticeProvidedFlag || false,
      infractionStartTime: data?.infractionStartTime || "",
      infractionEndTime: data?.infractionEndTime || "",
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
      return null;
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
    await handleUpdateFCADForm(
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
      9
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
    await handleUpdateFCADForm(
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
      14
    );
    return "success";
  } catch (e) {
    console.log(e.message);
    return null;
  }
};
