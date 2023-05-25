import React, { useReducer, useState, useContext } from "react";
import queryString from "query-string";
import { RoleContext, LookupsContext } from "../../provider";
import { CardHistorylog } from "../../components/CardHistoryLog/CardHistorylog";
import { CommonHistoryLog } from "../CommonHistoryLog";
import { useFetchJoin } from "../../../hooks";
import { PropSpiner, Breadcrumb } from "../../components";
import { CommonPage } from "../CommonComponent";
import TerminationPageContent from "./TerminationPageContent";
import TerminationPageButtons from "./TerminationPageButtons";
import { formReducer, initialState } from "../../../Reducer/FormReducer";
import { SAVED } from "../Constants";
import { ReactToast, EventModal } from "../../components";
import "../../../styles.scss";
import "./TerminationPage.scss";
import { ErrorPage } from "../ErrorPage/ErrorPage";

const TerminationPage = () => {
  const { id = "", ev = "" } = queryString.parse(location.search);
  const [show, setShow] = useState(false);
  const [errshow, setErrShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [action, setAction] = useState(SAVED);
  const lookupsContext = useContext(LookupsContext);
  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------
  const [terminationState, dispatch] = useReducer(formReducer, initialState);

  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  const [activityData, loading, error, employeeDetails] = useFetchJoin(
    `${VITE_REACT_URL_API_PMC}/GetEventByActivityId/${id}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
    "mdmEmployeeId",
    `${VITE_REACT_URL_API_PMC}/GetEmployeeById/`,
    { "x-functions-key": VITE_REACT_URL_API_PMC },
    ev
  );
  return (
    <div className="row ">
      {show && (
        <EventModal
          formName={"TERMINATION"}
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
            title={"Termination"}
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
                  {employeeDetails && (
                    <CommonPage
                      employeeDetails={employeeDetails}
                      activityData={activityData}
                      id={id}
                    />
                  )}
                  {(id === "add" || activityData?.activityId) && (
                    <TerminationPageContent
                      key={`${terminationState.form}`}
                      id={id}
                      conductType={lookupsContext?.terminationConductType || []}
                      terminationState={terminationState}
                      dispatch={dispatch}
                      data={id === "add" ? terminationState : activityData}
                      impersonation={impersonation}
                      impersonEmail={impersonEmail}
                      mdmWorkerId={employeeDetails?.mdmWorkerId || ev}
                      loginUserDetails={RoleCtx}
                      setErrShow={setErrShow}
                      setErrorMessage={setErrorMessage}
                    />
                  )}

                  <hr />
                  <br />
                  {!loading && employeeDetails && (
                    <TerminationPageButtons
                      key={`${terminationState?.form?.errors?.length}`}
                      id={id}
                      data={activityData}
                      terminationState={terminationState}
                      employeeDetails={employeeDetails}
                      setShow={setShow}
                      setErrShow={setErrShow}
                      setAction={setAction}
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
    </div>
  );
};

export default TerminationPage;
