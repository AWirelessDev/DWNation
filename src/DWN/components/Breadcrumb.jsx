import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Breadcrumb = () => {
  const navigate = useNavigate();

  return (
    <h2>
      <i onClick={() => navigate(-1)}></i>
      <FontAwesomeIcon
        onClick={() => navigate(-1)}
        icon={faChevronCircleLeft}
        className="Breadcrumb-Arrow"
      />
      <span className="title-dwn ms-1" onClick={() => navigate("/dashboard")}>
        Customer Profile
      </span>
    </h2>
  );
};
