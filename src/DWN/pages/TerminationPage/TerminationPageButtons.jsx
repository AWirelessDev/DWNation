import { Buttons } from "../../components";
import {
  handleCreateTerminationForm,
  handleUpdateTerminationForm,
  handleApprove,
  handleDeny,
} from "./TerminationHelper";
import { SAVED, APPROVED, DENIED } from "../Constants";
import { useMsal } from "@azure/msal-react";
import { useContext } from "react";
import { RoleContext } from "../../provider";
import { isThisUserHR, isThisUserHRProcss } from "../../helpers";
import { customMessage } from "../CommonHelper";

const TerminationPageButtons = ({
  id = "add",
  data,
  employeeDetails,
  terminationState,
  setShow,
  setErrShow,
  setAction,
  dispatch,
  setErrorMessage = null,
  setErrorStatus = null,
}) => {
  const { accounts, instance } = useMsal();
  const loginUserDetails = useContext(RoleContext);
  const hasApprovalPermisssion = isThisUserHRProcss();
  const hasUpdatePermission = isThisUserHR();
  //----------BEGIN Impersonation---------------------
  const impersonation = loginUserDetails.impersonation || false;
  const impersonEmail = loginUserDetails.impersonEmail || false;
  //----------END Impersonation-------------------------

  const dispatchFetching = (value) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: {
        ...terminationState.form,
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
    if (
      (response.isValid === false && response.message) ||
      response.message === "MDMWorkerId does not exist!"
    ) {
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
      case 4:
        if (hasApprovalPermisssion) {
          buttons = [
            {
              name: "Approve",
              variant: "btn btn-success",
              className: "btn-approve",
              handleClick: async () => {
                dispatchFetching(true);
                const response = await handleApprove(
                  terminationState?.form?.data,
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
                  terminationState?.form?.data,
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
                const response = await handleUpdateTerminationForm(
                  terminationState?.form?.data,
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
          data?.createdBy === loginUserDetails.data.mdmWorkerId ||
          hasUpdatePermission
        ) {
          buttons = [
            {
              name: "Update",
              variant: "btn btn-success",
              handleClick: async () => {
                const response = await handleUpdateTerminationForm(
                  terminationState?.form?.data,
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
          const response = await handleCreateTerminationForm(
            terminationState?.form?.data,
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
        terminationState?.form?.errors?.length > 0 ||
        (!terminationState?.hasFormChanges && id === "add")
          ? "btn-fcad-disabled d-flex flex-row-reverse"
          : "d-flex flex-row-reverse"
      }`}
    >
      <Buttons buttons={buttons} />
    </div>
  );
};

export default TerminationPageButtons;
