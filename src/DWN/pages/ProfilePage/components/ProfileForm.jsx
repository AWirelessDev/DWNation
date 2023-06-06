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
    fname,
    lname,
    mdn,
    errors,
    city,
    address_1,
    state,
    current_Losses,
    zip_Code,
    country,
    feature_Code,
    esN_IMEI,     
    status,  
    
  } = useForm({
    fname: Data[0].first_Name,
    lname: Data[0].last_Name,
    mdn: Data[0].mdn,
    city: Data[0].city,
    status: Data[0].status,
    address_1: Data[0].address_1,
    state: Data[0].state,
    current_Losses: Data[0].current_Losses,
    zip_Code: Data[0].zip_Code,
    country: Data[0].country,
    losses: Data[0].losses,
    feature_Code: Data[0].feature_Code,
    esN_IMEI: Data[0].esN_IMEI
    
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
  // const isVictraEmployee =
  //   classificationId?.toString() === VICTRA_CLASSIFICATION_ID?.toString();
  // const isContractor =
  //   classificationId?.toString() !== VICTRA_CLASSIFICATION_ID.toString();
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      // if (isOwnProfile) {
      //   if (isVictraEmployee) {
      //     setFormValidation(profileFormValidationForOwnVictra);
      //   } else {
      //     setFormValidation(profileFormValidationForOwnContractor);
      //   }
      // } else if (isVictraEmployee) {
      //   setFormValidation(profileFormValidationForVictra);
      // } else {
      //   setFormValidation(profileFormValidation);
      // }
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
              id="fname"
              label="First Name"
              name="fname"
              value={
                fname
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
              id="lname"
              label="Last Name"
              name="lname"
              value={lname}
              placeholder="Enter the Status"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled
            />
          </div>        
          <div className="form-group">
            <InputField
              id="mdn"
              label="Phone Number"
              name="mdn"
              value={mdn}
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
              id="city"
              label="City"
              name="city"
              value={city}
              placeholder="Enter the City"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            <InputField
              id="address_1"
              label="Address"
              name="address_1"
              value={address_1}
              placeholder="Enter the Address"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            <InputField
              id="country"
              label="Country"
              name="country"
              value={country}
              placeholder="Enter the country"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            <InputField
              id="current_Losses"
              label="Current Losses"
              name="current_Losses"
              value={current_Losses}
              placeholder="Enter the current_Losses"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
             </div>
            <div className="form-group">
            <InputField
              id="state"
              label="state"
              name="state"
              value={state}
              placeholder="Enter the state"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
             </div>
             <div className="form-group">
            <InputField
              id="zip_Code"
              label="Zip"
              name="zip_Code"
              value={zip_Code}
              placeholder="Enter the zip_Code"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
             </div>
           <div className="form-group">
            <InputField
              id="feature_Code"
              label="Feature Code"
              name="feature_Code"
              value={feature_Code}
              placeholder="Enter the feature Code"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            <InputField
              id="esN_IMEI"
              label="IMEI"
              name="esN_IMEI"
              value={esN_IMEI}
              placeholder="Enter the feature Code"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
        {/*  <div className="form-group">
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
          </div> */}
          <div className="form-group">
            <DropDown
              id="status"
              label="Status"              
              value={status}
              onInputChange={onInputChange}
              editable={Editable}             
              name="status"
              pendingChanges={pendingChanges}
              options={status || []}
              optionLabel="status"
              optionValue="status"
              errors={errors}
            />
          </div>
         {/* <div className="form-group">
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
          </div> */}
        </div>
      </div>
      <br />     
    </>
  );
};

export default ProfileForm;
