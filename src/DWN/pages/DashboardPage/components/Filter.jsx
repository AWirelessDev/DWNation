import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { useForm } from "../../../../hooks/useForm";
import { ReactDatePicker, SimpleModal } from "../../../components";
import { InactiveDropDown } from "./InactiveDropDown";
import ToggleSwitch from "../../../components/ToggleSwitch/ToggleSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCalendar,
  faFilter,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import "./Filter.scss";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "../../../../hooks/useFetch";
import moment from "moment";
import { FilterClear, FilterIcon } from "../../../components/Svg";
import ReportIcon from "../../../components/Svg/ReportIcon";

export const Filter = ({
  search,
  handleSearch,
  searchPlaceholder,
  handleClear,
  handleAdd,
  DatePicker = false,
  isPeopleTable = false,
  dispatch,
  dashboardState,
  setInactiveDataList,
  setInactiveLoader,
  setFilteredData,
}) => {
 
  
  const [showActInc, setActInc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { formState, onInputChange } = useForm({ name: "user" });
 

  const onActIncChange = (checked) => {
    setActInc(checked);
    if (showActInc != false) {
      setShowModal(true);
    }
    if (showActInc === false) {
      setInactiveDataList([]);
    }
  };

  const handleClose = () => {
    setShowModal(!showModal);
    setActInc(true);
  };

  const handleSubmit = async () => {
    setFilteredData([]);
    setShowModal(!showModal);
    setActInc(false);
    setInactiveLoader(true);   
  };

  const buttons = [
    {
      name: "Close",
      variant: "outline-secondary",
      handleClick: () => handleClose(),
    },
    {
      name: "Confirm",
      variant: "primary",
      handleClick: () => handleSubmit(),
      className: "btn-confirm-primary",
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end pb-1">
        <div className="table-search-block-reverse">
          <div className="d-flex flex-row-reverse pb-2 pb-md-0">
            {/* {isPeopleTable ? (
              <div className="ms-2">
                <div
                  className={`filterButton ${
                    showActInc ? "filter" : "clearFilter"
                  }`}
                  onClick={onActIncChange}
                >
                  {showActInc ? <FilterIcon /> : <FilterClear />}
                  <span>{showActInc ? "Inactive" : "Clear Filter"}</span>
                </div>
              </div>
            ) : null} */}

            {/* begin buttom report or add */}
            {isPeopleTable ? (             
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-add"
                    onClick={handleAdd}
                  >
                    Create
                  </button>
                </div>
            
            ) : (
              <div>
                
              </div>
            )}
            {/* end buttom report or add */}

            {/* 
              // begin buttom clear  
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-clear "
                  onClick={handleClear}
                >
                  <FontAwesomeIcon icon={faFilter} /> Clear
                </button>
              </div>
              // end buttom clear 
 */}
          </div>
          <div className="d-flex flex-md-row flex-column w-100">         

            <div className="pe-sm-2 ">
              {/* begin input search */}
              <InputGroup className="search-box flex-nowrap">
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder={searchPlaceholder}
                  className="search-input"
                />
                <InputGroup.Text id="search" className="inputGroupHeight">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
              </InputGroup>
              {/* end input search */}
            </div>
          </div>
        </div>
      </div>
      {/* {showModal && (
        <SimpleModal
          showModal={showModal}
          title={"Search for Inactive People"}
          handleClose={handleClose}
          buttons={buttons}
        >
          <div>
            <InactiveDropDown
              id="serchInacvtDrp"
              label="Inactive People"
              placeholder="People name"
              name="reportsTo"
              value={name}
              onInputChange={onInputChange}
              editable={false}
              autoFocus={true}
            />
          </div>
        </SimpleModal>
      )} */}
    </>
  );
};
