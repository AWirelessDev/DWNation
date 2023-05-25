import * as React from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { usePagination } from "@table-library/react-table-library/pagination";
import { PropSpiner } from "../../components";
import { Pagination } from "./Pagination";
import { ComposedTable } from "./ComposedTable";
import "./ReactTable.scss";

export const ReactTable = ({
  list = [],
  columns,
  isFixedHeader,
  hasPagination,
  pageSize,
  isLoading,
  handleRowClick = null,
  customTheme = {},
  emptyLabel = null
}) => {
  const data = { nodes: list };
  const theme = useTheme([getTheme(), customTheme]);
  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: Number(pageSize) || 5,
    },
  });


  return (
    <div className="bodyTable">
      <ComposedTable
        columns={columns}
        data={data}
        theme={theme}
        handleRowClick={handleRowClick}
        layout={{
          custom: true,
          horizontalScroll: true,
          fixedHeader: data?.nodes?.length && isFixedHeader,
        }}
        pagination={hasPagination ? pagination : undefined}
      />

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <PropSpiner label="loading" />
        </div>
      )}
      {!data?.nodes?.length && !isLoading && (
        <div className="table-no-records">{emptyLabel ? emptyLabel : "No records found"}</div>
      )}
      {hasPagination && data?.nodes?.length && !isLoading? <Pagination pagination={pagination} data={data} /> : ""}
      <br></br>
    </div>
  );
};

