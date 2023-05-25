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

const EventsTable = ({ dispatch, dashboardState }) => {
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
      type: "Termination",
      name: "John stone",
      submittedBy: "Roman Kutepov",
      businessUnit: "Businesss Unit A",
      phone: "789456123",
      region: "Region D",
      district: "District G",
      store: "Store C",
      createdDate: "08/10/2022",
      isActive: 'Active',
      title: 'Store Manager',
      email: "john.stone@victra.com"
    },
    {
      id: 2,
      status: "Completed",
      type: "Termination",
      name: "John smith",
      submittedBy: "Jerry Smith",
      businessUnit: "Businesss Unit A",
      phone: "31654987",
      region: "Region C",
      district: "District E",
      store: "Store G",
      createdDate: "08/15/2023",
      isActive: 'Active',
      title: 'Store Manager',
      email: "john.stone@victra.com"
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
            handleDestination(item.phone);
          }}
          title={item.statusTypeDesc || "-"}
        >
          {
            <EventStatus
              value={item.status || "-"}
              className="tooltip"
            />
          }
        </a>
      ),
    },
    {
      label: "Type",
      className: "bold-cell",
      renderCell: (item) => {
        return (
          <a
            onClick={(e) => {
              e.stopPropagation();
              handleDestination(item.phone);
            }}
            title={item?.displayName}
          >
            {
              <AlertType
                value={renderFullAbbrevation(item.code)}
                customClassName="alter-adjustable"
                displayName={item?.type}
              />
            }
          </a>
        );
      },
    },
    {
      label: "Phone",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={item.phone || "-"}
        >
          {item.phone || "-"}          
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
            handleDestination(item.phone);
          }}
          title={item.name || "-"}
        >
          {item.name || "-"}
        </a>
      ),
    },
    {
      label: "Activity Date",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={moment(item.effectiveDatetime).format("MM/DD/YYYY") || "-"}
        >
          {moment(item.effectiveDatetime).format("MM/DD/YYYY") || "-"}
        </a>
      ),
    },
    {
      label: "Area",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={item.area || "-"}
        >
          {item.area || "-"}
        </a>
      ),
    },
    {
      label: "Region",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={item.regionName || "-"}
        >
          {item.region || "-"}
        </a>
      ),
    },
    {
      label: "District",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={item.districtName || "-"}
        >
          {item.district || "-"}
        </a>
      ),
    },
    {
      label: "Store",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item.phone);
          }}
          title={item.storeName || "-"}
        >
          {item.store || "-"}
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
        item.phone.includes(search) 
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
        exportToCsv={exportToCsv}
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        search={search}
        handleSearch={handleSearch}
        searchPlaceholder={"Search"}
        handleClear={handleClear}
        DatePicker={true}
        maxDate={moment().add(30, "days").toDate()}
        minDate={addMonths(startDate, -12)}
        dispatch={dispatch}
        dashboardState={dashboardState}
      />
      <div className="dashboard-table">
        <ReactTable
          key={`${dashboardState?.form?.isFetchLoading}-${search}`}
          columns={COLUMNS}
          hasPagination
         // list={filteredData || []}
          list={EVENTS}
          pageSize={10}
          isLoading={loading || dashboardState?.form?.isFetchLoading}
          handleRowClick={(item) => {
            handleDestination(item);
          }}
          customTheme={{
            Table: `--data-table-library_grid-template-columns: minmax(180px, 2.1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr);`,
          }}
        />
      </div>
    </div>
  );
};

export default EventsTable;
