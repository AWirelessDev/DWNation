import { useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { VisionToolTip } from "../";

export const DropDownButton = ({
  titleDrp,
  ItemsDrp = [],
  OnId,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const handleSelect = (e) => {
    setValue(e);
    e === "Formal Coaching and Documentation"
      ? navigate(`/fcad?id=add&ev=${OnId}`)
      : e === "Performance Improvement Plan - EGET"
      ? navigate(`/pip?id=add&ev=${OnId}`)
      : e === "Performance Improvement Plan - CX"
      ? navigate(`/pipcx?id=add&ev=${OnId}`)
      : e === "SCF Move/Demotion"
      ? navigate(`/movedemotion?id=add&ev=${OnId}`)
      : e === "SCF Termination"
      ? navigate(`/termination?id=add&ev=${OnId}`)
      : e;

    localStorage.setItem("OnId", OnId);
  };

  const dropDown = () => {
    return (
      <DropdownButton
        className={"px-4 pt-4"}
        title={titleDrp}
        id="dropdown-menu-align-end"
        onSelect={handleSelect}
        disabled={disabled}
      >
        {ItemsDrp?.map((DrpItem, i) => {
          return (
            <Dropdown.Item eventKey={DrpItem} key={DrpItem.toString() + `${i}`}>
              {" "}
              {DrpItem}{" "}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
  };

  return (
    <div>
      {disabled ? (
        <VisionToolTip
          text={"Events cannot be created for inactive employees or for self."}
          placement="auto"
        >
          {dropDown()}
        </VisionToolTip>
      ) : (
        dropDown()
      )}
    </div>
  );
};
