import * as React from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import PropTypes from "prop-types";
import "./ReactTable.scss";

export const ComposedTable = (props) => {
  const { data, columns, pagination, theme, layout, handleRowClick } = props;
  return (
    <Table data={data} pagination={pagination} theme={theme} layout={layout}>
      {(tableList) => (
        <>
          <Header>
            <HeaderRow>
              {columns?.map((column, index) => (
                <HeaderCell key={`header-${index}`} className={"right"}>
                  {column.label}
                </HeaderCell>
              ))}
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item, index) => (
              <Row
                className={handleRowClick ? "cursor-pointer" : ""}
                key={`row-${item.id}-${index}`}
                item={item}
                onClick={() => {
                  if (handleRowClick) {
                    handleRowClick(item);
                  }
                }}
              >
                {columns?.map((column, index) => (
                  <Cell key={index} className={column.className}>
                    {column.renderCell(item)}
                  </Cell>
                ))}
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
  );
};

ComposedTable.prototypes = {
  list: PropTypes.array,
  columns: PropTypes.array,
};

ComposedTable.defaultProps = {
  list: [],
  columns: [],
};
