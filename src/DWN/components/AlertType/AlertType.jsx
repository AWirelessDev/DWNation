import "./AlertType.scss";

export const AlertType = ({
  value,
  customClassName = "",
  displayName = "",
}) => {
  let alertType = "alert-default";
  switch (value?.toLowerCase()) {
    case "termination":
    case "inactive":
    case "error":
      alertType = "victra-branding-red";
      break;
    case "fcad":
    case "loa":
    case "pip - eget":
      alertType = "victra-blue";
      break;
    case "move":
    case "profile change":
    case "move/demotion":
    case "pending":
      alertType = "victra-yellow";
      break;
    case "pip - cx":
    case "ris":
      alertType = "victra-blue";
      break;
    case "active":
    case "new hire":
    case "hire":
    case "processed":
      alertType = "alert-success";
      break;
    default:
      alertType = "alert-default";
      break;
  }

  return (
    <div
      className={`alert ${alertType} ${customClassName}`}
      role="alert"
      id="alert"
    >
      {displayName || value}
    </div>
  );
};
