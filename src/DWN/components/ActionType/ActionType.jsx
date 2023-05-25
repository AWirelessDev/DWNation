import "./ActionType.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export const ActionType = ({ value, handleClick, data }) => {

  let icon = faEye;
  let color = "#000000";
  switch (value.toLowerCase()) {
    case "view":
      icon = faEye;
      break;
    case "delete":
      icon = faTrash;
      color = "#EA4549";
      break;
    case "edit":
      icon = faPencil;
      break;
    default:
      icon = faEye;
      break;
  }
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClick(data);
      }}
      className="fa-div"
    >
      <FontAwesomeIcon icon={icon} className="fa-icon-size" color={color} />
    </div>
  );
};
