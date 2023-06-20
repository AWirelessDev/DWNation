import React, { useState } from "react";
import moment from "moment";
import InputGroup from "react-bootstrap/InputGroup";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  ReactTable,
  PropSpiner,
  AlertType,
  VisionToolTip,
} from "../../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ExportToCsv } from "export-to-csv";
import "./HistoryTable.scss";

export const HistoryTable = ({ DataHis = [], isLoading = false }) => {
  const DataHisToShow = DataHis?.length
    ? DataHis?.filter((DataHis) => DataHis.activityId > 0)
    : [];

  const navigate = useNavigate();
  const location = useLocation();
  const { id = "", historySearch = "" } = queryString.parse(location.search);
  // Search field related code
  const [search, setSearch] = React.useState(historySearch);

  /**
   *
   * @param {any} event
   */
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const renderFullAbbrevation = (value) => {
    let code;
    switch (value) {
      case "MOVE":
        code = "Move";
        break;
      case "TERM":
        code = "Termination";
        break;
      case "PIP":
        code = "PIP - EGET";
        break;
      case "LOA":
        code = "Leave Of Absence";
        break;
      case "FCAD":
        code = "FCAD";
        break;
      case "RIS":
        code = "PIP - CX";
        break;
      case "HIRE":
        code = "Hire";
        break;
      default:
        code = "";
        break;
    }
    return code;
  };

  const handleDestination = (value, ActId = null) => {
    let navTo;
    let caseV = ActId ? value : value.code;
    let caseId = ActId ? ActId : value.activityId;

    switch (caseV) {
      case "MOVE":
        navTo = navigate(`/movedemotion?id=${caseId}`);
        break;
      case "TERM":
        navTo = navigate(`/termination?id=${caseId}`);
        break;
      case "PIP":
        navTo = navigate(`/pip?id=${caseId}`);
        break;
      case "LOA":
        navTo = navigate(`/loa?id=${caseId}`);
        break;
      case "FCAD":
        navTo = navigate(`/fcad?id=${caseId}`);
        break;
      case "RIS":
        navTo = navigate(`/pipcx?id=${caseId}`);
        break;
      default:
        navTo = "";
        break;
    }
    return navTo;
  };

  let filteredData = DataHisToShow;
  if (filteredData) {
    filteredData = filteredData
      .sort((a, b) => {
        return (
          new Date(a.effectiveDatetime).getTime() -
          new Date(b.effectiveDatetime).getTime()
        );
      })
      .reverse();

    if (search) {
      filteredData = filteredData?.filter(
        (event) =>
          event.userName?.toLowerCase().includes(search.toLowerCase()) ||
          event.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
          event.displayName
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(search.toLowerCase().replace(/\s+/g, "")) ||
          event.statusTypeDesc?.toLowerCase().includes(search.toLowerCase()) ||
          event.updatedByName?.toLowerCase().includes(search.toLowerCase())
      );
    }
  }

  const COLUMNS = [
    {
      label: "Type",
      className: "",
      renderCell: (item) => (
        <AlertType
          value={renderFullAbbrevation(item.code) || "-"}
          customClassName="alter-adjustable"
          displayName={item.displayName}
        />
      ),
    },
    {
      label: "Submitted By",
      className: "",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.code, item.activityId);
          }}
        >
          {item.submittedBy || "-"}
        </a>
      ),
    },
    {
      label: "Submitted Date",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.code, item.activityId);
          }}
        >
          {moment(item.createdDateTime.substring(0, 10)).format("MM/DD/YYYY")}
        </a>
      ),
    },
    {
      label: "Status",
      className: "",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.code, item.activityId);
          }}
        >
          {item.statusTypeDesc || "-"}
        </a>
      ),
    },
    {
      label: "Effective Date",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.code, item.activityId);
          }}
        >
          {moment(item.effectiveDatetime.substring(0, 10)).format("MM/DD/YYYY")}
        </a>
      ),
    },
  ];

  const exportToCsv = (e) => {
    e.preventDefault();
    // Headers for each column
    let headers = [
      "Type, Name, ADP ID, Submitted By,  Submitted Date, Status, Effective Date, Reason Type",
    ];
    // Convert users DataHis to a csv
    let eventsCsv = filteredData.reduce((acc, event) => {
      const {
        displayName,
        userName,
        adpId,
        submittedBy,
        createdDateTime,
        statusTypeDesc,
        effectiveDatetime,
        reasonTypeDescription,
      } = event;
      acc.push([
        displayName,
        userName,
        adpId,
        submittedBy,
        moment(createdDateTime.substring(0, 10)).format("MM/DD/YYYY"),
        statusTypeDesc,
        moment(effectiveDatetime.substring(0, 10)).format("MM/DD/YYYY"),
        reasonTypeDescription,
      ]);
      return acc;
    }, []);

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      filename: `History Events Report ${eventsCsv[0][1] || "-"}`,
      headers: headers,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(eventsCsv);
  };
  const [isScroll, setStopScroll] = useState(true);
  React.useEffect(() => {
    if (
      isScroll &&
      historySearch &&
      DataHisToShow?.length &&
      document.getElementById("historyTable")
    ) {
      window.scrollTo({
        left: 0,
        top: document.getElementById("historyTable")?.offsetTop,
        behavior: "smooth",
      });
    }
  }, [DataHisToShow, isScroll]);
  return (
    <div onBlur={() => setStopScroll(false)}>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <PropSpiner label="Loading ..." />
        </div>
      ) : DataHisToShow ? (
        <div id="historyTable">
          <div className="history-table-search-block gap-2">
            <div className="d-flex">
              {filteredData.length === 0 ? (
                <VisionToolTip
                  text={
                    "Report cannot be generated as there are no records to display."
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    id="csv2"
                    disabled={filteredData.length === 0}
                  >
                    Create Report
                  </button>
                </VisionToolTip>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={exportToCsv}
                  id="csv2"
                >
                  Create Report
                </button>
              )}
            </div>
            <div className="d-flex">
              <InputGroup className="history-search-box">
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder={"Search"}
                  className="search-input"
                />
                <InputGroup.Text id="search" className="inputGroupHeight">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className="history-table">
            <ReactTable
              key={filteredData?.length}
              columns={COLUMNS}
              hasPagination
              list={filteredData || []}
              pageSize={5}
              isLoading={isLoading}
              handleRowClick={(item) => {
                handleDestination(item);
              }}
              customTheme={{
                Table: `--data-table-library_grid-template-columns: minmax(80px, 1fr) minmax(150px, 1fr) minmax(50px, 1fr) minmax(300px, 1fr) minmax(50px, 1fr);`,
              }}
              emptyLabel="No History yet"
            />
          </div>
          <br />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default HistoryTable;
