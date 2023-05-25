import React, { useEffect, useState } from "react";
import { CardHistorylog, PropSpiner } from "..";
import { useFetch } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import "./ActivityHistory.scss";
import { ErrorPage } from "../../pages/ErrorPage/ErrorPage"


const ActivityHistory = ({ id }) => {
  const [onError, setOnError] = useState(null);
  const navigate = useNavigate();
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;
  const [dataHistory, isLoadingHistory, error] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetActivityCountForEmployeeByType/${id}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC }
  );

  
  useEffect(() => {
    if (error) {
      setOnError(error);
    }
  }, [error]);


  const renderData = () => {
    if (dataHistory?.length) {
      return dataHistory?.map((item, index) => {
        return (
          <li key={`${item.activityTypeDescription}-${index}`}>
            <a
              href="#"
              onClick={() =>
                navigate(
                  `/profile?id=${id}&historySearch=${item?.activityDisplayName}`
                )
              }
            >
              {item.count}&nbsp;{item.activityTypeDescription}&nbsp;Event(s)
            </a>
          </li>
        );
      });
    } else {
      return <div className="not-data-yet">No History yet</div>;
    }
  };

  return (
    <CardHistorylog
      title={"History"}
      showSeparator={false}
      headerClassName="headerRedColor"
    >
      {isLoadingHistory ? (
        <div className="textAlignCenter">
          <PropSpiner label="loading" />
        </div>
      ) : (
        <div className="m-2">
          {onError && !isLoadingHistory ? (
            <ErrorPage code={error} isTextMsg = {true} />
          ) : (
            <>
              <label>
                This employee has the following activities in their profile. Click
                the desired link below to see their history.
              </label>
              {dataHistory?.length ? (
                <div className="list">
                  <ul>{renderData()}</ul>
                </div>
              ) : (
                <div className="no-history">No History yet</div>
              )}
            </>
          )}
        </div>
      )}
      <br />
    </CardHistorylog>
  );
};

export default ActivityHistory;
