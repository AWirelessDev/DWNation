import React, { useEffect, useContext } from "react";
import { ReactTable, AlertType } from "../../../components";
import { useFetch } from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { Filter } from "./Filter";
import BinaryImage from "../../../components/BinaryImage/BinaryImage";
/**
 * @returns Transaction data table
 */
const TransactionTable = ({ dispatch, dashboardState }) => {
  const navigate = useNavigate();
  const [inactiveDataList, setInactiveDataList] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inactiveLoader, setInactiveLoader] = React.useState(false);

  const { VITE_REACT_URL_API_TRAN, VITE_OCP_APIM_SUBSCRIPTION_KEY } = import.meta
    .env;

  const [data, loading] = useFetch(
    `${VITE_REACT_URL_API_TRAN}`,
    { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY }
  );

  // Search field related code
  const [search, setSearch] = React.useState("");

  /**
   * @param {any} event
   */
  const handleSearch = (event) => {
    let search = event.target.value;
    setSearch(event.target.value);
    setFilteredData(
      data?.filter(
        (item) =>
          item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
          item.firstName?.toLowerCase().includes(search.toLocaleLowerCase()) ||
          item.lastName?.toLowerCase().includes(search.toLocaleLowerCase()) ||
          item.accountNumber?.toLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  };

  const handleDestination = (item) => {
    navigate(`/profile?id=${item.mdmWorkerId}`);
  };

  // Date filter related code
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [startDate, endDate] = dateRange;

  const COLUMNS = [
    // {
    //   label: "Employee",
    //   className: "bold-cell",
    //   renderCell: (item) => {
    //     return (
    //       <div
    //         onClick={(mdmWorkerId) =>
    //           navigate(`/profile?id=${item.mdmWorkerId}`)
    //         }
    //       >
    //         <BinaryImage
    //           key={`image-${item.image}`}
    //           base64Data={item.image}
    //           altClassName="employee-img"
    //           isNavBar="true"
    //         />
    //         <p className="ps-2"></p>
    //         <a>{item.name || "-"}</a>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   label: "Status",
    //   className: "bold-cell",
    //   renderCell: (item) => (
    //     <a
    //       onClick={(transactionId) => navigate(`/profile?id=${item.transactionId}`)}
    //     >
    //       {
    //         <AlertType
    //           value={item.isActive ? "Active" : "Inactive"}
    //           customClassName="alter-adjustable"
    //         />
    //       }
    //     </a>
    //   ),
    // },
    {
      label: "First Name",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(transactionId) => navigate(`/profile?id=${item.transactionId}`)}
        >
          {item.firstName || "-"}
        </a>
      ),
    },
    {
      label: "Last Name",
      className: "reg-cell",
      renderCell: (item) => (
        <a
        onClick={(transactionId) => navigate(`/profile?id=${item.transactionId}`)}
        >
          {item.lastName || "-"}
        </a>
      ),
    },
    {
      label: "Transaction Id",
      className: "reg-cell",
      renderCell: (item) => (
        <a
          onClick={(transactionId) => navigate(`/profile?id=${item.transactionId}`)}
        >
          {item.transactionId || "-"}
        </a>
      ),
    },
    {
      label: "Account Number",
      className: "reg-cell",
      renderCell: (item) => (
        <a
        onClick={(transactionId) => navigate(`/profile?id=${item.transactionId}`)}
        >
          {item.accountNumber || "-"}
        </a>
      ),
    }    
  ];

  const handleClear = () => {
    setSearch("");
    setDateRange([null, null]);
  };

  const handleAdd = () => {
    navigate("/addcontractor");
  };

  useEffect(() => {
    if (inactiveDataList.length) {
      setFilteredData(inactiveDataList);
    } else if (data?.length) {
      setFilteredData(
        data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      );
    } else {
      setFilteredData([]);
    }
  }, [inactiveDataList, data]);
  useEffect(() => {
    if (loading) {
      setInactiveLoader(true);
    } else {
      setInactiveLoader(false);
    }
  }, [loading]);
  return (
    <div className="dashboard-tab-body">
      <Filter
        startDate={startDate}
        endDate={endDate}
        setDateRange={setDateRange}
        search={search}
        handleSearch={handleSearch}
        searchPlaceholder={"Search"}
        isPeopleTable
        handleClear={handleClear}
        handleAdd={handleAdd}
        DatePicker={false}
        setInactiveDataList={setInactiveDataList}
        setInactiveLoader={setInactiveLoader}
        setFilteredData={setFilteredData}
      />
      <div className="dashboard-table">
        <ReactTable
          key={`${search}`}
          columns={COLUMNS}
          list={filteredData}
          hasPagination
          pageSize={10}
          isLoading={inactiveLoader}
          handleRowClick={(item) => {
            handleDestination(item);
          }}
          customTheme={{
            Table: `--data-table-library_grid-template-columns: minmax(150px, 1fr) minmax(80px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) ;`,
          }}
        />
      </div>
    </div>
  );
};

export default TransactionTable;
