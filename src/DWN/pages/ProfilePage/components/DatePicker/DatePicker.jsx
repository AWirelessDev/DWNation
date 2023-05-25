import React from "react";
import { ReactDatePicker } from "../../../../components";

const DatePicker = ({
  id,
  label,
  name,
  value,
  placeholder,
  onInputChange,
  disabled,
  pendingChanges,
  className,
  errors,
}) => {
  const hasError = !disabled && errors?.filter((error) => error.key === name);

  return (
    <>
      <label id={id} className="label-field mt-2">
        {label ? `${label}:` : ""}
      </label>
      <ReactDatePicker
        id={id}
        name={name}
        className={`mt-2 form-control ${className} ${
          pendingChanges?.includes(id) ? "backgroundPending" : null
        } ${hasError?.length ? "error-message" : null}`}
        placeholder={placeholder}
        handleDateChange={(selectedDate) =>
          onInputChange({
            target: {
              name: name,
              value: selectedDate,
            },
          })
        }
        startDate={value || null}
        dateFormat="MM/dd/yyyy"
        disabled={disabled}
      />
      {pendingChanges?.includes(id) && (
        <div className="highlight-pending-change">Pending change</div>
      )}
      {hasError?.length > 0 && (
        <div className="highlight-pending-change">{hasError[0].message}</div>
      )}
    </>
  );
};

export default DatePicker;
