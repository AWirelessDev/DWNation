import { Form } from "react-bootstrap";

export const FormControl = ({
  id,
  type,
  maxLength,
  placeholder,
  name,
  value,
  onInputChange,
  disabled,
  errors= []
}) => {
    const hasError = !disabled && errors?.filter((error) => error.key === name);
  return (
    <div>
      <Form.Control
        className={hasError?.length ? "error-message" : ""}
        id={id}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onInputChange}
        disabled={disabled}
      ></Form.Control>   
        {maxLength &&  (
            <h5 className="countcharacter">
            Up to {value ? maxLength - value?.toString()?.length : maxLength} numerics
            only
            </h5>
        )}
      {hasError?.length > 0 && (
        <div className="highlight-pending-change">{hasError[0].message}</div>
      )}
    </div>
  );
};
