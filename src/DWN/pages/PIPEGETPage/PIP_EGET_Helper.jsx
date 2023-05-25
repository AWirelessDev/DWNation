import { postApi, putApi } from "../../../helpers";
import { updateStatus, effectiveDateFormat } from "../CommonHelper";
import moment from "moment";

const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const handleCreatePIPEGETForm = async (
  data,
  employeeDetails,
  loginUserDetails,
  accounts,
  instance,
  impersonation,
  impersonEmail
) => {
  const mdmWId = loginUserDetails?.data?.mdmWorkerId?.toString();
  const payload = {
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
    documents: [],
    activity: {
      activityId: null,
      activityTypeId: 3, // here the Activity Type Id
      activityDatetime: moment(data?.effectiveDatetime).format(
        effectiveDateFormat
      ),
      createdBy: mdmWId,
      updatedBy: mdmWId,
      userCanView: false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      supervisorMDMWorkerId: employeeDetails?.supervisorMDMWorkerId.toString(),
      activityStatusId: 1,
      activityNoticeTypeId: data?.activityNoticeTypeId, // here the Activity Notice Type Id
      activityReasonTypeId: data?.activityReasonTypeId,
      userSigned: false,
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

export const handleUpdatePIPEGETForm = async (
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
    documents: [],
    activity: {
      activityId: data?.activityId,
      activityTypeId: data?.activityTypeId, // here the Activity Type Id
      activityDatetime: moment(data?.effectiveDatetime).format(
        effectiveDateFormat
      ),
      updatedBy: mdmWId,
      userCanView: data?.userCanView || false,
      active: true,
      mdmEmployeeId: employeeDetails?.mdmWorkerId?.toString(),
      supervisorMDMWorkerId: employeeDetails?.supervisorMDMWorkerId.toString(),
      activityStatusId: data.activityStatusId,
      activityNoticeTypeId: data?.activityNoticeTypeId,
      activityReasonTypeId: data?.activityReasonTypeId,
      userSigned: true,
      activityQuarter: 1,
      excessiveInfractionFlag: true,
      incidentDescription: data?.incidentDescription,
      infractionCount: data?.infractionCount,
      infractionDate: moment.utc(data?.infractionDate).format(),
      noticeProvidedFlag: true,
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
    await handleUpdatePIPEGETForm(
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
    await handleUpdatePIPEGETForm(
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
