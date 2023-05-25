import React from "react";
import PropTypes from "prop-types";
import "./ToggleSwitchAC.scss";

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function. The props name, small, disabled
and optionLabels are optional.
Usage: <ToggleSwitch id="id" checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitchAC = ({
  id,
  name,
  checked,
  onChange,
  optionLabels,
  small,
  disabled
}) => {
  function handleKeyPress(e) {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked);
  }

  return (
    <div className={"toggleAC-switchAC" + (small ? "smallAC-switchAC" : "")}>
      <input
        type="checkbox"
        name={name}
        className="toggleAC-switchAC-checkboxAC"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label
          className="toggleAC-switchAC-labelAC"
          tabIndex={disabled ? -1 : 1}
          onKeyDown={(e) => handleKeyPress(e)}
          htmlFor={id}
        >
          <span
            className={
              disabled
                ? "toggleAC-switchAC-innerAC toggleAC-switchAC-disabledAC"
                : "toggleAC-switchAC-innerAC"
            }
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              disabled
                ? "toggleAC-switchAC-switchAC toggleAC-switchAC-disabledAC"
                : "toggleAC-switchAC-switchAC"
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

// Set optionLabels for rendering.
ToggleSwitchAC.defaultProps = {
  optionLabels: ["Yes", "No"]
};

ToggleSwitchAC.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  optionLabels: PropTypes.array,
  small: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ToggleSwitchAC;