import React, { useEffect, useState, useReducer, useContext } from "react";
import { RoleContext, LookupsContext } from "../../provider";
import { CardHistorylog } from "../../components/CardHistoryLog/CardHistorylog";
import { CommonPage } from "../CommonComponent";
import queryString from "query-string";
import { useFetch, useFetchJoin } from "../../../hooks/";
import { AlertNoData } from "../../components/Alerts/AlertNoData";
import { PropSpiner, Breadcrumb } from "../../components";
import { MoveDemotionForm } from "./MoveDemotionForm";
import { CommonHistoryLog } from "./../CommonHistoryLog";
import EmptyEvent from "../../data/EmptyEvent.json";
import { useMsal } from "@azure/msal-react";
import { initialState, formReducer } from "../../../Reducer/FormReducer";
import { getApi } from "../../../helpers";
import MovDemButtons from "./MoveDemotionButtons";
import { SAVED } from "./MoveDemotionHelper";
import { ReactToast, EventModal } from "../../components";
//import { isThisUserHR, isThisUserHRProcss } from "../../helpers";
import "../../../styles.scss";
import "./MoveDemotionPage.scss";
import { ErrorPage } from "../ErrorPage/ErrorPage";

export const MoveDemotionPage = () => {
  const { id = "", ev = "" } = queryString.parse(location.search);
  const [movdemState, dispatch] = useReducer(formReducer, initialState);
  const [show, setShow] = useState(false);
  const [errshow, setErrShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [action, setAction] = useState(SAVED);
  const { accounts, instance } = useMsal();
  const lookupsContext = useContext(LookupsContext);
  const [newTitle, setnewTitle] = useState(false);
  const [newLoc, setNewLoc] = useState(false);
  const [moveTypeOnChange, setMoveTypeOnChange] = useState("");

  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------
  const {
    VITE_REACT_URL_API_PMC,
    VITE_EVENTS_FUNCTION_KEY_PMC,
    VITE_REACT_URL_API_VISION3,
    VITE_FUNCTION_KEY_VISION3,
  } = import.meta.env;

  const [DataHis, loading, error, DataPeople] = useFetchJoin(
    `${VITE_REACT_URL_API_PMC}/GetEventByActivityId/${id}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
    "mdmEmployeeId",
    `${VITE_REACT_URL_API_PMC}/GetEmployeeById/`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
    ev
  );

  useEffect(() => {
    const validateActivityNoticeTypeId = (value) => {
      if (value === 13 || value === 16) {
        setnewTitle(true);
        setNewLoc(true);
        setMoveTypeOnChange("for Demotion");
      } else if (value === 12 || value === 15) {
        setNewLoc(true);
        setnewTitle(false);
        setMoveTypeOnChange("for Move");
      } else {
        setNewLoc(false);
        setnewTitle(false);
        setMoveTypeOnChange("");
      }
    };

    validateActivityNoticeTypeId(DataHis?.activityNoticeTypeId);
  }, [DataHis?.activityNoticeTypeId]);

  const [uplineManager, setUplineManager] = useState(false);
  const [approveManager, setApproveManager] = useState(false);
  useEffect(() => {
    const checkDownlineManager = async () => {
      // if status is pending then call approve manager check
      if (DataHis?.createdBy && DataHis.activityStatusId === 5) {
        const isApproveManager = await getApi(
          `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${DataHis?.createdBy}/true`,
          { "x-functions-key": `${VITE_FUNCTION_KEY_VISION3}` },
          accounts,
          instance,
          impersonation,
          impersonEmail
        );

        const isThisUserHR = () => {
          const loginUserRoles = RoleCtx?.data?.roles?.length
            ? RoleCtx.data?.roles.map((role) => role.trim())
            : [];
          return loginUserRoles.includes("People HR Processors");
        };

        setApproveManager(isApproveManager);
        if (approveManager === false) {
          setApproveManager(isThisUserHR());
        }

        if (!isApproveManager && DataPeople?.mdmWorkerId) {
          const isUplineManager = await getApi(
            `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${DataPeople?.mdmWorkerId}/false`,
            { "x-functions-key": `${VITE_FUNCTION_KEY_VISION3}` },
            accounts,
            instance,
            impersonation,
            impersonEmail
          );
          setUplineManager(isUplineManager);
        }
      }
    };
    checkDownlineManager();
  }, [DataPeople?.mdmWorkerId, DataHis]);

  return (
    <div>
      <div className="row ">
        {show && (
          <EventModal
            formName={"MOVE"}
            action={action}
            employeeFullName={DataPeople?.name}
            adpId={DataPeople?.adpId}
          />
        )}
        {errshow && (
          <ReactToast
            title={`Error`}
            position={"top-center"}
            classbg="danger"
            handleClose={() => {
              setErrShow(false);
              setErrorMessage(null);
              setErrorStatus(null);
            }}
          >
            {errorStatus && (
              <ErrorPage
                code={errorStatus}
                className="error-toast-message"
                isTextMsg={true}
              />
            )}
            {errorMessage ? (
              <div className="offWhite fw-normal mt-2">{errorMessage}</div>
            ) : null}
          </ReactToast>
        )}
        <div className="col-lg-8">
          <div className="form-container">
            <br />
            <Breadcrumb />
            <br />
            <CardHistorylog
              title={"SCF - Move / Demotion"}
              headerClassName="headerRedColor"
              showSeparator={false}
            >
              <div className="m-2">
                {loading ? (
                  <div style={{ textAlign: "center" }}>
                    <PropSpiner label="Loading ..." />
                  </div>
                ) : DataPeople ? (
                  <CommonPage
                    employeeDetails={DataPeople}
                    activityData={DataHis}
                    id={id}
                  />
                ) : id === "add" ? (
                  <CommonPage
                    employeeDetails={null}
                    activityData={DataHis}
                    id={id}
                  />
                ) : (
                  <AlertNoData />
                )}

                {loading ? (
                  <div style={{ textAlign: "center" }}>
                    <PropSpiner label="Loading ..." />
                  </div>
                ) : (
                  <div>
                    {id === "add" || DataHis ? (
                      <MoveDemotionForm
                        key={`${movdemState.form}`}
                        id={id}
                        conductType={"conductType"}
                        movdemState={movdemState}
                        dispatch={dispatch}
                        data={id === "add" ? EmptyEvent.Move : DataHis}
                        impersonation={impersonation}
                        impersonEmail={impersonEmail}
                        newTitle={newTitle}
                        setnewTitle={setnewTitle}
                        newLoc={newLoc}
                        setNewLoc={setNewLoc}
                        moveTypeOnChange={moveTypeOnChange}
                        setMoveTypeOnChange={setMoveTypeOnChange}
                        loginUserDetails={RoleCtx}
                        locationLevelId={
                          id === "add"
                            ? DataPeople?.locationLevelId
                            : DataHis?.newLocationLevelId
                        }
                        levelType={
                          id === "add"
                            ? DataPeople?.levelType
                            : DataHis?.levelType
                        }
                        location={
                          id === "add"
                            ? DataPeople?.location
                            : DataHis?.location
                        }
                        levelTypeId={
                          id === "add"
                            ? DataPeople?.levelTypeId
                            : DataHis?.newLocationLevelTypeId
                        }
                        prevtitleId={
                          id === "add" ? DataPeople?.titleId : DataHis?.titleId
                        }
                        businessGroupId={DataPeople?.businessGroupId}
                      />
                    ) : (
                      <AlertNoData />
                    )}

                    {!loading && DataPeople && (
                      <MovDemButtons
                        key={`${movdemState?.form?.errors?.length}-${approveManager}-${uplineManager}`}
                        id={id}
                        data={DataHis}
                        movdemState={movdemState}
                        employeeDetails={DataPeople}
                        setShow={setShow}
                        setErrShow={setErrShow}
                        setAction={setAction}
                        uplineManager={uplineManager}
                        approveManager={approveManager}
                        dispatch={dispatch}
                        setErrorMessage={setErrorMessage}
                        setErrorStatus={setErrorStatus}
                      />
                    )}
                    <br />
                  </div>
                )}
              </div>
            </CardHistorylog>
            <br></br>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="AlingHis">
            {!loading && DataPeople && !movdemState?.form?.isFetching && (
              <CommonHistoryLog
                activityId={id}
                mdmEmployeeId={DataPeople?.mdmWorkerId || ev}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
