import React, { useState, useEffect } from "react";
import { Alert, Form, Row, Col } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";
import moment from "moment";
import {
  DropDown,
  ReactDatePicker,
  FormControl,
  TextArea,
  ReactTimePicker,
} from "../../components";
import { useForm } from "../../../hooks/useForm";
import { getApi } from "../../../helpers";
import {
  AlphaNumericSpecialCharValidator,
  NumericValidator,
} from "../../../validators";

const salesProcessPlaceHolder = `Describe the incident and create a SAMO plan to correct.\nSpecific: What needs to be corrected?\nAction: What is the specific action that will correct the issue?\nMeasure: How will it be measured? (ex.Every Guest, Every Time)\nOutcome: What will be the specific outcome when the SAMO is followed?`;
const FCADForm = ({
  id = "add",
  conductType = [],
  data = {},
  fcadState = null,
  dispatch = null,
  impersonation = false,
  impersonEmail = null,
}) => {
  const minDate = moment().subtract(2, "months").toDate();

  const {
    formState,
    onInputChange,
    onResetForm,
    errors,
    formValidation,
    setFormValidation,
    activityId,
    code,
    displayName,
    activityTypeId,
    mdmEmployeeId,
    activityStatusId,
    effectiveDatetime,
    activityNoticeTypeId,
    activityReasonTypeId,
    statusTypeCode,
    statusTypeDesc,
    createdBy,
    storeName,
    districtRqId,
    districtName,
    regionRqId,
    regionName,
    createdDateTime,
    areaName,
    showOnTimeline,
    businessUnit,
    submittedBy,
    userName,
    activityNotes,
    infractionDate,
    infractionCount,
    incidentDescription,
    excessiveInfractionFlag,
    noticeProvidedFlag,
    infractionStartTime = "",
    infractionEndTime = "",
  } = useForm({
    activityNotes: data?.activityNotes,
    infractionDate: data?.infractionDate,
    infractionCount:
      data?.infractionCount !== undefined
        ? data?.infractionCount.toString()
        : "",
    incidentDescription: data?.incidentDescription,
    activityId: data?.activityId,
    code: data?.code,
    displayName: data?.displayName,
    activityTypeId: data?.activityTypeId,
    mdmEmployeeId: data?.mdmEmployeeId,
    activityStatusId: data?.activityStatusId,
    effectiveDatetime: data?.effectiveDatetime,
    statusTypeCode: data?.statusTypeCode,
    statusTypeDesc: data?.statusTypeDesc,
    statusTypeDisplayName: data?.statusTypeDisplayName,
    createdBy: data?.createdBy,
    storeName: data?.storeName,
    districtRqId: data?.districtRqId,
    districtName: data?.districtName,
    regionRqId: data?.regionRqId,
    regionName: data?.regionName,
    createdDateTime: data?.createdDateTime,
    areaName: data?.areaName,
    active: data?.active,
    activityNoticeTypeId: data?.activityNoticeTypeId,
    activityReasonTypeId: data?.activityReasonTypeId,
    showOnTimeline: data?.showOnTimeline,
    submittedBy: data?.submittedBy,
    userName: data?.userName,
    updatedByName: data?.updatedByName,
    updatedDatetime: data?.updatedDatetime,
    excessiveInfractionFlag: data?.excessiveInfractionFlag || false,
    noticeProvidedFlag: data?.noticeProvidedFlag || false,
    infractionStartTime: data?.infractionStartTime || "12:00",
    infractionEndTime: data?.infractionEndTime || "12:00",
  });
  const [initialLoad, setInitialLoad] = useState(true);
  const [reasonType, setReasonType] = useState([]);
  const [hasConductTypeChange, setHasConductTypeChange] = useState(0);
  const { accounts, instance } = useMsal();
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;
  useEffect(() => {
    setFormValidation([
      { key: "activityReasonTypeId", name: "Conduct Policy", isRequired: true },
      { key: "activityNoticeTypeId", name: "Conduct Type", isRequired: true },
      { key: "infractionDate", name: "Incident Date", isRequired: true },
      {
        key: "incidentDescription",
        name: "Incident Description",
        isRequired: true,
      },
      { key: "infractionCount", name: "Incident Count", isRequired: true },
    ]);
  }, []);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      dispatch({
        type: "INITIAL_FORM_DATA",
        form: { data: data, errors: errors },
        hasFormChanges: false,
      });
    } else {
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: {
          ...fcadState.form,
          data: formState,
          errors: errors,
        },
        hasFormChanges: true,
      });
    }
  }, [formState, formValidation]);

  const fetchReasonType = async (noticeTypeId) => {
    const reasonTypeList = await getApi(
      `${VITE_REACT_URL_API_PMC}/GetReasonType/5/${noticeTypeId}`,
      {
        "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (reasonTypeList?.length) {
      setReasonType(reasonTypeList);
    } else {
      setReasonType([]);
    }
  };
  useEffect(() => {
    if (data?.activityNoticeTypeId) {
      fetchReasonType(data?.activityNoticeTypeId);
    }
  }, [data?.activityNoticeTypeId]);

  useEffect(() => {
    // clear conduct policy on change of conduct Type
    if (hasConductTypeChange) {
      onInputChange({
        target: {
          value: "",
          name: "activityReasonTypeId",
        },
      });
    }
  }, [hasConductTypeChange]);

  const handleConductType = async (e) => {
    onInputChange(e);
    fetchReasonType(e.target.value?.toString());
    setHasConductTypeChange(hasConductTypeChange + 1);
  };

  const handleCountChange = async (e) => {
    // allow empty or numeric
    if (NumericValidator(e.target.value)) {
      onInputChange(e);
    }
  };

  const handleIncidentDescChange = async (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      onInputChange(e);
    }
  };

  const disabledFormControls =
    data?.activityStatusId === 2 ||
    data?.activityStatusId === 3 ||
    data?.activityStatusId === 15 ||
    data?.activityStatusId === 16;

  const flagOptions = [
    {
      value: false,
      label: "No",
    },
    {
      value: true,
      label: "Yes",
    },
  ];
  return (
    <Form className="FCADForm">
      <Form.Group>
        <Row>
          <Col xs={12} xl={6}>
            <DropDown
              id="activityNoticeTypeId"
              label="Conduct Type"
              placeholder="Select an Option"
              name="activityNoticeTypeId"
              options={conductType}
              value={activityNoticeTypeId?.toString() || ""}
              optionLabel="description"
              optionValue="activityNoticeTypeId"
              onInputChange={handleConductType}
              errors={errors}
              isDisabled={disabledFormControls}
            />
          </Col>
          <Col xs={12} xl={6}>
            <DropDown
              id="reasonType"
              label="Conduct Policy"
              placeholder="Select an Option"
              name="activityReasonTypeId"
              options={reasonType}
              optionLabel="description"
              optionValue="activityReasonTypeId"
              value={activityReasonTypeId}
              onInputChange={onInputChange}
              errors={errors}
              isDisabled={disabledFormControls}
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12} xl={6}>
            <Form.Label className="m-1">Incident Date:</Form.Label>
            <ReactDatePicker
              id="infractionDate"
              name="infractionDate"
              placeholder="mm/dd/yyyy"
              dateFormat="MM/dd/yyyy"
              className="form-control"
              startDate={
                infractionDate ? moment(infractionDate)?.toDate() : null
              }
              minDate={minDate}
              maxDate={new Date()}
              handleDateChange={(updatedDate) =>
                onInputChange({
                  target: {
                    name: "infractionDate",
                    value: updatedDate || null,
                  },
                })
              }
              errors={errors}
              key={`${moment(infractionDate)?.toDate()}`}
              disabled={disabledFormControls}
            />
          </Col>
        </Row>
        {activityNoticeTypeId === 10 && (
          <div>
            {activityReasonTypeId === 55 && (
              <div>
                <br />
                <Row>
                  <Col xs={12} xl={6}>
                    <Form.Label className="m-1">Scheduled Time:</Form.Label>
                    <ReactTimePicker
                      id="infractionStartTime"
                      name="infractionStartTime"
                      onChange={onInputChange}
                      value={infractionStartTime}
                      className="form-control"
                      disabled={disabledFormControls}
                    />
                  </Col>
                  <Col xs={12} xl={6}>
                    <Form.Label className="m-1">Actual Time:</Form.Label>
                    <ReactTimePicker
                      id="infractionEndTime"
                      name="infractionEndTime"
                      onChange={onInputChange}
                      value={infractionEndTime}
                      className="form-control"
                      disabled={disabledFormControls}
                    />
                  </Col>
                </Row>
              </div>
            )}
            <br />
            <Row>
              <Col xs={12} xl={12}>
                <DropDown
                  id="excessiveInfractionFlag"
                  label="Excessive Infractions?"
                  name="excessiveInfractionFlag"
                  options={flagOptions}
                  optionLabel="label"
                  optionValue="value"
                  value={excessiveInfractionFlag?.toString()}
                  onInputChange={onInputChange}
                  defaultValue={excessiveInfractionFlag || false}
                  isDisabled={disabledFormControls}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Col xs={12} xl={12}>
                  <DropDown
                    id="noticeProvidedFlag"
                    label="Was adequate notice given? (Adequate notice is 2 hours before scheduled start time)"
                    name="noticeProvidedFlag"
                    options={flagOptions}
                    optionLabel="label"
                    optionValue="value"
                    value={noticeProvidedFlag?.toString()}
                    onInputChange={onInputChange}
                    defaultValue={noticeProvidedFlag || false}
                    isDisabled={
                      disabledFormControls ||
                      (activityNoticeTypeId === 10 &&
                        activityReasonTypeId === 83)
                    }
                  />
                </Col>
              </Col>
            </Row>
          </div>
        )}
        <br></br>
        <Row>
          <Col xs={12}>
            <Alert variant="primary" className="alert">
              Further infractions to Victra's Policies and Procedures will
              result in further disciplinary action, up to and including
              termination.
            </Alert>
            <TextArea
              id="incidentDescription"
              rows={5}
              className="incident-desc-field"
              placeholder={
                formState.activityNoticeTypeId === 9 &&
                (formState.activityReasonTypeId === 44 ||
                  formState.activityReasonTypeId === 40)
                  ? salesProcessPlaceHolder
                  : "Incident Description"
              }
              maxLength={1000}
              name="incidentDescription"
              onInputChange={handleIncidentDescChange}
              value={incidentDescription || ""}
              disabled={disabledFormControls}
              errors={errors}
              floatText={
                formState.activityNoticeTypeId === 9 &&
                formState.activityReasonTypeId === 44
                  ? "Describe the incident and create a SAMO plan to correct using the space below:"
                  : "Please describe the incident that has taken place using space below:"
              }
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12}>
            <Alert variant="primary" className="alert">
              This employee has the following number of coaching events related
              to this specified policy and procedure.
            </Alert>
            <FormControl
              id="infractionCount"
              type="tel"
              maxLength={2}
              placeholder="Incident Count"
              name="infractionCount"
              value={infractionCount}
              onInputChange={handleCountChange}
              disabled={disabledFormControls}
              errors={errors}
            />
          </Col>
        </Row>
        <br />
      </Form.Group>
    </Form>
  );
};

export default FCADForm;
