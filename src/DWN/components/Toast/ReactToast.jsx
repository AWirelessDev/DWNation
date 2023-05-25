import React from "react";
import PropTypes from "prop-types";

import { ToastContainer, Toast } from "react-bootstrap";
export const ReactToast = (props) => {
  return (
    <>
      <ToastContainer position={props.position} className="p-3">
        <Toast
          show
          onClose={props.handleClose}
          delay={props.Delay}
          autohide
          bg={props.classbg}
        >
          <Toast.Header>
            <strong className="me-auto">{props.title}</strong>
          </Toast.Header>
          <Toast.Body>
            <b>{props.children}</b>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

ReactToast.propTypes = {
  title: PropTypes.string,
  EventTime: PropTypes.string,
  Delay: PropTypes.number,
  classbg: PropTypes.string,
  position: PropTypes.string,
};

ReactToast.defaultProps = {
  title: "Title",
  EventTime: "1 min ago",
  Delay: 15000,
  classbg: "Light",
  position: "top-center",
};
