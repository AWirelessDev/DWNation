export const ReactTimePicker = ({ id, name, className, onChange = null, value = null, disabled = false }) => {
  return (
    <div>
      <input id={id} name={name} type="time" className={className} value={value} onChange={onChange} disabled={disabled}/>
    </div>
  );
};
