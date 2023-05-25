import React from "react";
import Select from "react-select";

export const DropDown = ({
  id,
  label,
  name,
  value,
  placeholder,
  onInputChange,
  editable,
  isMulti,
  isDisabled,
  options = [],
  optionLabel,
  optionValue,
  className,
  errors = [],
}) => {
  const handleChange = (e) => {
    if (isMulti) {
      onInputChange({
        target: { value: e?.map((item) => item[optionValue]), name: name },
      });
    } else {
      onInputChange({ target: { value: e[optionValue], name: name } });
    }
  };

  const customStyles = {
    // For the select itself (not the options)
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: isDisabled ? "#e9ecef" : "#FFF",
        color: isDisabled ? "#212529" : "#212529",
        opacity: 1,
        border: "1px solid #ced4da",
        borderRadius: ".375rem",
      };
    },
  };

  let selectedValue = null;
  if (isMulti) {
    selectedValue = options?.filter((item) =>
      value?.includes(item[optionValue])
    );
  } else {
    selectedValue = value
      ? options?.find(
          (item) => item[optionValue]?.toString() === value?.toString()
        )
      : null;
  }

  const hasError =
    !(isDisabled || editable) && errors?.filter((error) => error.key === name);
  return (
    <>
      <label id={id} className="label-field mt-2">
        {label ? `${label}:` : ""}
      </label>
      <Select
        className={`mt-2 ${className} ${
          hasError?.length ? "error-message" : ""
        }`}
        components={
          editable
            ? {
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
              }
            : {}
        }
        placeholder={placeholder}
        name={name}
        value={selectedValue}
        onChange={handleChange}
        isDisabled={isDisabled || editable}
        options={options}
        getOptionLabel={(option) => `${option[optionLabel]}`}
        getOptionValue={(option) => `${option[optionValue]}`}
        styles={customStyles}
        isMulti={isMulti}
        menuPlacement="auto"
      />
      {hasError?.length > 0 && (
        <div className="highlight-pending-change">{hasError[0].message}</div>
      )}
    </>
  );
};
