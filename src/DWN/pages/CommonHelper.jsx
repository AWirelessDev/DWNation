import { putApi } from "../../helpers";
import { APPROVER_NOT_EXITS_MESSAGE, SUPERVISOR_NOT_EXITS_MESSAGE } from "./Constants";

const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
  .env;

export const effectiveDateFormat = "yyyy-MM-DD";

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
      if (response) {
        return "Success";
      } else {
        return null;
      }
    } catch (e) {
      console.log(e.message);
      return null;
    }
  };
  
  export const customMessage = (value) => {
    if(value.indexOf(`Supervisor doesn't exist`) > -1) {
      return SUPERVISOR_NOT_EXITS_MESSAGE;
    } else if(value.indexOf(`Approver doesn't exist`) > -1) {
      return APPROVER_NOT_EXITS_MESSAGE;
    }
    return null;
  }