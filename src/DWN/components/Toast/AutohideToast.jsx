import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";

export const AutohideToast = (props) => {
  const [showToast, setShowToast] = React.useState(props.shwToast);
  const { title } = props;

  return (
    <Row>
      <Col xs={6}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={15000}
          autohide
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{title}</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
        </Toast>
      </Col>
      <Col xs={6}>
        <Button onClick={() => setShowToast(true)}>Show Toast</Button>
      </Col>
    </Row>
  );
};

AutohideToast.propTypes = {
  title: PropTypes.string,
  shwToast: PropTypes.boolean,
};

AutohideToast.defaultProps = {
  title: "Title",
  shwToast: true,
};

export default AutohideToast;
