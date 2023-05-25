import { Buttons } from "../../components";
import {
  SAVED,
  ACKNOWLEDGED,
  APPROVED,
  DENIED,
  MADEVISIBLE,
  handleCreateMovDemForm,
  handleUpdateMovDemForm,
  handelApprove,
  updateStatus,
  handleDeny,
} from "./MoveDemotionHelper";
import { useMsal } from "@azure/msal-react";
import { useContext } from "react";
import { RoleContext } from "../../provider";
import { isThisUserHR, isThisUserHRProcss } from "../../helpers";
import { customMessage } from "../CommonHelper";

const MovDemButtons = ({
  id = "add",
  data,
  employeeDetails,
  movdemState,
  setShow,
  setErrShow,
  setAction,
  dispatch,
  setErrorMessage = null,
  setErrorStatus = null,
}) => {
  const { accounts, instance } = useMsal();
  const loginUserDetails = useContext(RoleContext);
  //----------BEGIN Impersonation-------------------------
  const impersonation = loginUserDetails.impersonation || false;
  const impersonEmail = loginUserDetails.impersonEmail || false;
  //----------END Impersonation-------------------------
  const hasApprovalPermisssion = isThisUserHR();
  const hasUpdatePermission = isThisUserHRProcss();
  const mdmWId = loginUserDetails?.data?.mdmWorkerId?.toString();

  const dispatchFetching = (value) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: {
        ...movdemState.form,
        data: data,
        errors: [],
        isFetching: value,
      },
      hasFormChanges: true,
    });
  };

  const handleActions = (action, success, failure, errorMessage = null) => {
    setAction(action);
    setShow(success);
    setErrShow(failure);
    setErrorMessage(errorMessage);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    dispatchFetching(false);
    if (errorMessage) {
      if (
        errorMessage.message === "Invalid MDMEmployeeId!" ||
        errorMessage.message === "MDMWorkerId does not exist!"
      ) {
        setErrorMessage(`${employeeDetails.preferredFirstName} ${employeeDetails.legalLastName} does not
        yet exist within PMC, please try again in 15 minutes.`);
      } else {
        const message = customMessage(errorMessage.message);
        setErrorMessage(message);
      }
      setErrorStatus(errorMessage.status);
    } else {
      setErrorMessage(null);
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const handleResponse = (action, response) => {
    if (response.isValid === false && response.message) {
      handleActions(action, false, true, response);
    } else if (response.message === "MDMWorkerId does not exist!") {
      handleActions(action, false, true, response);
    } else if (response) {
      handleActions(action, true, false);
    } else {
      handleActions(action, false, true);
    }
  };

  let buttons = [];
  if (id !== "add") {
    switch (data?.activityStatusId) {
      case 5:
        if (hasApprovalPermisssion) {
          buttons = [
            {
              name: "Approve",
              variant: "btn btn-success",
              className: "btn-approve",
              handleClick: async () => {
                dispatchFetching(true);
                const response = await handelApprove(
                  movdemState?.form?.data,
                  employeeDetails,
                  loginUserDetails,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail
                );
                handleResponse(APPROVED, response);
              },
            },
            {
              name: "Deny",
              variant: "btn btn-danger",
              className: "btn-deny",
              handleClick: async () => {
                dispatchFetching(true);
                const response = await handleDeny(
                  movdemState?.form?.data,
                  employeeDetails,
                  loginUserDetails,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail
                );
                handleResponse(DENIED, response);
              },
            },
          ];
          if (hasUpdatePermission) {
            buttons.push({
              name: "Update",
              variant: "btn btn-success",
              className: "btn-approve",
              handleClick: async () => {
                const response = await handleUpdateMovDemForm(
                  movdemState?.form?.data,
                  employeeDetails,
                  loginUserDetails,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail
                );
                handleResponse(SAVED, response);
              },
            });
          }
        } else if (
          data?.createdBy?.toString() === mdmWId ||
          hasUpdatePermission
        ) {
          buttons = [
            {
              name: "Update",
              variant: "btn btn-success",
              handleClick: async () => {
                const response = await handleUpdateMovDemForm(
                  movdemState?.form?.data,
                  employeeDetails,
                  loginUserDetails,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail
                );
                handleResponse(SAVED, response);
              },
            },
          ];
        }
        break;
      default:
        buttons = [];
        break;
    }
  } else if (id === "add") {
    buttons = [
      {
        name: "Save",
        variant: "btn btn-success",
        handleClick: async () => {
          const response = await handleCreateMovDemForm(
            movdemState?.form?.data,
            employeeDetails,
            loginUserDetails,
            accounts,
            instance,
            impersonation,
            impersonEmail
          );
          handleResponse(SAVED, response);
        },
      },
    ];
  }

  return (
    <div
      className={`${
        movdemState?.form?.errors?.length > 0 ||
        (!movdemState?.hasFormChanges && id === "add")
          ? "btn-fcad-disabled d-flex flex-row-reverse"
          : "d-flex flex-row-reverse"
      }`}
    >
      <Buttons buttons={buttons} />
    </div>
  );
};

export default MovDemButtons;
