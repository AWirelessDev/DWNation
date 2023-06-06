import "./EventStatus.scss";

export const EventStatus = ({ value }) => {
  let colorType = "danger";
  const firstWord = value.split(" ")[0]; 

  if (firstWord.toLowerCase() === "inactive") {
    colorType = "warning";
  } else if (firstWord.toLowerCase() === "denied") {
    colorType = "danger";
  }else {
    colorType = "success";
  }

  return (
    <div>
      <span className={`${colorType} rounded-circle`} />
      <b>{value}</b>
    </div>
  );
};
