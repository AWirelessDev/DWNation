import React from "react";

const InputField = ({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
  pendingChanges,
  disabled,
  type = "text",
  maxLength = 524288,
  errors,
}) => {
  const hasError = !disabled && errors?.filter((error) => error.key === name);
  let className = "form-control data-field mt-2";
  if (pendingChanges?.includes(id))
    className = "backgroundPending form-control mt-2";
  if (hasError?.length) className = "error-message form-control mt-2";
  return (
    <>
      <label id={id} className="label-field mt-2">
        {label ? `${label}:` : ""}
      </label>
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
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

export default InputField;
