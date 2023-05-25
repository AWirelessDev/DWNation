import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CardHistorylog } from "../CardHistoryLog/CardHistorylog";
import { Buttons } from "../Buttons/Buttons";
import {
  NumericValidator,
  AlphaNumericSpecialCharValidator,
} from "../../../validators";

export const AcknowledgementBlock = ({
  employeeDetails,
  handleAcknowledgement,
}) => {
  const employeeFullName = `${employeeDetails?.preferredFirstName} ${employeeDetails?.legalLastName}`;
  const adpId = employeeDetails?.adpId;

  const buttons = [
    {
      name: "Acknowledge",
      variant: "btn btn-primary",
      className: "btn-ack",
      handleClick: async () => {
        if (validate) {
          setErrorMessageShow(false);
          handleAcknowledgement();
        } else {
          setErrorMessageShow(true);
        }
      },
    },
  ];

  const [values, setValues] = useState({
    firstLastName: "",
    employeeAdpId: "",
  });

  const [errorMessageShow, setErrorMessageShow] = useState(false);

  const validate =
    values.firstLastName?.toLowerCase() === employeeFullName?.toLowerCase() &&
    values.employeeAdpId.toString() === adpId.toString();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = {
      ...values,
      [name]: value,
    };
    setValues(updatedValues);
  };

  const handleEmpId = (e) => {
    if (NumericValidator(e.target.value)) {
      handleChange(e);
    }
  };

  const handleFullName = (e) => {
    if (AlphaNumericSpecialCharValidator(e.target.value)) {
      handleChange(e);
    }
  };

  useEffect(() => {
    if (!validate) {
      setErrorMessageShow(true);
    } else {
      setErrorMessageShow(false);
    }
  }, [values]);

  useEffect(() => {
    return () => {
      setValues({
        firstLastName: "",
        employeeAdpId: "",
      });
      setErrorMessageShow(false);
    };
  }, []);
  return (
    <CardHistorylog
      title={
        <div>
          <FontAwesomeIcon size={"sm"} icon={faCheck} /> Employee
          Acknowledgement
        </div>
      }
      showSeparator={false}
      headerClassName="headerRedColor"
    >
      <div className="form p-3">
        {errorMessageShow && (
          <div class="alert alert-danger" role="alert">
            Invalid Employee Detail. Please make sure both are correct
          </div>
        )}
        <br />
        I have reviewed and received this Performance Improvement Plan, and it
        has been discussed with me by my direct supervisor.
        <br />
        <br />
        <div className="input-group d-flex flex-nowrap mb-3">
          <span className="input-group-text" id="basic-addon1">
            <FontAwesomeIcon icon={faPenToSquare} />
          </span>
          <div className="w-100">
            <div className="form-floating">
              <input
                className="form-control"
                id="firstLastName"
                name="firstLastName"
                placeholder="Employee Signature (type your first and last name as it appears in your email address)"
                onChange={handleFullName}
                value={values?.firstLastName}
              />
              <label htmlFor="firstLastName">
                Employee Signature (type your first and last name as it appears
                in your email address)
              </label>
            </div>
            <div className="form">
              <input
                className="form-padding-adp-id form-control"
                id="employeeAdpId"
                name="employeeAdpId"
                placeholder={`Employee ADP ID (See My Account 'General Tab' )`}
                onChange={handleEmpId}
                value={values?.employeeAdpId}
              />
            </div>
          </div>
        </div>
        <br />
        <div className={`${validate ? "d-flex" : "d-flex btn-fcad-disabled"}`}>
          <Buttons buttons={buttons} />
        </div>
      </div>
    </CardHistorylog>
  );
};
