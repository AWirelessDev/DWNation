import { useMsal } from "@azure/msal-react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { formatPhoneNumber, getApi } from "../../../helpers";
import { useForm } from "../../../hooks";
import {
  DropDown,
  EmployeeDropDown,
  EventModal,
  ReactDatePicker,
  ReactToast,
} from "../../components";
import ToggleSwitchAC from "../../components/ToggleSwitch/ToggleSwitchAC";
import { LookupsContext } from "../../provider";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import InputField from "../ProfilePage/components/InputField/InputField";
import { ContractorPageButtons } from "./ContractorPageButton";
import { AlphaNumericValidatorWithOutSpace } from "../../../validators";
const { VITE_REACT_URL_API_MDM, VITE_FUNCTION_KEY_MDM } = import.meta.env;

export const ContractorPageContent = ({
  Data = {},
  impersonation,
  impersonEmail,
}) => {
  const { accounts, instance } = useMsal();
  const [errshow, setErrShow] = useState(false);
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("");
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    formState,
    onInputChange,
    classificationId,
    Editable = true,
    errors,
    formValidation,
    setFormValidation,
    titleId,
    legalFirstName,
    legalLastName,
    preferredFirstName,
    officePhone,
    supervisorMDMWorkerId,
    officePhoneExt,
    rehireDate,
    MDMLocationId,
    sendToOmni,
    appProvisionRole,
    programCode,
    jobCode,
    mdmCompanyId,
    companies,
    mdmOrganizationRoleId,
    pronounId,
    onePosCode,
  } = useForm({
    classificationId: Data?.classificationId,
    titleId: Data?.titleId,
    legalFirstName: Data?.legalFirstName,
    legalLastName: Data?.legalLastName,
    preferredFirstName: Data?.preferredFirstName,
    officePhone: Data?.officePhone,
    supervisorMDMWorkerId: Data?.supervisorMDMWorkerId,
    officePhoneExt: Data?.officePhoneExt,
    rehireDate: Data?.rehireDate,
    MDMLocationId: Data?.MDMLocationId,
    sendToOmni: Data?.sendToOmni,
    appProvisionRole: Data?.appProvisionRole,
    programCode: Data?.programCode,
    jobCode: Data?.jobCode,
    mdmCompanyId: Data?.mdmCompanyId,
    companies: Data?.companies,
    mdmOrganizationRoleId: Data?.mdmOrganizationRoleId,
    pronounId: Data?.pronounId,
    onePosCode: Data?.onePosCode,
  });
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(formState?.officePhone)
  );

  const [locationList, setLocationList] = useState([]);
  const { lookups, positions, programCodes, jobCodes } =
    useContext(LookupsContext);
  const minDate = moment().subtract(2, "months").toDate();
  const maxDate = moment().add(2, "months").toDate();

  useEffect(() => {
    if (sendToOmni) {
      setFormValidation((e) => [
        ...e,
        { key: "programCode", name: "Program Code", isRequired: true },
        { key: "jobCode", name: "Job Code", isRequired: true },
      ]);
    } else {
      setFormValidation([
        { key: "legalFirstName", name: "Legal First Name", isRequired: true },
        { key: "legalLastName", name: "Legal Last Name", isRequired: true },

        {
          key: "titleId",
          name: "Position",
          isRequired: true,
        },
        {
          key: "classificationId",
          name: "Classification",
          isRequired: true,
        },
        {
          key: "preferredFirstName",
          name: "Preferred First Name",
          isRequired: true,
        },
        {
          key: "supervisorMDMWorkerId",
          name: "Reports To",
          isRequired: true,
        },
        {
          key: "mdmCompanyId",
          name: "Primary Company",
          isRequired: true,
        },
        {
          key: "MDMLocationId",
          name: "Primary Location",
          isRequired: true,
        },
        {
          key: "mdmOrganizationRoleId",
          name: "Organization Role",
          isRequired: true,
        },
        {
          key: "officePhone",
          name: "Office Phone Number",
          isValidPhoneNumber: true,
        },
      ]);
    }
  }, [sendToOmni]);

  const onSendToOmniChange = async (isChecked) => {
    onInputChange({ target: { name: "sendToOmni", value: isChecked } });
  };

  const onChangePhoneInput = (e) => {
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

  const onCahgePhoneExtInput = (e) => {
    const re = /^[0-9\b]+$/;
    let extNum = e.target.value;
    if (extNum === "" || re.test(extNum)) {
      if (extNum.length < 6) {
        onInputChange(e);
      }
    }
  };
  const onInputChangeOnePosCode = (e) => {
    const value = e.target.value;
    if (value.length < 16 && AlphaNumericValidatorWithOutSpace(value)) {
      onInputChange(e);
    }
    return;
  };

  const onInputChangeAcceptAlphabets = (e) => {
    const re = /^[a-zA-Z\b]+$/;
    let inputValue = e.target.value;
    if (inputValue === "" || re.test(inputValue)) {
      onInputChange(e);
    }
  };

  const fetchLocation = async () => {
    const _locations = await getApi(
      `${VITE_REACT_URL_API_MDM}/GetAllLocationLevelsForBusinessGroup/1`,
      {
        "x-functions-key": VITE_FUNCTION_KEY_MDM,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );

    if (_locations?.length) {
      setLocationList(_locations);
    } else {
      setLocationList([]);
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <React.Fragment>
      <div className="contractorForm">
        <div className="row">
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="legalFirstName"
                label="Legal First Name"
                name="legalFirstName"
                value={legalFirstName ? legalFirstName : ""}
                placeholder="Legal First Name"
                onChange={onInputChangeAcceptAlphabets}
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="legalLastName"
                label="Legal Last Name"
                name="legalLastName"
                value={legalLastName ? legalLastName : ""}
                placeholder="Legal Last Name"
                onChange={onInputChangeAcceptAlphabets}
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="preferredFirstName"
                label="Preferred First Name"
                name="preferredFirstName"
                value={preferredFirstName ? preferredFirstName : ""}
                placeholder="Preferred First Name"
                onChange={onInputChangeAcceptAlphabets}
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="positionId"
                label="Position"
                value={titleId?.toString()}
                onInputChange={onInputChange}
                editable={!Editable}
                placeholder="Position"
                name="titleId"
                options={positions || []}
                optionLabel="lookupName"
                optionValue="lookupValuePK"
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="officePhone"
                label="Office Phone Number"
                name="officePhone"
                value={phoneNumber ? phoneNumber : ""}
                placeholder="(999) 999-9999"
                onChange={onChangePhoneInput}
                type="tel"
                errors={errors}
                maxLength={14}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="officePhoneExt"
                label="Office Phone Number Ext"
                name="officePhoneExt"
                value={officePhoneExt ? officePhoneExt : ""}
                placeholder="Phone Number Ext"
                onChange={onCahgePhoneExtInput}
                type="tel"
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="pronounId"
                label="Pronouns"
                value={pronounId}
                onInputChange={onInputChange}
                editable={!Editable}
                placeholder="Pronouns"
                name="pronounId"
                options={lookups?.pronouns || []}
                optionLabel="lookupName"
                optionValue="lookupValuePK"
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="MDMLocationId"
                label="Primary Location"
                value={MDMLocationId?.toString()}
                onInputChange={onInputChange}
                placeholder="Primary Location"
                name="MDMLocationId"
                options={locationList || []}
                optionLabel="locationName"
                optionValue="mdmLocationLevelId"
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="classificationId"
                label="Classification"
                value={classificationId?.toString()}
                onInputChange={onInputChange}
                placeholder="Classification"
                name="classificationId"
                options={
                  lookups?.classifications.filter(
                    (i) => i.lookupValuePK != "WRKTP1"
                  ) || []
                }
                optionLabel="lookupName"
                optionValue="lookupValuePK"
                className={"data-field"}
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <EmployeeDropDown
                id="reportsTo"
                label="Reports To"
                placeholder={"Begin typing to search"}
                name="supervisorMDMWorkerId"
                value={supervisorMDMWorkerId}
                onInputChange={onInputChange}
                editable={!Editable}
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <label htmlFor="" className="my-2">
                Hire Date:
              </label>
              <ReactDatePicker
                id="rehireDate"
                name="rehireDate"
                placeholder="mm/dd/yyyy"
                dateFormat="MM/dd/yyyy"
                className="form-control"
                startDate={rehireDate ? moment(rehireDate)?.toDate() : null}
                minDate={minDate}
                maxDate={maxDate}
                handleDateChange={(updatedDate) => {
                  onInputChange({
                    target: {
                      name: "rehireDate",
                      value: moment(updatedDate).format("MM/DD/YYYY") || null,
                    },
                  });
                }}
                key={`${moment(rehireDate)?.toDate()}`}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="mdmOrganizationRoleId"
                label="Organization Role"
                value={mdmOrganizationRoleId}
                onInputChange={onInputChange}
                placeholder="Organization Role"
                name="mdmOrganizationRoleId"
                options={lookups?.organizationRoles || []}
                optionLabel="organizationRoleName"
                optionValue="mdmOrganizationRoleId"
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="primaryCompanyId"
                label="Primary Company"
                value={mdmCompanyId?.toString()}
                onInputChange={onInputChange}
                placeholder="Primary Company"
                name="mdmCompanyId"
                options={lookups?.companies || []}
                optionLabel="companyName"
                optionValue="mdmCompanyId"
                errors={errors}
              />
            </div>
          </div>
          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <DropDown
                id="companies"
                label="Companies"
                value={companies}
                onInputChange={onInputChange}
                placeholder="Companies"
                name="companies"
                options={lookups?.companies || []}
                optionLabel="companyName"
                optionValue="mdmCompanyId"
                isMulti={true}
              />
            </div>
          </div>

          <div className="col-lg-4 col-sm-6 pb-2">
            <div className="form-group">
              <InputField
                id="onePosCode"
                label="One POS Code"
                name="onePosCode"
                value={onePosCode ? onePosCode : ""}
                placeholder="One POS Code"
                onChange={onInputChangeOnePosCode}
              />
            </div>
          </div>
          <div className="co-12 py-2">
            <div className="form-group">
              <label htmlFor="" className="me-2">
                Send to OMNI:
              </label>
              <ToggleSwitchAC
                id="sendToOmni"
                name="sendToOmni"
                checked={sendToOmni || false}
                onChange={onSendToOmniChange}
                disabled={!Editable}
              />
            </div>
          </div>
          {sendToOmni && (
            <div className="col-lg-4 col-sm-6">
              <div className="form-group">
                <DropDown
                  id="appProvisionRole"
                  label="App Provisioning Role"
                  placeholder={"Select the App Provisioning Role"}
                  name="appProvisionRole"
                  value={appProvisionRole ? appProvisionRole : "-"}
                  onInputChange={onInputChange}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                  editable={!Editable}
                  options={
                    lookups?.appProvisioningRoles?.length
                      ? lookups?.appProvisioningRoles
                      : []
                  }
                />
              </div>
            </div>
          )}
          {sendToOmni && (
            <div className="col-lg-4 col-sm-6">
              <div className="form-group">
                <DropDown
                  id="programCode"
                  label="Program Code"
                  value={programCode}
                  onInputChange={onInputChange}
                  placeholder="Program Code"
                  name="programCode"
                  options={programCodes || []}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                />
              </div>
            </div>
          )}
          {sendToOmni && (
            <div className="col-lg-4 col-sm-6">
              <div className="form-group">
                <DropDown
                  id="jobCode"
                  label=" Job Code"
                  value={jobCode}
                  onInputChange={onInputChange}
                  placeholder="Job Code"
                  name="jobCode"
                  options={jobCodes || []}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  errors={errors}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ContractorPageButtons
        setShow={setShow}
        setErrShow={setErrShow}
        setAction={setAction}
        contractorState={formState}
        errors={errors}
        setErrorMessage={setErrorMessage}
        setErrorStatus={setErrorStatus}
      />

      {show && (
        <EventModal
          formName={"Contractor"}
          action={action}
          employeeFullName={formState?.legalFirstName}
          title={"Successfully added a new user"}
        >
          <>
            <strong>
              {formState?.preferredFirstName} {formState?.legalLastName}
            </strong>{" "}
            has been created. This change will be available across systems
            within <strong>15 minutes</strong>.
          </>
        </EventModal>
      )}
      {errshow && (
        <ReactToast
          title={"Error"}
          position={"top-center"}
          classbg="danger"
          handleClose={() => {
            setErrShow(false);
            setErrorMessage(null);
            setErrorStatus(null);
          }}
        >
          <div>
            <ErrorPage
              code={errorStatus}
              isTextMsg={true}
              className="error-toast-message"
            />
          </div>
        </ReactToast>
      )}
    </React.Fragment>
  );
};
