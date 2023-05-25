import React, { useContext, useState, useEffect } from "react";
import { useForm } from "../../../../hooks/useForm";
import { LookupsContext } from "../../../provider";
import DropDown from "./DropDown/DropDown";
import InputField from "./InputField/InputField";
import DatePicker from "./DatePicker/DatePicker";
import { formatPhoneNumber } from "../../../../helpers";
import { OmniAccess } from "./OmniAccess";
import { EmployeeDropDown } from "../../../components";
import {
  profileFormValidation,
  VICTRA_CLASSIFICATION_ID,
  udpateSecondaryCompanyIds,
  udpateSecondaryLocations,
  profileFormValidationForOwnVictra,
  profileFormValidationForOwnContractor,
  profileFormValidationForVictra,
} from "../ProfilePageHelper";
import {
  AlphaNumericValidatorWithOutSpace,
  NumericValidator,
} from "../../../../validators";
import "../ProfilePage.scss";
import moment from "moment";

export const ProfileForm = ({
  Data = {},
  pendingChanges = [],
  Editable = true,
  dispatch,
  profileFormState,
  hasViewPermission = false,
  hasEditPermission = false,
  hasManagerPermission = false,
  employeeRoles = [],
  isOwnProfile = false,
  headerFields,
}) => {
  const {
    formState,
    onInputChange,
    setFormValidation,
    errors,
    adpId,
    status,
    classificationId,
    reportsTo,
    supervisorMDMWorkerId,
    payTypeId,
    jobCodeId,
    programCodeId,
    nativeId,
    companyId,
    costCenterId,
    organizationRoleId,
    visionRole,
    cimWorkerId,
    appProvisioningRoleId,
    sendToOmni,
    officePhoneExt,
    companies,
    terminationDate,
    ssoid,
    locationLevelId,
    locations,
    commissionGroupId,
    hireDate,
    onePOS,
  } = useForm({
    gender: Data?.gender,
    adpId: Data?.adpId,
    statusId: Data?.statusId,
    status: Data?.status,
    classificationId: Data?.classificationId,
    titleId: Data?.titleId,
    reportsTo: Data?.reportsTo?.trim(),
    supervisorMDMWorkerId: Data?.supervisorMDMWorkerId,
    commisionableStatus: Data?.commisionableStatus,
    commissionGroupId: Data?.commissionGroupId,
    payTypeId: Data?.payTypeId,
    jobCodeId: Data?.jobCodeId,
    programCodeId: Data?.programCodeId,
    nativeId: Data?.nativeId,
    companyId: Data?.companyId,
    costCenterId: Data?.costCenterId,
    organizationRoleId: Data?.organizationRoleId,
    visionRole: employeeRoles,
    mdmWorkerId: Data?.mdmWorkerId,
    legalFirstName: Data?.legalFirstName,
    legalLastName: Data?.legalLastName,
    preferredFirstName: Data?.preferredFirstName,
    preferredLastName: Data?.preferredLastName,
    name: Data?.name,
    title: Data?.title,
    email: Data?.email,
    businessGroupId: Data?.businessGroupId,
    appProvisioningRoleId: Data?.appProvisioningRoleId,
    officePhone: Data?.officePhone,
    officePhoneExt: Data?.officePhoneExt,
    sendToOmni: Data?.sendToOmni,
    hireDate: Data?.hireDate,
    companies: udpateSecondaryCompanyIds(Data?.companies),
    locations: udpateSecondaryLocations(Data?.locations),
    terminationDate: Data?.terminationDate,
    ssoid: Data?.ssoid,
    locationLevelId: Data?.locationLevelId,
    mdmAssignmentTypeId: Data?.mdmAssignmentTypeId,
    cimWorkerId: Data?.cimWorkerId,
    onePOS: Data?.onePOS,
  });
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(Data?.officePhone)
  );
  const handleInput = (e) => {
    let formattedPhoneNumber = formatPhoneNumber(e.target.value);
    if (e.target?.defaultValue?.length > e.target.value?.length) {
      formattedPhoneNumber = e.target.value;
      const value = {
        target: {
          value: formattedPhoneNumber,
          name: e.target.name,
        },
      };
      setPhoneNumber(formattedPhoneNumber);
      onInputChange(value);
    } else {
      setPhoneNumber(formattedPhoneNumber);
      onInputChange(e);
    }
  };

  const { lookups, visionRoles } = useContext(LookupsContext);
  const isVictraEmployee =
    classificationId?.toString() === VICTRA_CLASSIFICATION_ID?.toString();
  const isContractor =
    classificationId?.toString() !== VICTRA_CLASSIFICATION_ID.toString();
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      if (isOwnProfile) {
        if (isVictraEmployee) {
          setFormValidation(profileFormValidationForOwnVictra);
        } else {
          setFormValidation(profileFormValidationForOwnContractor);
        }
      } else if (isVictraEmployee) {
        setFormValidation(profileFormValidationForVictra);
      } else {
        setFormValidation(profileFormValidation);
      }
    } else {
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: {
          ...profileFormState.form,
          data: formState,
          errors: errors,
        },
        hasFormChanges: true,
      });
    }
  }, [formState]);

  const handleOfficeExt = (e) => {
    const value = e.target.value;
    if (value?.length < 6 && NumericValidator(value)) {
      onInputChange(e);
    }
    return;
  };

  const handleOnePosCode = async (e) => {
    const value = e.target.value;
    if (value.length < 16 && AlphaNumericValidatorWithOutSpace(value)) {
      onInputChange(e);
    }
    return;
  };

  useEffect(() => {
    if (headerFields?.hasHeaderChanges) {
      onInputChange({
        target: { name: "positionId", value: headerFields?.titleId },
      });
    }
  }, [headerFields]);

  return (
    <>
      <div className="m-2">
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-3">
          <div className="form-group">
            <InputField
              id="adpId"
              label="HR Worker Id"
              name="adpId"
              value={
                adpId && hasViewPermission && isVictraEmployee ? adpId : "-"
              }
              placeholder={
                hasViewPermission && isVictraEmployee
                  ? "Enter the HR Worker Id"
                  : "-"
              }
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled
            />
          </div>
          <div className="form-group">
            <InputField
              id="statusId"
              label="Status"
              name="statusId"
              value={status}
              placeholder="Enter the Status"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled
            />
          </div>
          <div className="form-group">
            <DropDown
              id="classificationId"
              label="Classification"
              value={classificationId?.toString()}
              onInputChange={onInputChange}
              editable={Editable}
              isDisabled
              placeholder="Select the Classification"
              name="classificationId"
              pendingChanges={pendingChanges}
              errors={errors}
              options={lookups?.classifications || []}
              optionLabel="lookupName"
              optionValue="lookupValuePK"
              className={"data-field"}
            />
          </div>
          <div className="form-group">
            <InputField
              id="phone"
              label="Office Phone Number"
              name="officePhone"
              value={phoneNumber}
              placeholder="(999) 999-9999"
              onChange={handleInput}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="tel"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            <InputField
              id="phoneExt"
              label="Office Phone Number Ext"
              name="officePhoneExt"
              value={officePhoneExt}
              placeholder="Enter the Office Phone Number Ext"
              onChange={handleOfficeExt}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
            />
          </div>
          <div className="form-group">
            <EmployeeDropDown
              id="reportsTo"
              label="Reports To"
              placeholder={reportsTo ? reportsTo : "Select the Reports To"}
              name="supervisorMDMWorkerId"
              value={
                supervisorMDMWorkerId
                  ? supervisorMDMWorkerId?.toString()
                  : reportsTo
              }
              onInputChange={onInputChange}
              editable={Editable || isVictraEmployee}
              pendingChanges={pendingChanges}
              errors={errors}
              isDisabled={
                !((hasEditPermission || hasManagerPermission) && isContractor)
              }
            />
          </div>
          <div className="form-group">
            <DropDown
              id="mdmCompanyId"
              label="Primary Company"
              isDisabled={!(hasEditPermission && isContractor)}
              value={
                hasViewPermission || hasManagerPermission ? companyId : "-"
              }
              onInputChange={onInputChange}
              editable={Editable}
              placeholder={
                hasViewPermission || hasManagerPermission
                  ? "Enter the Primary Company"
                  : "-"
              }
              name="companyId"
              pendingChanges={pendingChanges}
              options={lookups?.companies || []}
              optionLabel="companyName"
              optionValue="mdmCompanyId"
              errors={errors}
            />
          </div>
          <div className="form-group">
            <DropDown
              id="mdmCompanyIds"
              label="Companies"
              value={
                hasViewPermission || hasManagerPermission ? companies : ["-"]
              }
              onInputChange={onInputChange}
              editable={Editable}
              placeholder={
                hasViewPermission || hasManagerPermission
                  ? "Select the Companies"
                  : "-"
              }
              name="companies"
              pendingChanges={pendingChanges}
              options={lookups?.companies || []}
              optionLabel="companyName"
              optionValue="mdmCompanyId"
              errors={errors}
              isMulti
              isDisabled={!hasEditPermission}
            />
          </div>
          <div className="form-group">
            <DropDown
              id="commissionGroupId"
              label="Commission Group"
              isDisabled
              value={
                isVictraEmployee && commissionGroupId ? commissionGroupId : "-"
              }
              onInputChange={onInputChange}
              editable={Editable}
              placeholder={
                isVictraEmployee ? "Select the Commission Group" : "-"
              }
              name="commissionGroupId"
              pendingChanges={pendingChanges}
              options={lookups?.commissionGroups || []}
              optionLabel="commissionGroupName"
              optionValue="mdmCommissionGroupId"
              errors={errors}
            />
          </div>

          <div className="form-group">
            <DropDown
              id="rqOrganizationRoleId"
              label="Organization Role"
              placeholder="Select the Organization Role"
              value={organizationRoleId?.toString()}
              onInputChange={onInputChange}
              editable={Editable}
              name="organizationRoleId"
              pendingChanges={pendingChanges}
              errors={errors}
              options={lookups?.organizationRoles || []}
              optionLabel="organizationRoleName"
              optionValue="mdmOrganizationRoleId"
              isDisabled={!(hasEditPermission && isContractor)}
            />
          </div>
          <div className="form-group">
            <DropDown
              id="visionRoleId"
              label="Vision Role"
              value={visionRole}
              onInputChange={onInputChange}
              editable={Editable}
              placeholder="Select the Vision Role"
              name="visionRole"
              pendingChanges={pendingChanges}
              options={visionRoles || []}
              optionLabel="name"
              optionValue="id"
              isMulti
              errors={errors}
              isDisabled={!hasEditPermission}
            />
          </div>
          <div className="form-group">
            <DropDown
              id="payTypeId"
              label="Exempt/Non-Exempt"
              isDisabled
              value={
                isVictraEmployee && payTypeId?.toString()
                  ? payTypeId?.toString()
                  : "-"
              }
              onInputChange={onInputChange}
              editable={Editable}
              placeholder={
                isVictraEmployee ? "Select the Exempt/Non-Exempt" : "-"
              }
              name="payTypeId"
              pendingChanges={pendingChanges}
              options={lookups?.exempts || []}
              optionLabel="lookupName"
              optionValue="lookupValuePK"
              errors={errors}
            />
          </div>
          <div className="form-group">
            <DatePicker
              id="hireDate"
              label="Hire Date"
              name="hireDate"
              value={hireDate ? new moment(hireDate).toDate() : null}
              onInputChange={onInputChange}
              placeholder="Select the Hire Date"
              disabled={
                Editable ||
                !((hasEditPermission || hasManagerPermission) && isContractor)
              }
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
          <div className="form-group">
            <DatePicker
              id="terminationDate"
              label="Termination Date"
              name="terminationDate"
              value={
                (hasViewPermission || hasManagerPermission) && terminationDate
                  ? moment(terminationDate).toDate()
                  : null
              }
              onInputChange={onInputChange}
              placeholder={
                hasViewPermission || hasManagerPermission
                  ? "Select the Termination Date"
                  : "-"
              }
              disabled={
                Editable ||
                !((hasEditPermission || hasManagerPermission) && isContractor)
              }
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
          <div className="form-group">
            <InputField
              id="costCenterId"
              label="Cost Center"
              placeholder="Enter the Cost Center"
              name="costCenterId"
              value={costCenterId ? costCenterId : "-"}
              onChange={onInputChange}
              disabled
            />
          </div>
          <div className="form-group">
            <InputField
              id="onePOS"
              label="One POS Code"
              name="onePOS"
              value={hasViewPermission ? onePOS : "-"}
              placeholder="Enter the One POS Code"
              onChange={handleOnePosCode}
              disabled={!hasEditPermission || Editable}
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
        </div>
      </div>
      <br />
      <OmniAccess
        key={`access-${Editable}-${sendToOmni}`}
        sendToOmni={sendToOmni}
        pendingChanges={pendingChanges}
        Editable={Editable}
        cimWorkerId={cimWorkerId}
        programCodeId={programCodeId}
        jobCodeId={jobCodeId}
        appProvisioningRoleId={appProvisioningRoleId}
        nativeId={nativeId}
        ssoid={ssoid}
        onInputChange={onInputChange}
        errors={errors}
        hasViewPermission={hasViewPermission}
        hasManagerPermission={hasManagerPermission}
        hasEditPermission={hasEditPermission}
      />
    </>
  );
};

export default ProfileForm;
