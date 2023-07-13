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

export const PaymentForm = ({
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
    card_fname,
    card_lname,
    errors,
    card_city,
    card_address_1,
    card_state,
    card_zip_Code,
    card_country,
    cardnumber,
    expirationdate,
    cardcode,
    email,
  } = useForm({
    card_fname: Data?.first_Name,
    card_lname: Data?.last_Name,
    card_city: Data?.city,
    card_address_1: Data?.address_1,
    card_state: Data?.state,
    card_zip_Code: Data?.zip_Code,
    card_country: Data?.country,
    cardnumber: Data?.cardnumber,
    expirationdate: Data?.expirationdate,
    cardcode: Data?.cardcode,
    email: Data?.email,
  });

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
          <div className="form-group">
            <InputField
              id="card_fname"
              label="First Name (As per card)"
              name="card_fname"
              value={
                Data
                  ? card_fname.charAt(0).toUpperCase() +
                    card_fname.slice(1, card_fname.length).toLowerCase()
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
              id="card_lname"
              label="Last Name (As per card)"
              name="card_lname"
              value={
                Data
                  ? card_lname.charAt(0).toUpperCase() +
                    card_lname.slice(1, card_lname.length).toLowerCase()
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
            <InputField
              id="card_address_1"
              label="Address"
              name="card_address_1"
              value={card_address_1}
              placeholder="Enter the Address"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <InputField
              id="card_city"
              label="City"
              name="card_city"
              value={card_city}
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
              id="card_state"
              label="State"
              name="card_state"
              value={card_state}
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
              id="card_zip_Code"
              label="ZIP"
              name="card_zip_Code"
              value={card_zip_Code}
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
              id="card_country"
              label="Country"
              name="card_country"
              value={card_country}
              placeholder="Enter the country"
              onChange={onInputChange}
              pendingChanges={pendingChanges}
              disabled={Editable}
              type="text"
              errors={errors}
              maxLength={14}
            />
          </div>
        </div>
      </div>
      <br />
    </>
  );
};

export default PaymentForm;
