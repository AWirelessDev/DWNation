import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useFetch } from "../../../hooks/useFetch";
import { useMsal } from "@azure/msal-react";
import moment from "moment";
import {
  DropDown,
  ReactDatePicker,
  TextArea,
  Fileupload,
} from "../../components";
import { useForm } from "../../../hooks/useForm";
import { deleteApi, getApi } from "../../../helpers";
import { AlphaNumericSpecialCharValidator } from "../../../validators";
import { isThisUserHRProcss, isThisUserHR } from "../../helpers";

const TerminationPageContent = ({
  id = "add",
  conductType = [],
  data = {},
  terminationState = null,
  dispatch = null,
  impersonation = false,
  impersonEmail = null,
  mdmWorkerId = null,
  loginUserDetails = {},
  setErrShow = null,
  setErrorMessage = null,
}) => {
  const hasApprovalPermisssion = isThisUserHRProcss();
  const hasUpdatePermission = isThisUserHR();

  //const minDate = moment().toDate();
  const minDate = moment().subtract(30, "days").toDate();
  const maxDate = moment().add(1, "months").toDate();

  const {
    formState,
    onInputChange,
    errors,
    formValidation,
    setFormValidation,
    effectiveDatetime,
    activityReasonTypeId,
    activityNoticeTypeId,
    activityDocuments,
    activityNotes,
    createdBy,
  } = useForm({
    activityNotes: data?.activityNotes?.length
      ? data?.activityNotes[0]["notes"]
      : "",
    activityDocuments: data?.activityDocuments,
    infractionDate: data?.infractionDate,
    infractionCount: data?.infractionCount,
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
  });
  const [initialLoad, setInitialLoad] = useState(true);
  const [reasonType, setReasonType] = useState([]);
  const { accounts, instance } = useMsal();
  const [noticeDocsStreamIds, setNoticeDocStreamIds] = useState([]);
  const [addDocsStreamIds, setAddDocStreamIds] = useState([]);
  const [docDisabled, setdocDisabled] = useState(false);
  const [hasConductTypeChange, setHasConductTypeChange] = useState(0);
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;
  useEffect(() => {
    setFormValidation([
      { key: "activityReasonTypeId", name: "Reason", isRequired: true },
      { key: "activityNoticeTypeId", name: "Notice", isRequired: true },
      { key: "effectiveDatetime", name: "Effective Date", isRequired: true },
      { key: "activityNotes", name: "Notes", isRequired: true },
    ]);
  }, []);

  useEffect(() => {
    if (activityNoticeTypeId === 11) {
      setdocDisabled(true);
    } else {
      setdocDisabled(false);
    }
  }, [activityNoticeTypeId]);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      dispatch({
        type: "INITIAL_FORM_DATA",
        form: {
          data: {
            ...data,
            activityNotes: data?.activityNotes?.length
              ? data?.activityNotes[0]["notes"]
              : "",
          },
          errors: errors,
        },
        hasFormChanges: false,
      });
    } else {
      const docs = [];
      if (addDocsStreamIds?.length)
        docs.push({
          streamId: addDocsStreamIds?.toString(),
          documentTypeId: 1,
        });
      if (noticeDocsStreamIds?.length)
        docs.push({
          streamId: noticeDocsStreamIds?.toString(),
          documentTypeId: 2,
        });
      const updateFormState = {
        ...formState,
        activityDocuments: docs,
      };
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: {
          ...terminationState.form,
          data: updateFormState,
          errors: errors,
        },
        hasFormChanges: true,
      });
    }
  }, [formState, formValidation, noticeDocsStreamIds, addDocsStreamIds]);

  const fetchReasonType = async (noticeTypeId) => {
    const reasonTypeList = await getApi(
      `${VITE_REACT_URL_API_PMC}/GetReasonType/4/${noticeTypeId}`,
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

  const handleConductType = async (e) => {
    await fetchReasonType(e.target.value?.toString());
    onInputChange(e);
    setHasConductTypeChange(hasConductTypeChange + 1);
  };
  const [employmentType] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetEmploymentTypes`,
    {
      "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
    }
  );
  const [addDocuments, setAddDocuments] = useState([]);
  const [noticeDocuments, setNoticeDocuments] = useState([]);

  useEffect(() => {
    const getDocumentDetails = async () => {
      const documents = await getApi(
        `${VITE_REACT_URL_API_PMC}/GetAttachmentDetails/${data?.activityId}`,
        {
          "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
        },
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      if (documents?.length) {
        const addDocs = documents.filter((doc) => doc.documentTypeId === 1);
        const noticeDocs = documents.filter((doc) => doc.documentTypeId === 2);
        setAddDocStreamIds(addDocs[0]?.streamId ? [addDocs[0]?.streamId] : []);
        setNoticeDocStreamIds(
          noticeDocs[0]?.streamId ? [noticeDocs[0]?.streamId] : []
        );
        setAddDocuments(addDocs);
        setNoticeDocuments(noticeDocs);
      }
    };
    if (data?.activityId) {
      getDocumentDetails();
    }
  }, [data?.activityId]);

  const disabledFormControls =
    data?.activityStatusId === 12 ||
    data?.activityStatusId === 3 ||
    data?.activityStatusId === 2 ||
    (data?.activityStatusId === 4 &&
      !(
        hasApprovalPermisssion ||
        hasUpdatePermission ||
        createdBy.toString() === loginUserDetails.data.mdmWorkerId.toString()
      ));

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

  const handleNotes = async (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      onInputChange(e);
    }
  };

  const getStreamId = async (name) => {
    let result = { fileStreamId: null, docTypeId: 0 };
    if (name === "addDocsStreamIds") {
      result = {
        fileStreamId: addDocsStreamIds[0],
        docTypeId: 1,
      };
    } else {
      result = {
        fileStreamId: noticeDocsStreamIds[0],
        docTypeId: 2,
      };
    }
    return result;
  };
  const handleDeleteFile = async (name) => {
    try {
      const { fileStreamId, docTypeId } = await getStreamId(name);
      const response = await deleteApi(
        `${VITE_REACT_URL_API_PMC}/DeleteAttachment`,
        {
          "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
        },
        accounts,
        instance,
        impersonation,
        impersonEmail,
        {
          activityId: data?.activityId || 0,
          streamId: fileStreamId,
          documentTypeId: docTypeId,
        }
      );
      if (response) {
        if (docTypeId === 1) {
          setAddDocStreamIds([]);
          setAddDocuments([]);
        } else {
          setNoticeDocStreamIds([]);
          setNoticeDocuments([]);
        }
      }
    } catch (e) {
      console.log(e.message);
      return;
    }
  };

  const handleDownloadFile = async (name) => {
    const { fileStreamId } = await getStreamId(name);
    try {
      const response = await getApi(
        `${VITE_REACT_URL_API_PMC}/GetAttachmentContent/${fileStreamId}`,
        {
          "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
        },
        accounts,
        instance,
        impersonation,
        impersonEmail
      );

      var a = document.createElement("a"); //Create <a>
      if (response.fileContentBase64) {
        a.href = "data:image/png;base64," + response.fileContentBase64; //Image Base64 Goes here
        a.download = response.fileName; //File name Here
        a.click();
      } else {
        setErrShow(true);
        setErrorMessage("File could not be found.");
      }
    } catch (e) {
      console.log(e.message);
      return;
    }
  };

  return (
    <Form className="TerminationForm">
      <Form.Group>
        <Row>
          <Col xs={12} xl={6}>
            <DropDown
              id="activityNoticeTypeId"
              label="Notice"
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
              label="Reason"
              placeholder="Select an Option"
              name="activityReasonTypeId"
              options={reasonType}
              optionLabel="description"
              optionValue="activityReasonTypeId"
              value={activityReasonTypeId?.toString() || ""}
              onInputChange={onInputChange}
              errors={errors}
              isDisabled={disabledFormControls}
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12} xl={6}>
            <Form.Label>Effective Date:</Form.Label>
            <ReactDatePicker
              id="effectiveDatetime"
              name="effectiveDatetime"
              placeholder="mm/dd/yyyy"
              dateFormat="MM/dd/yyyy"
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
              minDate={minDate}
              maxDate={maxDate}
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12}>
            <Form.Label>Notes:</Form.Label>
            <TextArea
              id="activityNotes"
              rows={4}
              placeholder="Notes"
              maxLength={1000}
              name="activityNotes"
              onInputChange={handleNotes}
              value={activityNotes || ""}
              disabled={disabledFormControls}
              errors={errors}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12} md={12} sm={12} xl={6} lg={12} className="uplo">
            <label className="m-2">Additional Attachment: </label>
            <div className="container m-2">
              <Fileupload
                name="addDocsStreamIds"
                streamIds={addDocsStreamIds}
                setStreamIds={setAddDocStreamIds}
                documents={addDocuments}
                setDocuments={setAddDocuments}
                disabled={disabledFormControls}
                mdmWorkerId={mdmWorkerId}
                handleDeleteFile={handleDeleteFile}
                handleDownloadFile={handleDownloadFile}
              />
            </div>
          </Col>
          {docDisabled && (
            <Col xs={12} md={12} sm={12} xl={6} lg={12} className="uplo">
              <label className="m-2">Received 2 Week Notice: </label>
              <div className="container m-2">
                <Fileupload
                  name="noticeDocsStreamIds"
                  streamIds={noticeDocsStreamIds}
                  setStreamIds={setNoticeDocStreamIds}
                  documents={noticeDocuments}
                  setDocuments={setNoticeDocuments}
                  disabled={disabledFormControls}
                  mdmWorkerId={mdmWorkerId}
                  handleDeleteFile={handleDeleteFile}
                  handleDownloadFile={handleDownloadFile}
                />
              </div>
            </Col>
          )}
        </Row>
      </Form.Group>
    </Form>
  );
};

export default TerminationPageContent;
