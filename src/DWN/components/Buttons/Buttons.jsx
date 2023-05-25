import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Buttons.scss";

import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

export const Buttons = ({ buttons = [], size = "lg", disabled = false }) => {
  const [processing, setProcessing] = useState({});

  const handleClick = async (id) => {
    setProcessing({
      ...buttons.reduce((result, _, index) => {
        const buttonId = `btn-footer-${index}`;
        return {
          ...result,
          [buttonId]: buttonId === id ? true : disabled,
        };
      }, {}),
    });
    await new Promise((resolve) => setTimeout(resolve, 9000));
    setProcessing({});
  };

  const isProcessing = Object.values(processing).some((value) => value);

  return (
    <div>
      {buttons?.map((button, index) => {
        const id = `btn-footer-${index}`;
        const isDisabled = disabled || isProcessing || processing[id];
        return (
          <Button
            key={id}
            disabled={isDisabled}
            variant={button.variant}
            onClick={() => {
              button.handleClick();
              handleClick(id);
            }}
            size={size}
            className={`${button?.className || ""} buttons-margin`}
          >
            {processing[id] && (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            {button.name}
          </Button>
        );
      })}
    </div>
  );
};

Buttons.prototypes = {
  buttons: PropTypes.array,
  size: PropTypes.string,
  disabled: PropTypes.boolean,
};

Buttons.defaultProps = {
  buttons: [],
  size: "lg",
  disabled: false,
};
