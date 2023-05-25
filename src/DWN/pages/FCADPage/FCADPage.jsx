import React, { useReducer, useState, useContext } from "react";
import queryString from "query-string";
import { useMsal } from "@azure/msal-react";
import { RoleContext, LookupsContext } from "../../provider";
import { CardHistorylog } from "../../components/CardHistoryLog/CardHistorylog";
import { CommonHistoryLog } from "../CommonHistoryLog";
import { useFetchJoin } from "../../../hooks";
import { PropSpiner, Breadcrumb } from "../../components";
import { CommonPage } from "../CommonComponent";
import FCADForm from "./FCADForm";
import FCADButtons from "./FCADButtons";
import { formReducer, initialState } from "../../../Reducer/FormReducer";
import { SAVED } from "../Constants";
import { ReactToast, EventModal } from "../../components";
import { AlertNoData } from "../../components/Alerts/AlertNoData";
import "../../../styles.scss";
import "./FCAD.scss";
import { useEffect } from "react";
import { getApi } from "../../../helpers";
import EmptyEvent from "../../data/EmptyEvent.json";
import { ErrorPage } from "../ErrorPage/ErrorPage";

const FCADPage = () => {
  const { id = "", ev = "" } = queryString.parse(location.search);
  const [fcadState, dispatch] = useReducer(formReducer, initialState);
  const [show, setShow] = useState(false);
  const [errshow, setErrShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [onError, setOnError] = useState(false);
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

  const [activityData, loading, error, employeeDetails] = useFetchJoin(
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
    if (error) {
      setOnError(error);
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    const checkDownlineManager = async () => {
      // if status is pending then call approve manager check
      if (
        activityData?.createdBy &&
        activityData.activityStatusId === 6 &&
        employeeDetails?.mdmWorkerId
      ) {
        const isApproveManager = await getApi(
          `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${activityData?.createdBy}/true`,
          { "x-functions-key": `${VITE_FUNCTION_KEY_VISION3}` },
          accounts,
          instance,
          impersonation,
          impersonEmail
        );
        setApproveManager(isApproveManager);
        if (!isApproveManager && employeeDetails?.mdmWorkerId) {
          const isUplineManager = await getApi(
            `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${employeeDetails?.mdmWorkerId}/false`,
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
  }, [employeeDetails?.mdmWorkerId, activityData]);

  return (
    <div className="row ">
      {show && (
        <EventModal
          formName={"FCAD"}
          action={action}
          employeeFullName={employeeDetails?.name}
          adpId={employeeDetails?.adpId}
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
          <div>
            {errorStatus ? (
              <ErrorPage
                code={errorStatus}
                className="error-toast-message"
                isTextMsg={true}
              />
            ) : null}
            {errorMessage ? (
              <div className="offwhite fw-normal mt-2">{errorMessage}</div>
            ) : null}
          </div>
        </ReactToast>
      )}
      {onError && !loading ? (
        <ErrorPage code={error} isTextMsg={true} />
      ) : (
        <>
          <div className="col-lg-8">
            <div className="form-container">
              <br />
              <Breadcrumb />
              <br />
              <CardHistorylog
                title={"Formal Coaching & Documentation"}
                className="cards"
                headerClassName="headerRedColor"
                showSeparator={false}
              >
                <div className="m-2">
                  {loading ? (
                    <div style={{ textAlign: "center" }}>
                      <PropSpiner label="Loading ..." />
                    </div>
                  ) : (
                    <div>
                      {employeeDetails ? (
                        <CommonPage
                          employeeDetails={employeeDetails}
                          activityData={activityData}
                          id={id}
                        />
                      ) : (
                        <AlertNoData />
                      )}
                      <br />
                      <hr />
                      <br />
                      {id === "add" || activityData ? (
                        <FCADForm
                          key={`${fcadState.form}`}
                          id={id}
                          conductType={lookupsContext?.conductType || []}
                          fcadState={fcadState}
                          dispatch={dispatch}
                          data={id === "add" ? EmptyEvent.FCAD : activityData}
                          impersonation={impersonation}
                          impersonEmail={impersonEmail}
                        />
                      ) : (
                        <AlertNoData />
                      )}
                      <hr />
                      <br />
                      {!loading && employeeDetails && (
                        <FCADButtons
                          key={`${fcadState?.form?.errors?.length}-${approveManager}-${uplineManager}`}
                          id={id}
                          data={activityData}
                          fcadState={fcadState}
                          employeeDetails={employeeDetails}
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
            </div>
          </div>
          <div className="col-lg-4">
            <div className="AlingHis">
              {!loading && employeeDetails && (
                <CommonHistoryLog
                  activityId={id}
                  mdmEmployeeId={employeeDetails?.mdmWorkerId || ev}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FCADPage;
