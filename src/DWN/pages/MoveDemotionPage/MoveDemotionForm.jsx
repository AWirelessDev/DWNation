import React, { useState, useEffect, useContext } from "react";
import { Alert, Form, Row, Col } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";
import "./MoveDemotionPage.scss";
import "../../../styles.scss";

import moment from "moment";
import {
  DropDown,
  ReactDatePicker,
  FormControl,
  TextArea,
} from "../../components";
import { useForm } from "../../../hooks/useForm";
import { getApi } from "../../../helpers";
import { LookupsContext } from "../../../DWN/provider";
import { AlphaNumericSpecialCharValidator } from "../../../validators";
import { isThisUserHRProcss, isThisUserHR } from "../../helpers";

export const MoveDemotionForm = ({
  id = "add",
  data = {},
  movdemState = null,
  dispatch = null,
  impersonation = false,
  impersonEmail = null,
  newTitle,
  setnewTitle,
  newLoc,
  setNewLoc,
  moveTypeOnChange,
  setMoveTypeOnChange,
  loginUserDetails = {},
  locationLevelId,
  levelTypeId,
  prevtitleId,
  businessGroupId,
}) => {
  const hasApprovalPermisssion = isThisUserHR();
  const hasUpdatePermission = isThisUserHRProcss();
  const {
    formState,
    onInputChange,
    onParentChange,
    onResetForm,
    setErrors,
    errors,
    formValidation,
    setFormValidation,
    setFormState,
    activityId,
    code,
    displayName,
    activityTypeId,
    mdmEmployeeId,
    newLocationLevelId,
    newLocationLevelTypeId,
    newTitleId,
    supervisorMDMWorkerId,
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
    newBusinessGroupId,
  } = useForm({
    activityNotes: data?.activityNotes?.["0"]?.["notes"],
    infractionDate: data?.infractionDate,
    infractionCount: data?.infractionCount,
    incidentDescription: data?.incidentDescription,
    activityId: data?.activityId,
    code: data?.code,
    displayName: data?.displayName,
    activityTypeId: data?.activityTypeId,
    mdmEmployeeId: data?.mdmEmployeeId,
    newLocationLevelId:
      data?.newLocationLevelId === undefined
        ? locationLevelId
        : data?.newLocationLevelId,
    newLocationLevelTypeId:
      data?.newLocationLevelTypeId === undefined
        ? levelTypeId
        : data?.newLocationLevelTypeId,
    newBusinessGroupId:
      data?.newBusinessGroupId === undefined
        ? businessGroupId
        : data?.newBusinessGroupId,
    newTitleId: data?.newTitleId === undefined ? prevtitleId : data?.newTitleId,
    supervisorMDMWorkerId: data?.supervisorMDMWorkerId,
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
  });

  const { moveType, EmploymentTypes, positions, businessGroupType } =
    useContext(LookupsContext);
  const [initialLoad, setInitialLoad] = useState(true);
  const [locationLevel, setLocationLevel] = useState([]);
  const [locationLevelTypeList, setLocationLevelTypeList] = useState([]);
  const [MoveLevelType, setMoveLevelType] = useState(false);
  const [levelLoading, setLevelLoading] = useState(false);
  const [locationLevelLoading, setLocationLevelLoading] = useState(false);
  const { accounts, instance } = useMsal();
  const { VITE_FUNCTION_KEY_MDM, VITE_REACT_URL_API_MDM } = import.meta.env;

  //const minDate = moment().toDate();
  const minDate = moment().subtract(30, "days").toDate();
  const maxDate = moment().add(1, "months").toDate();
  const MOVE_IN_STATE = 12;
  const DEMOTION_IN_STATE = 13;
  const MOVE_OUT_OF_STATE = 15;
  const DEMOTION_OUT_OF_STATE = 16;

  useEffect(() => {
    setFormValidation([
      {
        key: "newLocationLevelId",
        name: "Move Type",
        isRequired: true,
      },
      { key: "newTitleId", name: "Move Type", isRequired: newTitle || false },
      { key: "activityNoticeTypeId", name: "Move Type", isRequired: true },
      { key: "effectiveDatetime", name: "Effective Date", isRequired: true },
      {
        key: "activityNotes",
        name: `Reason ${moveTypeOnChange}`,
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
            activityNotes: data?.activityNotes?.["0"]?.["notes"],
          },
          errors: errors,
        },
        hasFormChanges: false,
      });
    } else {
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: {
          ...movdemState.form,
          data: formState,
          errors: errors,
        },
        hasFormChanges: true,
      });
    }
  }, [formState, formValidation]);

  const fetchLocationLevelType = async () => {
    setLocationLevelTypeList([]);
    setLevelLoading(true);
    const locationLevelTypeList = await getApi(
      `${VITE_REACT_URL_API_MDM}/GetLocationLevelTypeLookup/${newBusinessGroupId}`,
      {
        "x-functions-key": VITE_FUNCTION_KEY_MDM,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (locationLevelTypeList?.length) {
      setLocationLevelTypeList(locationLevelTypeList);
      setLevelLoading(false);
    } else {
      setLocationLevelTypeList([]);
      setLevelLoading(false);
    }
  };

  useEffect(() => {
    if (!!newBusinessGroupId) {
      fetchLocationLevelType();
    }
    if (!newBusinessGroupId || !businessGroupId) {
      onInputChange({
        target: {
          value: "",
          name: "newLocationLevelTypeId",
        },
      });
    }
  }, [newBusinessGroupId]);

  const fetchLocationbyLevel = async (LocationLevelTypeId) => {
    if (!!newBusinessGroupId) {
      setLocationLevelLoading(true);
      const locationLevelList = await getApi(
        `${VITE_REACT_URL_API_MDM}/GetLocationLevels/${LocationLevelTypeId}/${newBusinessGroupId}`,
        {
          "x-functions-key": VITE_FUNCTION_KEY_MDM,
        },
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      if (locationLevelList?.length) {
        setLocationLevel(locationLevelList);
        setLocationLevelLoading(false);
      } else {
        setLocationLevel([]);
      }
    }
  };

  useEffect(() => {
    if (!!newLocationLevelTypeId) {
      if (!initialLoad) {
        if (newLocationLevelTypeId !== levelTypeId) {
          onInputChange({
            target: {
              value: "",
              name: "newLocationLevelId",
            },
          });
        } else if (newLocationLevelTypeId === levelTypeId) {
          onInputChange({
            target: {
              value: locationLevelId,
              name: "newLocationLevelId",
            },
          });
        }
      }
      fetchLocationbyLevel(newLocationLevelTypeId);
    }
  }, [newLocationLevelTypeId]);

  const handleMoveType = async (e) => {
    onInputChange(e);

    if (
      e.target.value === DEMOTION_IN_STATE ||
      e.target.value === DEMOTION_OUT_OF_STATE
    ) {
      setnewTitle(true);
      setMoveTypeOnChange(" for Demotion");
      setMoveLevelType(false);

      setFormValidation((prevState) => [
        ...prevState,
        { key: "newTitleId", name: "New Title", isRequired: true },
      ]);
    } else if (
      e.target.value === MOVE_IN_STATE ||
      e.target.value === MOVE_OUT_OF_STATE
    ) {
      setnewTitle(false);
      setMoveTypeOnChange(" for Move");
      setMoveLevelType(true);

      setFormValidation((prevState) => [
        ...prevState,
        { key: "newTitleId", name: "New Title", isRequired: false },
      ]);
    } else {
      setNewLoc(false);
      setnewTitle(false);
      setMoveTypeOnChange("");
      setMoveLevelType(false);
    }
  };

  const handleLocationsByLevel = async (e) => {
    onInputChange(e);
    fetchLocationbyLevel(e.target.value?.toString());
  };

  const handleActivityNotes = async (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      onInputChange(e);
    }
  };

  const disabledFormControls =
    data?.activityStatusId === 13 ||
    data?.activityStatusId === 3 ||
    data?.activityStatusId === 8 ||
    (data?.activityStatusId === 5 &&
      !(
        hasApprovalPermisssion ||
        hasUpdatePermission ||
        createdBy.toString() === loginUserDetails.data.mdmWorkerId.toString()
      ));

  const ShowNewT =
    data?.activityNoticeTypeId === DEMOTION_IN_STATE ||
    data?.activityNoticeTypeId === DEMOTION_OUT_OF_STATE
      ? true
      : false;

  useEffect(() => {
    if (!initialLoad) {
      onParentChange(
        "newLocationLevelTypeId",
        levelTypeId,
        "newLocationLevelId",
        locationLevelId
      );
      fetchLocationbyLevel(levelTypeId);
    }
  }, [activityNoticeTypeId]);
  return (
    <div>
      <hr></hr>

      <Form className="movedemotionForm">
        <Form.Group className="px-2">
          <Row>
            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="activityNoticeTypeId"
                label="Move Type"
                placeholder="Select an Option"
                name="activityNoticeTypeId"
                value={activityNoticeTypeId?.toString() || ""}
                options={moveType || []}
                optionLabel="description"
                optionValue="activityNoticeTypeId"
                onInputChange={handleMoveType}
                errors={errors}
                isDisabled={disabledFormControls}
              />
            </Col>
            <Col xs={12} md={12} sm={12} xl={6} lg={12} className="rfm">
              <Form.Label className="m-1">Effective Date:</Form.Label>
              <ReactDatePicker
                id="effectiveDatetime"
                name="effectiveDatetime"
                placeholder="mm/dd/yyyy"
                dateFormat="MM/dd/yyyy"
                minDate={minDate}
                maxDate={maxDate}
                className="form-control m-0 mt-2 "
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

            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="newBusinessGroupId"
                label="Business Group"
                placeholder="Select an Option"
                name="newBusinessGroupId"
                value={newBusinessGroupId?.toString() || businessGroupId}
                options={businessGroupType || []}
                optionLabel="businessGroupName"
                optionValue="mdmBusinessGroupId"
                onInputChange={onInputChange}
                errors={errors}
                isDisabled={disabledFormControls || businessGroupId}
              />
            </Col>

            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="employmentTypeId"
                label="Change in Employment Type"
                placeholder="Select an Option"
                name="employmentTypeId"
                value={employmentTypeId?.toString() || "1"}
                defaultValue="1"
                options={EmploymentTypes || []}
                optionLabel="description"
                optionValue="employmentTypeId"
                onInputChange={onInputChange}
                errors={errors}
                isDisabled={disabledFormControls}
              />
            </Col>
            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="newLocationLevelTypeId"
                label="Level"
                placeholder={levelLoading ? "Loading..." : "Select an Option"}
                name="newLocationLevelTypeId"
                value={newLocationLevelTypeId?.toString()}
                options={locationLevelTypeList || []}
                optionLabel="lookupName"
                optionValue="lookupValuePK"
                onInputChange={handleLocationsByLevel}
                errors={errors}
                isDisabled={
                  disabledFormControls ||
                  (!businessGroupId ? false : MoveLevelType)
                }
                defaultValue={levelTypeId || ""}
              />
            </Col>

            <Col xs={12} md={12} sm={12} xl={6} lg={12}>
              <DropDown
                id="newLocationLevelId"
                label="New Location"
                placeholder={
                  locationLevelLoading ? "Loading..." : "Select an Option"
                }
                name="newLocationLevelId"
                value={newLocationLevelId?.toString()}
                options={locationLevel || []}
                optionLabel="locationName"
                optionValue="mdmLocationLevelId"
                onInputChange={onInputChange}
                errors={errors}
                isDisabled={disabledFormControls}
                // defaultValue={locationLevelId?.lookupValuePK?.toString() || ""}
              />
            </Col>

            {newTitle ? (
              <Col xs={12} md={12} sm={12} xl={6} lg={12}>
                <DropDown
                  id="newTitleId"
                  label="New Title"
                  placeholder="Select an Option"
                  name="newTitleId"
                  value={newTitleId?.toString() || prevtitleId}
                  //value={newTitleId ? newTitleId.toString() : prevtitleId.toString()}
                  options={positions || []}
                  optionLabel="lookupName"
                  optionValue="lookupValuePK"
                  onInputChange={onInputChange}
                  errors={errors}
                  isDisabled={disabledFormControls}
                  //defaultValue={newTitleId === null || newTitleId === undefined ? prevtitleId.toString() : undefined}
                />
              </Col>
            ) : (
              ""
            )}

            <Col xs={12} md={12} sm={12} xl={12} lg={12}>
              <Form.Label className="mt-3">
                {moveTypeOnChange && !moveTypeOnChange.endsWith(":")
                  ? `Reason ${moveTypeOnChange}:`
                  : "Reason:"}
              </Form.Label>
              <TextArea
                id="activityNotes"
                name="activityNotes"
                rows={4}
                placeholder={`Reason${moveTypeOnChange}`}
                maxLength={1000}
                onInputChange={handleActivityNotes}
                value={activityNotes || ""}
                disabled={disabledFormControls}
                errors={errors}
              />
            </Col>
          </Row>
        </Form.Group>
        <hr />
      </Form>
    </div>
  );
};
