import React, { useState, useEffect, useContext } from "react";
import { Alert, Form, Row, Col } from "react-bootstrap";
import "./PIP_EGET.scss";
import "../../../styles.scss";

import moment from "moment";
import {
  DropDown,
  ReactDatePicker,
  FormControl,
  TextArea,
} from "../../components";
import { useForm } from "../../../hooks/useForm";
import { LookupsContext } from "../../../DWN/provider";
import { AlphaNumericSpecialCharValidator } from "../../../validators";

export const PIP_EGET_Form = ({
  id = "add",
  data = {},
  pipegetState = null,
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
    activityNotes1,
    activityNotes2,
    activityNotes3,
    infractionDate,
    infractionCount,
    incidentDescription,
    title,
    titleId,
  } = useForm({
    activityNotes1: data?.activityNotes?.["0"]?.["notes"],
    activityNotes2: data?.activityNotes?.["1"]?.["notes"],
    activityNotes3: data?.activityNotes?.["2"]?.["notes"],

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
    activityNoticeTypeId: data?.activityNoticeTypeId || 1,
    activityReasonTypeId: data?.activityReasonTypeId || -1,
    showOnTimeline: data?.showOnTimeline,
    submittedBy: data?.submittedBy,
    userName: data?.userName,
    updatedByName: data?.updatedByName,
    updatedDatetime: data?.updatedDatetime,
    title: data?.title,
    titleId: data?.titleId,
  });

  const { noticeType } = useContext(LookupsContext);
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
          ...pipegetState.form,
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

  const handleNotes = async (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      onInputChange(e);
    }
  };

  const dataMonths = [
    {
      value: -1,
      label: "January",
    },
    {
      value: -2,
      label: "February",
    },
    {
      value: -3,
      label: "March",
    },
    {
      value: -4,
      label: "April",
    },
    {
      value: -5,
      label: "May",
    },
    {
      value: -6,
      label: "June",
    },
    {
      value: -7,
      label: "July",
    },
    {
      value: -8,
      label: "August",
    },
    {
      value: -9,
      label: "September",
    },
    {
      value: -10,
      label: "October",
    },
    {
      value: -11,
      label: "November",
    },
    {
      value: -12,
      label: "December",
    },
  ];

  return (
    <div>
      <hr></hr>
      <Form className="PIPEGETForm">
        <Form.Group>
          <div className="content">
            In an effort to help you improve your individual performance and
            assist you with meeting Victra's minimum company standards, this
            Performance Improvement Plan (PIP) has been created by your direct
            supervisor. Your failure to meet this PIP's requirements will result
            in further disciplinary action up to and including termination from
            employment.
          </div>
          <br></br>
          <hr></hr>
          <br></br>
          <h6 className="content">
            Specific: Your performance is in the bottom 10% of the company and
            is below the minimum company standards.
          </h6>
          <br></br>
          <Row>
            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="activityReasonTypeId"
                label="This is based on your EGET Composite score during the month of (Select Month)"
                placeholder="Select Month"
                name="activityReasonTypeId"
                value={activityReasonTypeId || 0}
                options={dataMonths || []}
                optionLabel="label"
                optionValue="value"
                onInputChange={onInputChange}
                isDisabled={disabledFormControls}
                defaultValue="1"
              />
            </Col>
            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="activityNoticeTypeId"
                label="This is your (1st, 2nd, or 3rd) PIP in a 180-day rolling period (Select # of Occurrences)"
                placeholder="Select # of Occurrences"
                name="activityNoticeTypeId"
                value={activityNoticeTypeId || 0}
                options={noticeType || []}
                optionLabel="description"
                optionValue="activityNoticeTypeId"
                onInputChange={onInputChange}
                isDisabled={disabledFormControls}
                defaultValue="1"
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <Form.Label className="m-1">Effective Date:</Form.Label>
              <ReactDatePicker
                id="effectiveDatetime"
                name="effectiveDatetime"
                placeholder="mm/dd/yyyy"
                dateFormat="MM/dd/yyyy"
                minDate={minDate}
                maxDate={maxDate}
                className="form-control"
                startDate={
                  effectiveDatetime ? moment(effectiveDatetime)?.toDate() : null
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
                key={`${moment(effectiveDatetime)?.toDate()}`}
                disabled={disabledFormControls}
              />
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs={12} md={12} sm={12} xl={12} lg={12}>
              <h6 className="content">
                Action 1 (Individual Responsibility): List 2-3 specific
                behaviors and strategies that will lead to improving
                performance.
              </h6>
              <TextArea
                id="activityNotes1"
                name="activityNotes1"
                rows={4}
                placeholder="Action 1 (Individual Responsibility): List 2-3 specific behaviors and strategies that will lead to improving performance."
                maxLength={1000}
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
              <h6 className="content">
                Action 2 (Manager Responsibility): List 2-3 specific behaviors
                and strategies that will lead to improving performance.
              </h6>
              <TextArea
                id="activityNotes2"
                name="activityNotes2"
                rows={4}
                placeholder="Action 2 (Manager responsibility): List 2-3 specific behaviors and strategies that will lead to improving performance."
                maxLength={1000}
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
              <h6 className="content">
                Measurable: Whether this PIP's requirements are satisfied will
                be measured by the results shown on the EGET Scorecard.
              </h6>
              <TextArea
                id="activityNotes3"
                name="activityNotes3"
                rows={4}
                placeholder="Measurable: Whether this PIP's requirements are satisfied will be measured by the results shown on the EGET Scorecard."
                maxLength={1000}
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
              <h6 className="content">
                Outcome: The employee must reach results that are at or above
                the minimum company standards. The results must remove the
                employee from the bottom 10%. Failure to do so (1) by the last
                date of a second consecutive PIP, or (2) by the last date of a
                third PIP in a rolling 180-day period, will result in
                termination from employment.
              </h6>
            </Col>
          </Row>
          <hr></hr>
          <Alert variant="danger">
            This Performance Improvement Plan is not intended to modify your
            at-will status; either you or Victra may terminate your employment
            at any time.
          </Alert>
          <br />
        </Form.Group>
      </Form>
    </div>
  );
};
