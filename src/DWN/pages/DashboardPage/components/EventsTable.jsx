import React, { useEffect, useContext, useState } from "react";
import {
  ReactTable,
  EventStatus,
  AlertType,
  SimpleModal,
} from "../../../components";
import { useFetch } from "../../../../hooks/useFetch";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { addMonths, set } from "date-fns";
import { Filter } from "./Filter";
import { useMsal } from "@azure/msal-react";
import { RoleContext } from "../../../provider";
import { getApi } from "../../../../helpers";
import { ExportToCsv } from "export-to-csv";
import { PeopleProfilePage } from "../../ProfilePage/PeopleProfilePage";

const EventsTable = ({ dispatch, dashboardState }) => {
  const navigate = useNavigate();
  const PRIORDATE = moment().subtract(30, "days").format("YYYY-MM-DD");
  const todaysDate = moment(new Date()).add(30, "days").format("YYYY-MM-DD");
  //----------BEGIN Impersonation-------------------------
  const { accounts, instance } = useMsal();
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------

  const [showModal, setShowModal] = useState(false);
  const [onCustomerData, setOnCustomerData] = useState({});

  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  const { VITE_REACT_URL_API_SUB, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;

  /* const [data, loading] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetEvents/${PRIORDATE}/${todaysDate}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC }
  );
 */

  const [data, loading] = useFetch(`${VITE_REACT_URL_API_SUB}`, {
    "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY,
  });

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
    console.log("onCustomerData", onCustomerData);
  }, [onCustomerData]);

  useEffect(() => {
    formDataDispatch(data);
  }, [data]);

  // Search field related code
  const [search, setSearch] = useState("");

  /**
   *
   * @param {any} event
   */
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDestination = (value) => {
    setOnCustomerData(value);
    setShowModal(true);
  };

  const COLUMNS = [
    {
      label: "Status",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.status || "-"}
        >
          {
            <AlertType
              value={item.status == "ACTIVE" ? "Active" : "Inactive"}
              customClassName="alter-adjustable"
            />
          }
        </a>
      ),
    },
    {
      label: "First Name",
      className: "bold-cell",
      renderCell: (item) => {
        return (
          <a
            onClick={(e) => {
              e.stopPropagation();
              handleDestination(item);
            }}
            title={item?.first_Name || "-"}
          >
            {item?.first_Name || "-"}
          </a>
        );
      },
    },
    {
      label: "Last Name",
      className: "bold-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.last_Name || "-"}
        >
          {item.last_Name || "-"}
        </a>
      ),
    },

    {
      label: "Phone",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.mdn || "-"}
        >
          {item.mdn || "-"}
        </a>
      ),
    },

    {
      label: "Feature Code",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.feature_Code || "-"}
        >
          {item.feature_Code || "-"}
        </a>
      ),
    },

    {
      label: "Equipment Description",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.equipment_Description || "-"}
        >
          {item.equipment_Description || "-"}
        </a>
      ),
    },

    {
      label: "Activation Date",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.insurance_Activation_Date || "-"}
        >
          {item.insurance_Activation_Date || "-"}
        </a>
      ),
    },

    {
      label: "Account Type",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleDestination(item);
          }}
          title={item.account_Type || "-"}
        >
          {item.account_Type || "-"}
        </a>
      ),
    },
  ];

  const handleClear = () => {
    setSearch("");
    setDateRange([null, null]);
  };

  const handleClose = () => {
    setShowModal(!showModal);
  };

  let filteredData = dashboardState.form.data;

  if (search) {
    filteredData = filteredData?.filter(
      (item) =>
        item.status?.toLowerCase().includes(search.toLowerCase()) ||
        item.first_Name?.toLowerCase().includes(search.toLowerCase()) ||
        item.last_Name
          ?.toLowerCase()
          .replace(/\s+/g, "")
          .includes(search.toLowerCase()) ||
        item.mdn?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.feature_Code?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.equipment_Description?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.account_Type?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.insurance_Activation_Date?.toLowerCase().includes(search.toLocaleLowerCase())
    );
  }

  const exportToCsv = (e) => {
    e.preventDefault();
    // Headers for each column
    let headers = [
      "Activity Id",
      "Status Type",
      "Code",
      "Description",
      "Reason Type",
      "User Name",
      "ADP ID",
      "Submitted By",
      "Activity Date",
      "Area",
      "Region Name",
      "District Name",
      "Store Name",
    ];

    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      filename: `Events Report ${moment().format("LLL")}`,
      headers: headers,
    };

    // Convert users data to a csv
    let eventsCsv = filteredData.reduce((acc, event) => {
      const {
        activityId,
        statusTypeDesc,
        displayName,
        noticeTypeDescription,
        reasonTypeDescription,
        userName,
        adpId,
        submittedBy,
        effectiveDatetime,
        areaName,
        regionName,
        districtName,
        storeName,
      } = event;
      let formateEffectiveDate = moment(effectiveDatetime).format("MM/DD/YYYY");
      acc.push({
        activityId,
        statusTypeDesc,
        displayName,
        noticeTypeDescription,
        reasonTypeDescription,
        userName,
        adpId,
        submittedBy,
        formateEffectiveDate,
        areaName,
        regionName,
        districtName,
        storeName,
      });
      return acc;
    }, []);

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(eventsCsv);
  };
  return (
    <div className="dashboard-tab-body ">
      <Filter
        exportToCsv={exportToCsv}
        search={search}
        handleSearch={handleSearch}
        searchPlaceholder={"Search"}
        handleClear={handleClear}
        DatePicker={false}
        dispatch={dispatch}
        dashboardState={dashboardState}
      />
      <div className="dashboard-table">
        <ReactTable
          key={COLUMNS.mdn}
          columns={COLUMNS}
          hasPagination
          list={filteredData || []}
          pageSize={10}
          isLoading={loading || dashboardState?.form?.isFetchLoading}
          handleRowClick={(item) => {
            handleDestination(item);
          }}
          customTheme={{
            Table: `--data-table-library_grid-template-columns: minmax(180px, 1fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(170px, 1fr) minmax(170px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(160px, 1fr) ;`,
          }}
        />
      </div>

      {showModal && (
        <SimpleModal
          showModal={showModal}
          title={"Customer"}
          handleClose={handleClose}
        >
          <>
            <PeopleProfilePage subscriber_data={onCustomerData} />
          </>
        </SimpleModal>
      )}
    </div>
  );
};

export default EventsTable;
