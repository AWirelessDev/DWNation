import { React } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "../../styles.scss";
import { NO_HISTORICAL_DATA_FOUND } from "./Constants";

export const CommonPage = ({
  employeeDetails = null,
  activityData = null,
  id = "add",
}) => {
  const isAdd = id === "add";
  const data = {
    preferredFirstName: employeeDetails?.preferredFirstName,
    legalLastName: employeeDetails?.legalLastName,
    adpId: employeeDetails?.adpId,
    storeName: isAdd ? employeeDetails?.location : activityData?.storeName,
    title: isAdd
      ? employeeDetails?.title
      : activityData?.title || NO_HISTORICAL_DATA_FOUND,
    supervisor: isAdd
      ? employeeDetails?.reportsTo
      : activityData?.supervisor || NO_HISTORICAL_DATA_FOUND,
  };
  return (
    <div className="form-container">
      <div className="m-2">
        <Form className="commomComponentForm">
          <Form.Group>
            <Row>
              <Col xs={12} md={6} sm={12} xl={6} lg={6}>
                <label className="mt-2">Name: </label>
                <Form.Control
                  type="text"
                  name="name"
                  value={`${data?.preferredFirstName} ${data?.legalLastName} (ADP ID: ${data?.adpId})`}
                  disabled
                  className="mt-2"
                ></Form.Control>
              </Col>
              <Col xs={12} md={6} sm={12} xl={6} lg={6}>
                <label className="mt-2">Location:</label>
                <Form.Control
                  name="location"
                  value={data?.storeName === null ? "" : data?.storeName}
                  disabled
                  className="mt-2"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} sm={12} xl={6} lg={6}>
                <label className="mt-2">Title: </label>
                <Form.Control
                  name="Title"
                  value={data?.title}
                  disabled
                  className="mt-2"
                ></Form.Control>
              </Col>
              <Col xs={12} md={6} sm={12} xl={6} lg={6}>
                <label className="mt-2">Manager: </label>
                <Form.Control
                  name="Manager"
                  value={data?.supervisor}
                  disabled
                  className="mt-2"
                ></Form.Control>
              </Col>
            </Row>
            <br></br>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};
