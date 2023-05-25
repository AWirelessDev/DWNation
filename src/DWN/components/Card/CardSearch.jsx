import { useState } from "react";
import { DropDownButton } from "../DropdownButtons/DropDownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCalendar,
  faFilter,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
//import BootstrapSwitchButton from "bootstrap-switch-button-react";
import InputGroup from "react-bootstrap/InputGroup";

import "./Card.scss";

export const CardSearch = ({ title, children, placeholder }) => {
  const [collapse, setcollapse] = useState(false);
  return (
    <div className="card-body pt-9 pb-0">
      <div className="d-flex justify-content-between">
        <h3 className="card-body-title px-4 pt-4 title-pmc">{title ? title : ""}</h3>
        <div className="search-bar px-4 pt-4 d-none d-sm-block">
          <InputGroup className="search-bar-box">
            {/* <input
              id="search"
              type="text"
              placeholder={placeholder}
              className="search-bar-input "
            />

            <button
              type="button"
              className="btn btn-primary btn-clear inputGroupHeightbar"
            >
              <FontAwesomeIcon icon={faSearch} />{" "}
            </button> */}

            {/*             <div className="form-check form-switch switchbtn ">
              <input
                className="form-check-input "
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked
              ></input>
              <label className="form-check-label " >
                Active
              </label>
            </div> */}

          </InputGroup>
        </div>
      </div>
      <hr className="separator-title mx-auto" />
      <div className={collapse ? "card-hidden" : "card-bodyplain"}>
        {children}
      </div>
    </div>
  );
};
