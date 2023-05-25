import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./TextArea.scss";

export const TextArea = ({
  id,
  rows = 1,
  maxLength,
  placeholder,
  name,
  value,
  onInputChange,
  disabled,
  errors = [],
  floatText = null,
  className = "",
}) => {
  const hasError = !disabled && errors?.filter((error) => error.key === name);
  return (
    <div className={floatText && value ? "form-floating floatingTextArea" : ""}>
      <Form.Control
        className={
          hasError?.length ? `${className} error-message` : `${className}`
        }
        id={id}
        as={"textarea"}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onInputChange}
        disabled={disabled}
      ></Form.Control>
      {floatText && value && (
        <label htmlFor={id}> {value ? floatText : placeholder}</label>
      )}
      {maxLength && (
        <h5 className="countcharacter">
          Up to {value ? maxLength - String(value)?.length : maxLength}{" "}
          characters only
        </h5>
      )}
      {hasError?.length > 0 && (
        <div className="highlight-pending-change">{hasError[0].message}</div>
      )}
    </div>
  );
};
