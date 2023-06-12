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