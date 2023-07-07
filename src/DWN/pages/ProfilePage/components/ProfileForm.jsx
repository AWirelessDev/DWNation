import React, { useContext, useState, useEffect } from "react";
import { useForm } from "../../../../hooks/useForm";
import DropDown from "./DropDown/DropDown";
import InputField from "./InputField/InputField";
import DatePicker from "./DatePicker/DatePicker";
import { formatPhoneNumber } from "../../../../helpers";
import { OmniAccess } from "./OmniAccess";
import { EmployeeDropDown, ReactDatePicker } from "../../../components";
import Select from "react-select";
import { profileFormValidation } from "../ProfilePageHelper";
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
    dwnation_Subscriber_ID,
    subscriber_ID,
    account_Number,
    insurance_Activation_Date,
    equipment_Purchase_Date,
    modality,
    equipment_Description,
    location_Code,
    agent_ID,
    mobile_Activation_Date,
    cC_Profile_ID,
    CC_PaymentProfile_ID,
    cC_Update_Date_Time,
    service_Plan,
    covered_Since,
    coverage_Effective,
    losses,
    hotlined,
    term_Date,
    account_Type,
    rowInsertedEST,
    customertype,
    cardnumber,
    expirationdate,
    cardcode,
    email,
  } = useForm({
    subscriber_ID: Data?.subscriber_ID,
    fname: Data?.first_Name,
    lname: Data?.last_Name,
    mdn: Data?.mdn,
    city: Data?.city,
    status: Data?.status,
    address_1: Data?.address_1,
    state: Data?.state,
    current_Losses: Data?.current_Losses,
    zip_Code: Data?.zip_Code,
    country: Data?.country,
    losses: Data?.losses,
    feature_Code: Data?.feature_Code,
    esN_IMEI: Data?.esN_IMEI,
    dwnation_Subscriber_ID: Data?.dwnation_Subscriber_ID,
    account_Number: Data?.account_Number,
    insurance_Activation_Date: Data?.insurance_Activation_Date,
    equipment_Purchase_Date: Data?.equipment_Purchase_Date,
    modality: Data?.modality,
    equipment_Description: Data?.equipment_Description,
    location_Code: Data?.location_Code,
    agent_ID: Data?.agent_ID,
    mobile_Activation_Date: Data?.mobile_Activation_Date,
    cC_Profile_ID: Data?.cC_Profile_ID,
    CC_PaymentProfile_ID: Data?.CC_PaymentProfile_ID,
    cC_Update_Date_Time: Data?.cC_Update_Date_Time,
    service_Plan: Data?.service_Plan,
    covered_Since: Data?.covered_Since,
    coverage_Effective: Data?.coverage_Effective,
    hotlined: Data?.hotlined,
    term_Date: Data?.term_Date,
    account_Type: Data?.account_Type,
    rowInsertedEST: Data?.rowInsertedEST,
  });
  const [phoneNumber, setPhoneNumber] = useState(formatPhoneNumber(Data?.mdn));
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

  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setFormValidation(profileFormValidation);
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
          {Data ? (
            <div className="form-group">
              <InputField
                id="subId"
                label="DWN Subscriber#"
                name="subId"
                value={dwnation_Subscriber_ID}
                onChange={onInputChange}
                pendingChanges={pendingChanges}
                errors={errors}
                disabled
              />
            </div>
          ) : (
            <></>
          )}
          <div className="form-group">
            <InputField
              id="status"
              label="Status"
              name="status"
              value={status}
              placeholder={"Enter the Status"}
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled={Editable}
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
              id="accountnumber"
              label="Account Number"
              name="accountnumber"
              value={account_Number}
              placeholder="Enter the Account Number"
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
              id="fname"
              label="First Name"
              name="fname"
              value={
                Data
                  ? fname.charAt(0).toUpperCase() +
                    fname.slice(1, fname.length).toLowerCase()
                  : null
              }
              placeholder={"Enter the First Name"}
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled={Data ? true : Editable}
            />
          </div>
          <div className="form-group">
            <InputField
              id="lname"
              label="Last Name"
              name="lname"
              value={
                Data
                  ? lname.charAt(0).toUpperCase() +
                    lname.slice(1, lname.length).toLowerCase()
                  : null
              }
              placeholder="Enter the Last Name"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              errors={errors}
              disabled={Data ? true : Editable}
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
              id="state"
              label="State"
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
              label="ZIP"
              name="zip_Code"
              value={zip_Code}
              placeholder="Enter the Zip"
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
            <DatePicker
              id="insurance_Activation_Date"
              label="Insurance Activation Date"
              name="insurance_Activation_Date"
              value={
                insurance_Activation_Date
                  ? new moment(
                      typeof insurance_Activation_Date === "string" ||
                      insurance_Activation_Date instanceof String
                        ? insurance_Activation_Date.replace("12:00AM", "")
                        : insurance_Activation_Date
                    ).toDate()
                  : null
              }
              onInputChange={onInputChange}
              placeholder="Select the Insurance Activation Date"
              disabled={Data ? true : Editable}
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
          <div className="form-group">
            <InputField
              id="esN_IMEI"
              label="IMEI"
              name="esN_IMEI"
              value={esN_IMEI}
              placeholder="Enter the IMEI"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          {Data ? (
            <div className="form-group">
              <InputField
                id="cC_Profile_ID"
                label="CC Profile ID"
                name="cC_Profile_ID"
                value={cC_Profile_ID}
                placeholder="Enter cc Profile ID"
                onChange={onInputChange}
                pendingChanges={pendingChanges}
                disabled
                type="text"
                errors={errors}
                maxLength={14}
              />
            </div>
          ) : (
            <></>
          )}
          {Data ? (
            <div className="form-group">
              <InputField
                id="CC_PaymentProfile_ID"
                label="CC Payment Profile ID"
                name="CC_PaymentProfile_ID"
                value={CC_PaymentProfile_ID}
                placeholder="Enter CC Profile ID"
                onChange={onInputChange}
                pendingChanges={pendingChanges}
                disabled
                type="text"
                errors={errors}
                maxLength={14}
              />
            </div>
          ) : (
            <></>
          )}
          {
            <div className="form-group">
              <InputField
                id="service_Plan"
                label="Service Plan"
                name="service_Plan"
                value={service_Plan}
                placeholder="Enter the Service Plan"
                onChange={onInputChange}
                pendingChanges={pendingChanges}
                disabled={Editable}
                type="text"
                errors={errors}
                maxLength={14}
              />
            </div>
          }
          <div className="form-group">
            <DatePicker
              id="covered_Since"
              label="Covered Since"
              name="covered_Since"
              value={
                covered_Since
                  ? new moment(
                      typeof covered_Since === "string" ||
                      covered_Since instanceof String
                        ? covered_Since.replace("12:00AM", "")
                        : covered_Since
                    ).toDate()
                  : null
              }
              onInputChange={onInputChange}
              placeholder="Select the Date"
              disabled={Data ? true : Editable}
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
          <div className="form-group">
            <InputField
              id="CustomerType"
              label="Customer Type"
              name="CustomerType"
              value={customertype}
              placeholder="Enter the Customer Type"
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
              id="cardnumber"
              label="Card Number"
              name="cardnumber"
              value={cardnumber}
              placeholder="Enter the Card Number"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
          <div className="form-group">
            {/* <DatePicker
              id="expirationdate"
              label="Expiration Date"
              name="expirationdate"
              value={
                expirationdate
                  ? new moment(
                      typeof expirationdate === "string" ||
                      expirationdate instanceof String
                        ? expirationdate.replace("12:00AM", "")
                        : expirationdate
                    ).toDate()
                  : null
              }
              onInputChange={onInputChange}
              placeholder="Select the Date"
              disabled={Data ? true : Editable}
              pendingChanges={pendingChanges}
              errors={errors}
            /> */}

            <ReactDatePicker
              id="expirationdate"
              name="expirationdate"
              placeholder="MMYY"
              dateFormat="MMyy"
              className="form-control"
              startDate={
                expirationdate ? moment(expirationdate)?.toDate() : null
              }
              handleDateChange={(updatedDate) => {
                onInputChange({
                  target: {
                    name: "expirationdate",
                    value: moment(expirationdate).format("MMYY") || null,
                  },
                });
              }}
              errors={errors}
              key={`${moment(expirationdate)?.toDate()}`}
            />
          </div>
          <div className="form-group">
            <InputField
              id="cardcode"
              label="Card Code"
              name="cardcode"
              value={cardcode}
              placeholder="Enter the Card Code"
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
              id="email"
              label="Email"
              name="email"
              value={email}
              placeholder="Enter the Email"
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
          {/* 
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
          </div> */}
        </div>
      </div>
      <br />
    </>
  );
};

export default ProfileForm;
