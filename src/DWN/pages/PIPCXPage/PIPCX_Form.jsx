import React, { useState, useEffect } from "react";
import { Alert, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import { DropDown, ReactDatePicker, TextArea } from "../../components";
import { useForm } from "../../../hooks/useForm";
import { AlphaNumericSpecialCharValidator } from "../../../validators";

export const PIPCX_Form = ({
  id = "add",
  conductType = [],
  data = {},
  pipcxState = null,
  dispatch = null,
  impersonation = false,
  impersonEmail = null,
}) => {
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
    employmentTypeId,
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
    title,
    titleId,
    activityQuarter,
    activityNotes1, // action1
    activityNotes2, // action2
    activityNotes3, //measurable field
  } = useForm({
    activityNotes1: data?.activityNotes?.["0"]?.["notes"] || "",
    activityNotes2: data?.activityNotes?.["1"]?.["notes"] || "",
    activityNotes3: data?.activityNotes?.["2"]?.["notes"] || "",
    infractionDate: data?.infractionDate,
    infractionCount: data?.infractionCount,
    incidentDescription: data?.incidentDescription,
    activityId: data?.activityId,
    code: data?.code,
    displayName: data?.displayName,
    activityTypeId: data?.activityTypeId,
    mdmEmployeeId: data?.mdmEmployeeId,
    activityStatusId: data?.activityStatusId,
    effectiveDatetime: data?.effectiveDatetime?.split("T")[0],
    employmentTypeId: data?.employmentTypeId?.toString().replace("0", "1"),
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
    title: data?.title,
    titleId: data?.titleId,
    activityQuarter: data?.activityQuarter,
  });

  const [initialLoad, setInitialLoad] = useState(true);

  const minDate = moment().toDate();
  const maxDate = moment().add(1, "months").toDate();

  useEffect(() => {
    setFormValidation([
      {
        key: "effectiveDatetime",
        name: "Effective Date",
        isRequired: true,
      },
      {
        key: "activityQuarter",
        name: "This field",
        isRequired: true,
      },
      {
        key: "activityNotes1",
        name: "This field",
        isRequired: true,
      },
      {
        key: "activityNotes2",
        name: "This field",
        isRequired: true,
      },
      {
        key: "activityNotes3",
        name: "This field",
        isRequired: true,
      },
    ]);
  }, []);
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      dispatch({
        type: "INITIAL_FORM_DATA",
        form: {
          data: {
            ...data,
            activityNotes1: data?.activityNotes?.["0"]?.["notes"],
            activityNotes2: data?.activityNotes?.["1"]?.["notes"],
            activityNotes3: data?.activityNotes?.["2"]?.["notes"],
          },
          errors: errors,
        },
        hasFormChanges: false,
      });
    } else {
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: {
          ...pipcxState.form,
          data: formState,
          errors: errors,
        },
        hasFormChanges: true,
      });
    }
  }, [formState, formValidation]);

  const disabledFormControls =
    data?.activityStatusId === 2 ||
    data?.activityStatusId === 3 ||
    data?.activityStatusId === 15 ||
    data?.activityStatusId === 16;

  const cunrea = [
    {
      value: 0,
      label: "Select Quarter",
    },
    {
      value: 1,
      label: "Q1",
    },
    {
      value: 2,
      label: "Q2",
    },
    {
      value: 3,
      label: "Q3",
    },
    {
      value: 4,
      label: "Q4",
    },
  ];

  const handleNotes = async (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      onInputChange(e);
    }
  };
  return (
    <div>
      <hr></hr>
      <Form className="PIPCXForm">
        <Form.Group>
          <div className="content m-0 px-2">
            In an effort to help you improve your individual performance and
            assist you with meeting Victra's minimum company standards, this
            Performance Improvement Plan (PIP) has been created by your direct
            supervisor. Your failure to meet this PIP's requirements will result
            in further disciplinary action up to and including termination from
            employment.
          </div>
          <hr></hr>
          <div className="px-md-2">
            <h6 className="content ms-lg-0">
              Specific: Your CX score is below 60% for the quarter and is below
              the minimum company standards for Sales Consultants.
            </h6>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <Form.Label className="m-1">Effective Date:</Form.Label>
                <ReactDatePicker
                  id="effectiveDatetime"
                  name="effectiveDatetime"
                  placeholder="mm/dd/yyyy"
                  dateFormat="MM/dd/yyyy"
                  maxDate={maxDate}
                  minDate={minDate}
                  className="form-control"
                  startDate={
                    pipcxState?.form?.data?.effectiveDatetime
                      ? moment(
                          pipcxState?.form?.data?.effectiveDatetime
                        )?.toDate()
                      : null
                  }
                  handleDateChange={(updatedDate) =>
                    onInputChange({
                      target: {
                        name: "effectiveDatetime",
                        value: updatedDate || null,
                      },
                    })
                  }
                  errors={errors}
                  key={`${moment(
                    pipcxState?.form?.data?.effectiveDatetime
                  )?.toDate()}`}
                  disabled={disabledFormControls}
                />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <p>
                  This is based on your CX score during the (dropdown) quarter.{" "}
                  <span className="text-danger fw-semibold">
                    This serves as your First and Final Notice
                  </span>
                </p>
                <DropDown
                  id="activityQuarter"
                  label="The duration of this CX PIP is for 90 days."
                  name="activityQuarter"
                  value={activityQuarter}
                  options={cunrea || []}
                  placeholder="Select Quarter"
                  optionLabel="label"
                  optionValue="value"
                  onInputChange={onInputChange}
                  errors={errors}
                  isDisabled={disabledFormControls}
                />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <h6 className="content ms-lg-0">
                  Action 1 (Individual Responsibility): List 2-3 specific
                  behaviors and strategies that will lead to improving
                  performance.
                </h6>
                <TextArea
                  id="activityNotes1"
                  rows={4}
                  placeholder="Action 1 (Individual Responsibility): List 2-3 specific behaviors and strategies that will lead to improving performance."
                  maxLength={1000}
                  name="activityNotes1"
                  onInputChange={handleNotes}
                  value={activityNotes1 || ""}
                  disabled={disabledFormControls}
                  errors={errors}
                />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <h6 className="content ms-lg-0">
                  Action 2 (Manager Responsibility): List 2-3 specific behaviors
                  and strategies that will lead to improving performance.
                </h6>
                <TextArea
                  id="activityNotes2"
                  rows={4}
                  placeholder="Action 2 (Manager responsibility): List 2-3 specific behaviors and strategies that will lead to improving performance."
                  maxLength={1000}
                  name="activityNotes2"
                  onInputChange={handleNotes}
                  value={activityNotes2 || ""}
                  disabled={disabledFormControls}
                  errors={errors}
                />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <h6 className="content ms-lg-0">
                  Measurable: Whether this PIP's requirements are satisfied will
                  be measured by the results shown on the CX report.
                </h6>
                <TextArea
                  id="activityNotes3"
                  rows={4}
                  placeholder="Measurable: Whether this PIP's requirements are satisfied will be measured by the results shown on the CX report."
                  maxLength={1000}
                  name="activityNotes3"
                  onInputChange={handleNotes}
                  value={activityNotes3 || ""}
                  disabled={disabledFormControls}
                  errors={errors}
                />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12} md={12} sm={12} xl={12} lg={12}>
                <h6 className="content ms-lg-0">
                  Outcome: The employee must reach results that are at or above
                  the minimum company standards. The results must move the
                  Store's CX Score above 60%. Failure to do so will result in
                  further disciplinary action up to and including termination
                  from employment.
                </h6>
              </Col>
            </Row>
          </div>
          <hr></hr>

          <div className="px-md-3">
            <Alert variant="danger">
              This Performance Improvement Plan is not intended to modify your
              at-will status; either you or Victra may terminate your employment
              at any time.
            </Alert>
          </div>
          <br />
        </Form.Group>
      </Form>
    </div>
  );
};
