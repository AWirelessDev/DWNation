import React, { useReducer, useState, useContext, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { RoleContext, LookupsContext } from "../../provider";
import { CardHistorylog } from "../../components/CardHistoryLog/CardHistorylog";
import { useFetchJoin } from "../../../hooks";
import { CommonPage } from "../CommonComponent";
import { EventModal, ReactToast } from "../../components";
import queryString from "query-string";
import { AlertNoData } from "../../components/Alerts/AlertNoData";
import { PropSpiner, Breadcrumb } from "../../components";
import { PIPCX_Form } from "./PIPCX_Form";
import { CommonHistoryLog } from "../CommonHistoryLog";
import EmptyEvent from "../../data/EmptyEvent.json";
import { formReducer, initialState } from "../../../Reducer/FormReducer";
import { SAVED } from "../Constants";
import { getApi } from "../../../helpers";
import PIPCX_Buttons from "./PIPCX_Buttons";
import "../../../styles.scss";
import "./PIPCX.scss";
import { ErrorPage } from "../ErrorPage/ErrorPage";

export const PIPCX = () => {
  const { id = "", ev = "" } = queryString.parse(location.search);
  const [pipcxState, dispatch] = useReducer(formReducer, initialState);
  const [show, setShow] = useState(false);
  const [errshow, setErrShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [action, setAction] = useState(SAVED);
  const { accounts, instance } = useMsal();
  const lookupsContext = useContext(LookupsContext);
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

  const [uplineManager, setUplineManager] = useState(false);
  const [approveManager, setApproveManager] = useState(false);

  useEffect(() => {
    const checkDownlineManager = async () => {
      // if status is pending then call approve manager check

      if (
        DataHis?.createdBy &&
        DataHis.activityStatusId === 6 &&
        DataPeople?.mdmWorkerId
      ) {
        const isApproveManager = await getApi(
          `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${DataHis?.createdBy}/true`,
          { "x-functions-key": `${VITE_FUNCTION_KEY_VISION3}` },
          accounts,
          instance,
          impersonation,
          impersonEmail
        );
        setApproveManager(isApproveManager);
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

  const [activityLogRefreshCount, setActivityLogRefreshCount] = useState(0);
  return (
    <div>
      <div className="row ">
        {show && (
          <EventModal
            formName={"PIP-CX"}
            action={action}
            employeeFullName={DataPeople?.name}
            adpId={DataPeople?.adpId}
          />
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
              {errorStatus && (
                <ErrorPage
                  code={errorStatus}
                  className="error-toast-message"
                  isTextMsg={true}
                />
              )}
              {errorMessage ? (
                <div className="offwhite fw-normal mt-2">{errorMessage}</div>
              ) : null}
            </div>
          </ReactToast>
        )}
        <div className="col-lg-8">
          <div className="form-container">
            <br />
            <Breadcrumb />
            <br />
            <CardHistorylog
              title={"Performance Improvement Plan - CX"}
              headerClassName="headerRedColor"
              showSeparator={false}
            >
              <div className="m-2">
                {loading ? (
                  <div className="text-center py-5">
                    <PropSpiner />
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
                  <div className="text-center py-5">
                    <PropSpiner />
                  </div>
                ) : (
                  <div>
                    {id === "add" || DataHis ? (
                      <PIPCX_Form
                        key={`${pipcxState.form}`}
                        id={id}
                        conductType={"conductType"}
                        pipcxState={pipcxState}
                        dispatch={dispatch}
                        data={id === "add" ? EmptyEvent.Move : DataHis}
                        impersonation={impersonation}
                        impersonEmail={impersonEmail}
                      />
                    ) : (
                      <AlertNoData />
                    )}

                    {!loading && DataPeople && (
                      <PIPCX_Buttons
                        key={`${pipcxState?.form?.errors?.length}-${approveManager}-${uplineManager}`}
                        id={id}
                        data={DataHis}
                        pipcxState={pipcxState}
                        DataPeople={DataPeople}
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
            {!loading && DataPeople && (
              <CommonHistoryLog
                key={`acivity-log-${activityLogRefreshCount}`}
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
