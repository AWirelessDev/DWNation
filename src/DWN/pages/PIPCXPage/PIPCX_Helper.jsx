import { postApi, putApi } from "../../../helpers";
import { updateStatus, effectiveDateFormat } from "../CommonHelper";
import moment from "moment";

const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const handleCreatePIPCXForm = async (
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
      activityTypeId: 8, // here the Activity Type Id
      activityStatusId: 6,
      activityNoticeTypeId: 14, // here the Activity Notice Type Id
      createdBy: mdmWId,
      updatedBy: mdmWId,
      userCanView: false,
      excessiveInfractionFlag: true,
      userSigned: true,
      active: true,
      noticeProvidedFlag: true,
      activityReasonTypeId: null,
      revaluationDate: "2022-11-23T08:40:30.118Z",
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityDatetime: moment(data?.effectiveDatetime).format(
        effectiveDateFormat
      ),
      incidentDescription: data?.incidentDescription,
      infractionCount: data?.infractionCount,
      infractionDate: data?.infractionDate,
      activityQuarter: data?.activityQuarter,
      supervisor: employeeDetails?.reportsTo,
      title: employeeDetails?.title,
      channel: employeeDetails?.area,
      region: employeeDetails?.region,
      district: employeeDetails?.district,
      store: employeeDetails?.location,
    },
    notes: [
      {
        notes: data?.activityNotes1,
        noteTypeId: 1,
      },
      {
        notes: data?.activityNotes2,
        noteTypeId: 2,
      },
      {
        notes: data?.activityNotes3,
        noteTypeId: 3,
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

export const handleUpdatePIPCXForm = async (
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
        notes:
          typeof data?.activityNotes === "object"
            ? data.activityNotes[0]?.["notes"]
            : data?.activityNotes1,
        noteTypeId: 1,
      },
      {
        notes:
          typeof data?.activityNotes === "object"
            ? data.activityNotes[1]?.["notes"]
            : data?.activityNotes2,
        noteTypeId: 2,
      },
      {
        notes:
          typeof data?.activityNotes === "object"
            ? data.activityNotes[2]?.["notes"]
            : data?.activityNotes3,
        noteTypeId: 3,
      },
    ],
    activity: {
      activityId: data?.activityId,
      activityTypeId: data?.activityTypeId, // here the Activity Type Id
      activityDatetime: moment(data?.effectiveDatetime).format(
        effectiveDateFormat
      ),
      createdBy: data?.createdBy,
      updatedBy: loginUserDetails.data.mdmWorkerId,
      userCanView: data?.userCanView || false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      activityStatusId: data.activityStatusId,
      activityNoticeTypeId: data?.activityNoticeTypeId || 14,
      activityReasonTypeId: null,
      userSigned: true,
      activityQuarter: data?.activityQuarter,
      excessiveInfractionFlag: true,
      incidentDescription: data?.incidentDescription,
      infractionCount: data?.infractionCount,
      infractionDate: moment.utc(data?.infractionDate).format(),
      noticeProvidedFlag: true,
      revaluationDate: "2022-11-23T08:40:30.118Z",
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
    await handleUpdatePIPCXForm(
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
    await handleUpdatePIPCXForm(
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
