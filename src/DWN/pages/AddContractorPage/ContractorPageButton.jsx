import { useMsal } from "@azure/msal-react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buttons } from "../../components";
import {
  isLoginUserAdmin,
  isThisUserHR,
  isThisUserHRProcss,
} from "../../helpers";
import { ActionContext, RoleContext } from "../../provider";
import { SAVED } from "../Constants";
import { handleCreateContractorForm } from "./ContractorPageHelper";

export const ContractorPageButtons = ({
  contractorState,
  setShow,
  setErrShow,
  setAction,
  errors,
  setErrorMessage = null,
  setErrorStatus = null,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionContext = useContext(ActionContext);
  const { tabState, tabDispatch } = actionContext;
  const { accounts, instance } = useMsal();
  const isLoginUserAdminAccess = isLoginUserAdmin();
  const isThisUserHRAccess = isThisUserHR();
  const isThisUserHRProcssAccess = isThisUserHRProcss();
  const loginUserDetails = useContext(RoleContext);
  //----------BEGIN Impersonation---------------------
  const impersonation = loginUserDetails.impersonation || false;
  const impersonEmail = loginUserDetails.impersonEmail || false;
  //----------END Impersonation-------------------------

  const onCreateContractor = async () => {
    if (
      isLoginUserAdminAccess ||
      isThisUserHRAccess ||
      isThisUserHRProcssAccess
    ) {
      if (errors.length > 0) {
        handleResponse("Required Field mandatory", false);
        return;
      } else {
        setIsSubmitting(true);
        const response = await handleCreateContractorForm(
          contractorState,
          loginUserDetails,
          accounts,
          instance,
          impersonation,
          impersonEmail
        );
        if (response.mdmWorkerId) {
          handleResponse(SAVED, true);
        } else {
          handleResponse("fail", response);
        }
      }
    } else {
      handleResponse("You are not authorized to access this page", false);
    }
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
  const handleActions = (action, success, failure, errorMessage = null) => {
    setAction(action);
    setShow(success);
    setErrShow(failure);
    setIsSubmitting(false);
    if (errorMessage) {
      setErrorMessage(errorMessage.message);
      setErrorStatus(errorMessage.status);
    } else {
      setErrorMessage(action);
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  const onBackHandler = () => {
    tabDispatch({ type: "CURRENT_TAB", tabIndex: 1 });
    navigate(`/dashboard`);
  };
  const save = [
    {
      name: "Save",
      variant: "btn btn-success",
      className: "ms-2 px-4",
      handleClick: async () => {
        onCreateContractor();
      },
    },
  ];
  const back = [
    {
      name: "Back",
      variant: "btn btn-danger",
      className: "ms-2 px-4 h-auto",
      handleClick: async () => {
        onBackHandler();
      },
    },
  ];
  return (
    <div className="py-3 mt-3 border-top d-flex justify-content-end">
      <div className="d-flex">
        <Buttons buttons={save} disabled={errors.length > 0 ? true : false} />
        <Buttons buttons={back} disabled={isSubmitting} />
      </div>
    </div>
  );
};
