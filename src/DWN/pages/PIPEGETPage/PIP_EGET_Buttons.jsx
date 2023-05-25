import { AcknowledgementBlock, Buttons } from "../../components";
import {
  handleCreatePIPEGETForm,
  handleUpdatePIPEGETForm,
  handelApprove,
  handleDeny,
} from "./PIP_EGET_Helper";
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

const PIP_EGET_Buttons = ({
  id = "add",
  data,
  employeeDetails,
  pipegetState,
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
  const denyStatusId = 14;
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
        ...pipegetState.form,
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

  const handleAcknowledgement = async () => {
    const response = await updateStatus(
      data?.activityId,
      accounts,
      instance,
      impersonation,
      impersonEmail,
      acknowledgeStatusId
    );
    handleResponse(ACKNOWLEDGED, response);
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
                  pipegetState?.form?.data,
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
                  pipegetState?.form?.data,
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
        } else if (
          uplineManager ||
          pipegetState?.form?.data?.createdBy?.toString() === mdmWId
        ) {
          buttons = [
            {
              name: "Update",
              variant: "btn btn-success",
              handleClick: async () => {
                const response = await handleUpdatePIPEGETForm(
                  pipegetState?.form?.data,
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
          const response = await handleCreatePIPEGETForm(
            pipegetState?.form?.data,
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
    <div>
      {data?.activityStatusId === 15 &&
      data?.mdmEmployeeId?.toString() === mdmWId ? (
        <AcknowledgementBlock
          employeeDetails={employeeDetails}
          handleAcknowledgement={handleAcknowledgement}
        />
      ) : (
        <div
          className={`${
            pipegetState?.form?.errors?.length > 0 ||
            (!pipegetState?.hasFormChanges && id === "add" && !approveManager)
              ? "btn-fcad-disabled d-flex flex-row-reverse"
              : data?.activityStatusId === 15
              ? "d-flex flex-row"
              : "d-flex flex-row-reverse"
          }`}
        >
          <Buttons buttons={buttons} />
        </div>
      )}
    </div>
  );
};

export default PIP_EGET_Buttons;
