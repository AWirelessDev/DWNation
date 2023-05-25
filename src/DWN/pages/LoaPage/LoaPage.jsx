import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Card, DenyModal, ReactToast, Breadcrumb } from "../../components";
import "./LoaPage.css";
import "../../../styles.scss";
import Select from "react-select";
import queryString from "query-string";
import { useFetchJoin } from "../../../hooks/useFetchJoin";
import { AlertNoData } from "../../components/Alerts/AlertNoData";

export const LoaPage = () => {
  const data = [
    {
      value: "j",
      label: "Jury",
    },
    {
      value: "d",
      label: "Duty",
    },
  ];
  const data1 = [
    {
      value: "y",
      label: "Yes",
    },
    {
      value: "n",
      label: "No",
    },
  ];

  const { id = "" } = queryString.parse(location.search);
  const [show, setShow] = useState(false);
  const saveClick = () => {
    setShow(true);
    setTimeout(() => {
      setIsDisabled(true);
    }, 100);
  };
  const [ashow, asetShow] = useState(false);
  const approveClick = () => {
    asetShow(true);
  };
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eid, setId] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cw, setCw] = useState("");
  const [lr, setLr] = useState("");
  const [rest, setRest] = useState("");
  const [reen, setReen] = useState("");

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    setFirstName("");
    setLastName("");
    setId("");
    setNumber("");
    setEmail("");
    setCw("");
    setLr("");
    setRest("");
    setReen("");
  };

  const handleClick = () => {
    setIsDisabled(!isDisabled);
  };

  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;

  const [DataHis, loading, error, DataPeople] = useFetchJoin(
    `${VITE_REACT_URL_API_PMC}/GetEventByActivityId/${id}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
    "mdmEmployeeId",
    `${VITE_REACT_URL_API_PMC}/GetEmployeeById/`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC }
  );

  return (
    <div className="form-container">
      <br />
      <h2>
        <Breadcrumb />
      </h2>
      <br />
      <Card title={"Leave Of Absence"}>
        <div className="m-2">
          {DataPeople ? (
            <CommonPage
              employeeDetails={DataPeople}
              activityData={DataHis}
              id={id}
            />
          ) : (
            <AlertNoData />
          )}
          <hr></hr>
          <Form className="loaForm" onSubmit={formSubmissionHandler}>
            <Form.Group>
              <Row>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="fname">Employee First Name : </label>
                  <Form.Control
                    id="fname"
                    type="text"
                    placeholder="Mia"
                    name="fname"
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => setfnameTouched(true)}
                    value={firstName}
                    disabled={isDisabled}
                  ></Form.Control>
                </Col>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="lname">Employee last Name : </label>
                  <Form.Control
                    id="lname"
                    type="text"
                    placeholder="Wong"
                    name="lname"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    disabled={isDisabled}
                  ></Form.Control>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="eid">Employee ID Number :</label>
                  <Form.Control
                    id="eid"
                    type="number"
                    placeholder="15678"
                    name="eid"
                    onChange={(e) => setId(e.target.value)}
                    value={eid}
                    disabled={isDisabled}
                  ></Form.Control>
                  <br></br>
                </Col>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="number">Personal Number : </label>
                  <Form.Control
                    id="number"
                    type="number"
                    placeholder="630-786-0098"
                    name="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    disabled={isDisabled}
                  ></Form.Control>
                </Col>
              </Row>
              <hr></hr>
              <Row>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="id">Personal Email :</label>
                  <Form.Control
                    id="email"
                    className="name-input"
                    type="email"
                    placeholder="miawong@gmail.com"
                    name="name"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={isDisabled}
                  ></Form.Control>
                  <br></br>
                </Col>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="cw">Currently Working :</label>
                  <Select
                    placeholder="Select Option"
                    value={cw}
                    options={data1}
                    isDisabled={isDisabled}
                    onChange={(e) => setCw(e)}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <Form.Label>Requested Start Date</Form.Label>
                  <input
                    placeholder="mm/dd/yyyy"
                    className="form-control"
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    id="date"
                    disabled={isDisabled}
                    onChange={(date) => setRest(date)}
                  />
                </Col>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <Form.Label htmlFor="date">Requested End Date</Form.Label>
                  <input
                    placeholder="mm/dd/yyyy"
                    className="form-control"
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    id="date"
                    disabled={isDisabled}
                    onChange={(date) => setReen(date)}
                  />
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col xs={6} md={6} sm={12} xl={6} lg={6}>
                  <label htmlFor="RLR">Reason For Leave Request :</label>
                  <Select
                    placeholder="Select Option"
                    value={lr}
                    options={data}
                    isDisabled={isDisabled}
                    onChange={(e) => setLr(e)}
                  />
                </Col>
              </Row>
              <br></br>
              <hr></hr>
              <br></br>
              <br />
              {isDisabled && (
                <>
                  <Button
                    variant="success"
                    value="approve"
                    type="approve"
                    onClick={approveClick}
                    className="button"
                  >
                    Approve
                  </Button>
                  <DenyModal />
                  <Button
                    variant="outline-dark"
                    onClick={handleClick}
                    className="button"
                  >
                    Edit
                  </Button>
                </>
              )}
              {!isDisabled && (
                <Button
                  variant="primary"
                  onClick={saveClick}
                  className="button"
                >
                  Save
                </Button>
              )}
              <br />
              <Row>
                <Col>
                  {show && (
                    <ReactToast
                      title={"Saved"}
                      handleClose={() => setShow(false)}
                    >
                      <div>Leave of Absence for Mia is Saved.</div>
                    </ReactToast>
                  )}
                </Col>
                <Col>
                  {ashow && (
                    <ReactToast
                      title={"Approved"}
                      handleClose={() => asetShow(false)}
                    >
                      <div>Leave of Absence for Mia is Approved.</div>
                    </ReactToast>
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </div>
      </Card>
      <br></br>
    </div>
  );
};
