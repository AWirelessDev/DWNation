import React, { useContext } from "react";
import ToggleSwitchAC from "../../../components/ToggleSwitch/ToggleSwitchAC";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { LookupsContext } from "../../../provider";
import DropDown from "./DropDown/DropDown";
import InputField from "./InputField/InputField";

export const OmniAccess = ({
  sendToOmni = false,
  cimWorkerId,
  programCodeId,
  jobCodeId,
  nativeId,
  ssoid,
  appProvisioningRoleId,
  pendingChanges = [],
  Editable = true,
  onInputChange,
  errors,
  hasViewPermission = false,
  hasEditPermission = false,
  hasManagerPermission = false,
}) => {
  const locate = useLocation();
  const { id = "" } = queryString.parse(locate.search);
  const { jobCodes, programCodes, lookups } = useContext(LookupsContext);

  const handleToggleChange = async (isChecked) => {
    onInputChange({
      target: {
        name: "sendToOmni",
        value: isChecked,
      },
    });
  };

  return (
    <>
      <hr className="separator mt-0 mx-auto hrline " />
      <div
        className={`toggle ${
          pendingChanges?.includes("sendToOmni") ? "pending-changes" : ""
        }`}
      >
        <label className="mt-2 ">Omni Access :</label>&nbsp;
        <ToggleSwitchAC
          id="sendToOmni"
          name="sendToOmni"
          checked={sendToOmni || false}
          onChange={handleToggleChange}
          disabled={Editable || !(hasEditPermission || hasManagerPermission)}
        />
        {pendingChanges?.includes("sendToOmni") && (
          <div className="highlight-pending-change">Pending change</div>
        )}
      </div>
      <div className="m-2">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {sendToOmni && (
            <div className="col">
              <div className="form-group">
                <DropDown
                  id="mdmWorkerApplicationProvisioningRoleId"
                  label="App Provisioning Role"
                  placeholder={
                    hasViewPermission ? "Select the App Provisioning Role" : "-"
                  }
                  name="appProvisioningRoleId"
                  value={
                    hasViewPermission && appProvisioningRoleId
                      ? appProvisioningRoleId
                      : "-"
                  }
                  onInputChange={onInputChange}
                  disabled={Editable}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                  editable={Editable}
                  isDisabled={!hasEditPermission}
                  pendingChanges={pendingChanges}
                  options={
                    lookups?.appProvisioningRoles?.length
                      ? lookups?.appProvisioningRoles
                      : []
                  }
                />
                <InputField
                  id="cimWorkerId"
                  label="CIM Worker ID"
                  placeholder={"Enter the CIM Worker Id"}
                  name="cimWorkerId"
                  value={cimWorkerId ? cimWorkerId : "-"}
                  onChange={onInputChange}
                  disabled
                />
              </div>
            </div>
          )}
          {sendToOmni && (
            <div className="col">
              <div className="form-group">
                <DropDown
                  id="programCodeId"
                  label="Program Code"
                  value={hasViewPermission ? programCodeId?.toString() : "-"}
                  onInputChange={onInputChange}
                  editable={Editable}
                  placeholder={
                    hasViewPermission ? "Select the Program Code" : "-"
                  }
                  name="programCodeId"
                  pendingChanges={pendingChanges}
                  options={programCodes || []}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                  isDisabled={!hasEditPermission}
                />
                <InputField
                  id="ssoid"
                  label="SSO ID"
                  placeholder="Enter the SSO ID"
                  name="ssoid"
                  value={ssoid}
                  onChange={onInputChange}
                  disabled
                />
              </div>
            </div>
          )}
          {sendToOmni && (
            <div className="col">
              <div className="form-group">
                <DropDown
                  id="jobCodeId"
                  label="Job Code"
                  value={hasViewPermission ? jobCodeId?.toString() : "-"}
                  onInputChange={onInputChange}
                  editable={Editable}
                  placeholder={hasViewPermission ? "Select the Job Code" : "-"}
                  name="jobCodeId"
                  pendingChanges={pendingChanges}
                  options={jobCodes || []}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                  isDisabled={!hasEditPermission}
                />
                <InputField
                  id="nativeId"
                  label="Native ID"
                  placeholder="Enter the Native ID"
                  name="nativeId"
                  value={nativeId ? nativeId : ""}
                  onChange={onInputChange}
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
