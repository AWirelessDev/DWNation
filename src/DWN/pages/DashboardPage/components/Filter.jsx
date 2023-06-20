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
import { hasPermission } from "../../../helpers";
import "./Filter.scss";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "../../../../hooks/useFetch";
import moment from "moment";
import { FilterClear, FilterIcon } from "../../../components/Svg";
import ReportIcon from "../../../components/Svg/ReportIcon";

export const Filter = ({
  exportToCsv,
  startDate,
  endDate,
  setDateRange,
  maxDate,
  minDate,
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
  const { VITE_REACT_URL_API_PMC, VITE_FUNCTION_KEY_MDM } = import.meta.env;
  const { accounts, instance } = useMsal();
  const showAddButton = hasPermission("btnAddContractor");
  const [visibleshow, setvisibleshow] = useState(DatePicker);
  const [showActInc, setActInc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { formState, onInputChange } = useForm({ name: "user" });
  const PRIORDATE = moment().subtract(30, "days").format("YYYY-MM-DD");
  const todaysDate = moment(new Date()).format("YYYY-MM-DD");

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

    const accessToken = await getAccessToken(accounts, instance);
    const response = await fetch(
      `${VITE_REACT_URL_API_PMC}/GetEmployeeById/${formState.name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-functions-key": VITE_FUNCTION_KEY_MDM,
        },
      }
    );

    if (response.ok) {
      let json = await response.json();
      setInactiveDataList([json]);
      setInactiveLoader(false);
    } else {
      setInactiveLoader(false);
      return Promise.reject();
    }
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
            {isPeopleTable ? (
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
            ) : null}

            {/* begin buttom report or add */}
            {isPeopleTable ? (
              showAddButton ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-add"
                    onClick={handleAdd}
                  >
                    <FontAwesomeIcon icon={faUpload} /> Add
                  </button>
                </div>
              ) : null
            ) : (
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-RptIcon"
                  onClick={exportToCsv}
                  id="csv"
                >
                  <ReportIcon />
                  <span className="RptButton">Report</span>
                </button>
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
            {visibleshow && (
              <div className="pe-sm-2 mb-2 mb-md-0">
                {/* begin input date filter */}
                <InputGroup className="date-filter-box ">
                  <ReactDatePicker
                    startDate={startDate}
                    endDate={endDate}
                    handleDateChange={(update) => {
                      setDateRange(update);
                    }}
                    className="date-picker-input"
                    selectsRange={[startDate, endDate]}
                    maxDate={maxDate}
                    minDate={minDate}
                  />
                  <InputGroup.Text
                    id="searchdate"
                    className="inputGroupHeight "
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                  </InputGroup.Text>
                </InputGroup>
                {/* end input datefilter */}
              </div>
            )}

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
      {showModal && (
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
      )}
    </>
  );
};
