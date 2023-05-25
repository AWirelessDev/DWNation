import { Buttons } from "../../components";
import {
  handleCreateFCADForm,
  handleUpdateFCADForm,
  handelApprove,
  handleDeny,
} from "./FCADHelper";
import {
  SAVED,
  APPROVED,
  DENIED,
  ACKNOWLEDGED,
  MADEVISIBLE,
} from "../Constants";
import { useMsal } from "@azure/msal-react";
import { useContext } from "react";
import { RoleContext } from "../../provider";
import { customMessage, updateStatus } from "../CommonHelper";
import {
  isLoginUserAdmin,
  isThisUserHR,
  isThisUserHRProcss,
} from "../../helpers";

const FCADButtons = ({
  id = "add",
  data,
  employeeDetails,
  fcadState,
  setShow,
  setErrShow,
  setAction,
  uplineManager,
  approveManager,
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
  const makeVisibleStatusId = 15;
  const acknowledgeStatusId = 16;
  const mdmWId = loginUserDetails?.data?.mdmWorkerId?.toString();
  const isLoginUserAdminAccess = isLoginUserAdmin();
  const isLoginUserHRAccess = isThisUserHR();
  const isLoginUserHRProccessAccess = isThisUserHRProcss();
  const dispatchFetching = (value) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: {
        ...fcadState.form,
        data: data,
        errors: [],
        isFetching: value,
      },
      hasFormChanges: true,
    });
  };

  const handleActions = (action, success, failure, errorMessage = null) => {
    dispatchFetching(false);
    setAction(action);
    setShow(success);
    setErrShow(failure);
    if (errorMessage) {
      if (errorMessage.message === "Invalid MDMEmployeeId!") {
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
    } else if (response) {
      handleActions(action, true, false);
    } else {
      handleActions(action, false, true);
    }
  };
  let buttons = [];
  if (id !== "add") {
    switch (data?.activityStatusId) {
      case 6:
        if (approveManager) {
          buttons = [
            {
              name: "Approve",
              variant: "btn btn-success",
              className: "btn-approve",
              handleClick: async () => {
                dispatchFetching(true);
                const response = await handelApprove(
                  fcadState?.form?.data,
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
                  fcadState?.form?.data,
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
        } else if (uplineManager || data?.createdBy?.toString() === mdmWId) {
          // upline manager and created also can update
          buttons = [
            {
              name: "Update",
              variant: "btn btn-success",
              handleClick: async () => {
                const response = await handleUpdateFCADForm(
                  fcadState?.form?.data,
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
      case 3:
        if (
          data?.createdBy?.toString() === mdmWId ||
          isLoginUserAdminAccess ||
          isLoginUserHRAccess ||
          isLoginUserHRProccessAccess
        ) {
          buttons = [
            {
              name: "Make Visible to Employee",
              variant: "btn btn-success",
              handleClick: async () => {
                const response = await updateStatus(
                  data?.activityId,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail,
                  makeVisibleStatusId
                );
                handleResponse(MADEVISIBLE, response);
              },
            },
          ];
        }
        break;
      case 15:
        if (data?.mdmEmployeeId?.toString() === mdmWId)
          buttons = [
            {
              name: "Acknowledge",
              variant: "btn btn-primary",
              className: "btn-ack",
              handleClick: async () => {
                const response = await updateStatus(
                  data?.activityId,
                  accounts,
                  instance,
                  impersonation,
                  impersonEmail,
                  acknowledgeStatusId
                );
                handleResponse(ACKNOWLEDGED, response);
              },
            },
          ];
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
          const response = await handleCreateFCADForm(
            fcadState?.form?.data,
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
        fcadState?.form?.errors?.length > 0 ||
        (!fcadState?.hasFormChanges && id === "add")
          ? "btn-fcad-disabled d-flex flex-row-reverse"
          : data?.activityStatusId === 15
          ? "d-flex flex-row"
          : "d-flex flex-row-reverse"
      }`}
    >
      <Buttons buttons={buttons} />
    </div>
  );
};

export default FCADButtons;
