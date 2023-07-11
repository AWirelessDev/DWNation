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

  const handleExpMonthYear = (e) => {
    const value = e.target.value;
    if (value?.length < 5 && NumericValidator(value)) {
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
              id="account_Number"
              label="Account Number"
              name="account_Number"
              value={account_Number}
              placeholder={"Enter the Account Number"}
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
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
              maxLength={6}
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
                  ? new moment(insurance_Activation_Date).toDate()
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
                  ? covered_Since == "0001-01-01T00:00:00"
                    ? null
                    : new moment(covered_Since).toDate()
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
            <InputField
              id="expirationdate"
              label="Valid Upto"
              name="expirationdate"
              value={expirationdate}
              placeholder="MMYY"
              onChange={handleExpMonthYear}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={4}
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
              maxLength={3}
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
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <DatePicker
              id="equipment_Purchase_Date"
              label="Equipment Purchase Date"
              name="equipment_Purchase_Date"
              value={
                equipment_Purchase_Date
                  ? equipment_Purchase_Date == "0001-01-01T00:00:00"
                    ? null
                    : new moment(equipment_Purchase_Date).toDate()
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
              id="equipment_Description"
              label="Equipment Description"
              name="equipment_Description"
              value={equipment_Description}
              placeholder="Enter Equipment Description"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Data ? true : Editable}
              type="text"
              errors={errors}
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <DatePicker
              id="mobile_Activation_Date"
              label="Mobile Activation Date"
              name="mobile_Activation_Date"
              value={
                mobile_Activation_Date
                  ? mobile_Activation_Date == "0001-01-01T00:00:00"
                    ? null
                    : new moment(mobile_Activation_Date).toDate()
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
            <DatePicker
              id="term_Date"
              label="Term Date"
              name="term_Date"
              value={
                term_Date
                  ? term_Date == "0001-01-01T00:00:00"
                    ? null
                    : new moment(term_Date).toDate()
                  : null
              }
              onInputChange={onInputChange}
              placeholder="Select the Date"
              disabled={Data ? true : Editable}
              pendingChanges={pendingChanges}
              errors={errors}
            />
          </div>
          {/* 
        
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
         
          
           */}
        </div>
      </div>
      <br />
    </>
  );
};

export default ProfileForm;
