import React, { useState, useEffect, useRef, useContext } from "react";
import AsyncSelect from "react-select/async";
import { useMsal } from "@azure/msal-react";
import { getAccessToken } from "../../../../hooks/useFetch";
import { RoleContext } from "../../../../DWN/provider";

export const InactiveDropDown = ({
  id,
  name,
  label,
  value,
  placeholder,
  onInputChange,
  className,
  isDisabled,
  editable,
  autoFocus = false,
  headers,
}) => {
    //----------BEGIN Impersonation-------------------------
    const RoleCtx = useContext(RoleContext);
    const impersonation = RoleCtx.impersonation || false;
    const impersonEmail = RoleCtx.impersonEmail || false;
    let ImpersonEmail = false;
    if (impersonation != false) {
      ImpersonEmail = impersonEmail;
    }
    if (impersonation != false) {
      headers = { ...headers, ["Impersonate"]: ImpersonEmail };
    }
    //----------END Impersonation-------------------------

  const [selectedValue, setSelectedValue] = useState(value);
  const { accounts, instance } = useMsal();
  const { VITE_REACT_URL_API_PMC, VITE_FUNCTION_KEY_MDM } = import.meta.env;
  const handleChange = (e) => {
    onInputChange({
      target: {
        name: "name",
        value: e.value,
      },
    });
    setSelectedValue(e);
  };

  function useDebounce(fn, delay) {
    const timeoutRef = useRef(null);

    return (...args) => {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const debouncedLoadOptions = useDebounce(async (inputText, callback) => {
    if (inputText?.length >= 3) {
      const accessToken = await getAccessToken(accounts, instance);
      const response = await fetch(
        `${VITE_REACT_URL_API_PMC}/SearchEmployee/${inputText}/2`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "x-functions-key": VITE_FUNCTION_KEY_MDM,
            ...headers,
          },
        }
      );
      const json = await response.json();
      callback(
        json?.map((worker) => {
          return {
            label: worker.name + "   |   " + worker.workerEmail,
            value: worker.mdmWorkerId,
          };
        })
      );
    } else {
      callback([]);
    }
  }, 3000);

  const loadOptions = (inputText, callback) => {
    debouncedLoadOptions(inputText, callback);
  };

  const customStyles = {
    // For the select itself (not the options)
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor: "#FFFFFF"
          ? "#FFFFFF"
          : isDisabled
          ? "#e9ecef"
          : "#FFF",
        color: isDisabled ? "#212529" : "#212529",
        opacity: 1,
        border: "1px solid #ced4da",
        borderRadius: ".375rem",
      };
    },
  };
  return (
    <>
      <label id={id} className="label-field mt-2">
        {label ? `${label}:` : ""}
      </label>
      <AsyncSelect
        autoFocus={autoFocus}
        className={`mt-2 ${className}`}
        id={id}
        name={name}
        placeholder={placeholder}
        value={selectedValue}
        isClearable
        loadOptions={loadOptions}
        isDisabled={isDisabled || editable}
        onChange={handleChange}
        styles={customStyles}
        components={
          editable
            ? {
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
              }
            : {}
        }
      />
    </>
  );
};
