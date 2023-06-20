import React, { useState, useEffect } from "react";
import { ReactTable, CardHistorylog } from "../";
import moment from "moment";
import { useFetch } from "../../../hooks";
import { ErrorPage } from "../../pages/ErrorPage/ErrorPage";

const ActivityLog = ({ id }) => {
  const [onError, setOnError] = useState(null);
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  const [activityLogs, isLoadingActivityLogs, error] =
    id !== "add"
      ? useFetch(`${VITE_REACT_URL_API_PMC}/GetActivityLog/${id}`, {
          "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
        })
      : [[], false];
  const COLUMNS = [
    {
      label: "Status",
      className: "",
      renderCell: (item) => <span title={item.status}>{item.status}</span>,
    },
    {
      label: "Action User",
      className: "",
      renderCell: (item) => (
        <span title={item.changedBy}>{item.changedBy}</span>
      ),
    },
    {
      label: "Date of Activity",
      className: "",
      renderCell: (item) =>
        moment.utc(item?.timestamp).local().format("MM/DD/YYYY h:mm a"),
    },
  ];

  useEffect(() => {
    if (error) {
      setOnError(error);
    }
  }, [error]);

  return (
    <>
      <CardHistorylog
        title={"Activity Log"}
        showSeparator={false}
        headerClassName="headerRedColor"
      >
        {onError ? (
          <div className="p-4">
            <ErrorPage code={error} isTextMsg={true} />
          </div>
        ) : (
          <ReactTable
            pageSize={5}
            columns={COLUMNS}
            list={activityLogs || []}
            isLoading={isLoadingActivityLogs}
            customTheme={{
              Table: `--data-table-library_grid-template-columns: minmax(190px, 1fr) minmax(180px, 1fr) minmax(200px, 1fr);`,
            }}
            emptyLabel={"No Recent Activities"}
          />
        )}
      </CardHistorylog>
    </>
  );
};

export default ActivityLog;
