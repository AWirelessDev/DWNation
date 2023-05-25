import React from "react";
import { Filter } from "./DashboardPage/components/Filter";
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string'
import { ReactTable } from "../../DWN/components/ReactTable/ReactTable";
import moment from "moment";

export const LogTable = ( {DataHis = [], isLoading = false} ) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { id = '' } = queryString.parse( location.search );
  // Search field related code
  const [search, setSearch] = React.useState("");
  let filteredData = DataHis;
  const COLUMNS = [
    {
      label: "Date of Activity",  className: "bold-cell",renderCell: (item) => moment(item.createdDateTime.split('T')[0]).format("MM-DD-YYYY hh:mm a"),
    },
    {
      label: "Action User",  className: "bold-cell",
      renderCell: (item) =>
        item.submittedBy,
    },
    {
      label: "Status",  className: "bold-cell",
      renderCell: (item) =>
        item.statusTypeDesc,
    },
  ];

  if (search) {
    filteredData = filteredData.filter(
      (item) =>
        item.userName.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="">        
      <div style={{position: 'relative', top: '-10px'}}>
      <ReactTable
        columns={COLUMNS}
        list={filteredData || []}
        isLoading={isLoading}
        customTheme={
          {Table : `--data-table-library_grid-template-columns: minmax(180px, 1fr) minmax(130px, 1fr) minmax(80px, 1fr);`}
    }
      />
      </div>
      <br></br>
    </div>
  );
};

export default LogTable;
