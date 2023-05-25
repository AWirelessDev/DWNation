import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { PeopleDropDown } from "./PeopleDropDown";
import "../DashboardPage.scss";

export const TopNavRightItem = () => {
  return (
    <div className="table-search-block-rev row row-cols-1 row-cols-xs-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-1 row-cols-xl-2 row-cols-xxl-2">
      <div className="col me-2 ">
        <div className="d-flex flex-row-reverse">
          <div className="imperson-inp">
              
            <PeopleDropDown
              id="serchInacvtDrp"
              label="Inactive People"
              name="reportsTo"
              value={null}
              onInputChange={null}
              editable={false}
              placeholder="Impersonate"
            />
          
          </div>
        </div>
      </div>
    </div>
  );
};
