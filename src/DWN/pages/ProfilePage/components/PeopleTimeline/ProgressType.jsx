import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { ActionType } from "../../../../components/ActionType/ActionType";
import { useNavigate } from "react-router-dom";

export const ProgressType = ({value,efecdate,submiss,ActId, code, customClassName = "",}) => {
  let alertType = "alert-default";
  const navigate = useNavigate();

  const PopOverAct = (
    <Popover className="PopOverCnt">
      <Popover.Header as="h3"></Popover.Header>
      <Popover.Body>
        <div className="hstack gap-2">
          <div className="ms-auto">
            <span className="ProgressLabel">{"Effectivity Date"}</span>
            <br />
            <span className="ProgressLabelData">{efecdate}</span>
            <br />
            <span className="ProgressLabel">{"Submitted By"}</span>
            <br />
            <span className="ProgressLabelData">{submiss}</span>
          </div>
          <div className="mx-3 vr"></div>
          <div className="ViewSec me-2">
          <span className="ProgressLabel">{"View"}</span>
          <br />
            <ActionType
              data={ActId}
              value="view"
              handleClick={
                code === "MOVE"
                  ? (ActId) => {
                      navigate(`/movedemotion?id=${ActId}`);
                    }
                  : code === "TERM"
                  ? (ActId) => {
                      navigate(`/termination?id=${ActId}`);
                    }
                  : code === "FCAD"
                  ? (ActId) => {
                      navigate(`/fcad?id=${ActId}`);
                    }
                  : code === "LOA"
                  ? (ActId) => {
                      navigate(`/loa?id=${ActId}`);
                    }
                  : code === "PIP"
                  ? (ActId) => {
                      navigate(`/pip?id=${ActId}`);
                    }
                  : ""
              }
            />
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  const PopOverEmty = (
    <Popover className="PopOverCnt">
      <Popover.Header as="h3"></Popover.Header>
      <Popover.Body>
        <div className="hstack gap-2">
          <div className="ms-auto">
            <span className="ProgressLabel">{"Date"}</span>
            <br />
            <span className="ProgressLabelData">{efecdate}</span>
            <br />
          </div>
        </div>
      </Popover.Body>
    </Popover>
  );

  switch (value?.toLowerCase()) {
    case "termination":
      alertType = "ProgressEventRed";
      break;
    case "current":
      alertType = "ProgressEventCurr";
      break;
    default:
      alertType = "ProgressEventGreen";
      break;
  }

  return (
    <OverlayTrigger 
      trigger={ value === "Current" ? ("") : value === "Hire" ? ("") : value === "Re-Hire" ? ("") : "click" }
      rootClose
      placement="top"
      overlay= { value === "Current" ? (PopOverEmty) : value === "Hire" ? (PopOverEmty) : value === "Re-Hire" ? (PopOverEmty) : PopOverAct } 
      
    >
      <div className={` ${alertType} ${customClassName}`}>
        <br></br>
      </div>
    </OverlayTrigger>
  );
};
