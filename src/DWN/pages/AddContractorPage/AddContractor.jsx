import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components";
import { Card } from "../../components/Card/Card";
import {
  isLoginUserAdmin,
  isThisUserHR,
  isThisUserHRProcss,
} from "../../helpers";
import { RoleContext } from "../../provider";
import "./AddContractor.scss";
import { ContractorPageContent } from "./ContractorPageContent";

export const AddContractor = () => {
  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------
  const navigate = useNavigate();
  const isLoginUserAdminAccess = isLoginUserAdmin();
  const isThisUserHRAccess = isThisUserHR();
  const isThisUserHRProcssAccess = isThisUserHRProcss();

  useEffect(() => {
    if (
      !(
        isLoginUserAdminAccess ||
        isThisUserHRAccess ||
        isThisUserHRProcssAccess
      )
    ) {
      navigate("/error/401");
    }
  }, [isLoginUserAdminAccess, isThisUserHRAccess, isThisUserHRProcssAccess]);
  return (
    <div className="form-container">
      <br />
      <Breadcrumb />
      <br />
      <Card title={"Add Contractor"}>
        <div className="px-sm-3">
          <ContractorPageContent
            impersonation={impersonation}
            impersonEmail={impersonEmail}
            loginUserDetails={RoleCtx}
          />
        </div>
      </Card>
    </div>
  );
};
