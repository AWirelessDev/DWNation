import React, { useEffect, useContext } from "react";
import { ReactTable, EventStatus, AlertType } from "../../../components";
import { useFetch } from "../../../../hooks/useFetch";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { addMonths } from "date-fns";
import { Filter } from "./Filter";
import { useMsal } from "@azure/msal-react";
import { RoleContext } from "../../../provider";
import { getApi } from "../../../../helpers";

const CustomersTable = ({ dispatch, dashboardState }) => {
  const navigate = useNavigate();
  const PRIORDATE = moment().subtract(30, "days").format("YYYY-MM-DD");
  const todaysDate = moment(new Date()).add(30, "days").format("YYYY-MM-DD");
  //----------BEGIN Impersonation-------------------------
  const { accounts, instance } = useMsal();
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation----------------------------

  const { VITE_REACT_URL_API_SUB, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;

  const [data, loading] = useFetch(
    `${VITE_REACT_URL_API_SUB}`,
    { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY }       
  );
 
  const formDataDispatch = (data) => {
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: {
        ...dashboardState.form,
        data: data,
      },
      hasFormChanges: true,
    });
  };

  useEffect(() => {
    formDataDispatch(data);
  }, [data]);

  // Search field related code
  const [search, setSearch] = React.useState("");

  /**
   *
   * @param {any} event
   */
  const handleSearch = (event) => {
    setSearch(event.target.value);    
  };

  // Date filter related code
  const [dateRange, setDateRange] = React.useState([
    moment(PRIORDATE).toDate(),
    moment(todaysDate).toDate(),
  ]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const fetchDateRange = async (startDate, endDate) => {
      let newStartDate = moment(startDate).format("YYYY-MM-DD");
      let newEndDate = moment(endDate).format("YYYY-MM-DD");

      const newFilterData = await getApi(       
        `${VITE_REACT_URL_API_SUB}`,
        { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY },
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      formDataDispatch(newFilterData);
    };
    if (startDate && endDate) {
      fetchDateRange(startDate, endDate);
    } else {
      formDataDispatch(data);
    }
  }, [startDate, endDate]);

  const renderFullAbbrevation = (value) => {
    let code;
    switch (value) {
      case "MOVE":
        code = "Move/Demotion";
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
      default:
        code = "-";
        break;
    }
    return code;
  };

  const handleDestination = (value) => {  
    return navigate(`/profile?phone=${value}`);
  };

   const EVENTS = [
    {
      id: 1,
      status: "Pending",      
      first_Name: "John",
      last_Name: "stone",
      mdn: "789456123"
    },
    {
      id: 2,
      status: "Active",      
      first_Name: "Jerry",
      last_Name: "Smith",
      mdn: "321654789"
    }
  ];

  const COLUMNS = [
    {
      label: "Status",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.mdn);
          }}
          title={item.status || "-"}
        >
          {
            <AlertType
            value={item.status == "ACTIVE" ? "Active": "Inactive"}
            customClassName="alter-adjustable"
          />
          }
        </a>
      ),
    },       
    {
      label: "First Name",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.mdn);
          }}
          title={item.first_Name || "-"}
        >
          {item.first_Name || "-"}
        </a>
      ),
    },
    {
      label: "Last Name",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.mdn);
          }}
          title={item.last_Name || "-"}
        >
          {item.last_Name || "-"}
        </a>
      ),
    },
    {
      label: "Phone",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.mdn);
          }}
          title={item.mdn || "-"}
        >
          {item.mdn || "-"}          
        </a>
      ),
    },
  ];

  const handleClear = () => {
    setSearch("");
    setDateRange([null, null]);
  };

  let filteredData = dashboardState.form.data;

  if (search) {
    filteredData = filteredData?.filter(
      (item) =>
        item.mdn?.includes(search) 
       // item.statusTypeDesc?.toLowerCase().includes(search.toLowerCase()) ||
        // item.displayName
        //   ?.toLowerCase()
        //   .replace(/\s+/g, "")
        //   .includes(search.toLowerCase()) ||        
    );
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  const exportToCsv = (e) => {
    e.preventDefault();
    // Headers for each column
    let headers = [
      "Activity Id, Status Type, Code, Description, User Name, Submitted By, Area, Region Name, District Name, Store Name",
    ];
    // Convert users data to a csv
    let eventsCsv = filteredData.reduce((acc, event) => {
      const {
        activityId,
        statusTypeDesc,
        displayName,
        noticeTypeDescription,
        userName,
        submittedBy,
        area,
        regionName,
        districtName,
        storeName,
      } = event;
      acc.push(
        [
          activityId,
          statusTypeDesc,
          displayName,
          noticeTypeDescription,
          userName,
          submittedBy,
          area,
          regionName,
          districtName,
          storeName,
        ].join(",")
      );
      return acc;
    }, []);

    downloadFile({
      data: [...headers, ...eventsCsv].join("\n"),
      fileName: `Events Report ${moment().format("LLL")}.csv`,
      fileType: "text/csv",
    });
  };
  return (
    <div className="dashboard-tab-body ">
      <Filter       
        search={search}
        handleSearch={handleSearch}
        searchPlaceholder={"Search"}
        handleClear={handleClear}       
        dispatch={dispatch}
        dashboardState={dashboardState}
      />
      <div className="dashboard-table">
        <ReactTable
          key={`${dashboardState?.form?.isFetchLoading}-${search}`}
          columns={COLUMNS}
          hasPagination
          list={filteredData || []}
         //list={EVENTS}
          pageSize={10}
          isLoading={loading || dashboardState?.form?.isFetchLoading}
          handleRowClick={(item) => {
            handleDestination(item.mdn);
          }}
          customTheme={{
            Table: `--data-table-library_grid-template-columns: minmax(130px, 0.2fr) minmax(150px, 0.5fr) minmax(150px, 0.5fr) minmax(150px, 0.5fr);`,
          }}
        />
      </div>
    </div>
  );
};

export default CustomersTable;