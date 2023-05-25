import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";

export const ReactDatePicker = ({
  startDate,
  endDate,
  handleDateChange,
  className,
  selectsRange,
  isClearable,
  placeholder,
  minDate,
  showTimeSelect,
  dateFormat,
  minTime,
  maxTime,
  maxDate,
  timeIntervals,
  disabled,
  errors,
  name = null,
  id = null,
}) => {
  const hasError = !disabled && errors?.filter((error) => error.key === name);
  if(selectsRange) {
    return (
      <div>
      <DatePicker
        id={id}
        name={name}
        selectsRange={selectsRange}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          handleDateChange(update);
        }}
        maxDate={maxDate}
        minDate={minDate}
        isClearable={isClearable}
        className={`${className} ${hasError?.length ? 'error-message' : ''}`}
        placeholderText={placeholder}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
      </div>
    );
  } else {
    return (
      <div>
    <DatePicker
        id={id}
        name={name}
        selected={startDate}
        onChange={(update) => {
          handleDateChange(update);
        }}
        maxDate={maxDate}
        minDate={minDate}
        isClearable={isClearable}
        className={`${className} ${hasError?.length ? 'error-message' : ''}`}
        placeholderText={placeholder}
        showTimeSelect={showTimeSelect}
        timeIntervals={timeIntervals}
        disabled={disabled}
        dateFormat={dateFormat}
        minTime={minTime}
        maxTime={maxTime}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
      {hasError?.length > 0 && (
        <div className="highlight-pending-change">{hasError[0].message}</div>
      )}
      </div>);
  }
 
};

ReactDatePicker.prototypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  updateDateRange: PropTypes.any,
  className: PropTypes.string,
  selectsRange: PropTypes.boolean,
  isClearable: PropTypes.boolean,
  handleDateChange: PropTypes.func,
  placeholder: PropTypes.string,
  minDate: PropTypes.any,
  showTimeSelect: PropTypes.boolean,
  dateFormat: PropTypes.string,
  minTime: PropTypes.any,
  maxTime: PropTypes.any,
  maxDate: PropTypes.any,
}

ReactDatePicker.defaultProps = {
  selectsRange: false,
  isClearable: false,
  placeholder: 'Date filters',
  showTimeSelect: false,
  dateFormat: 'MM/dd/yyyy',
  minTime: setHours(setMinutes(new Date(), 0), 0),
  maxTIme:setHours(setMinutes(new Date(), 0), 23),
  timeIntervals: 30,
  disabled: false
};
