import { useState } from "react";
import { DropDownButton } from "../DropdownButtons/DropDownButton";
import "./Card.scss";
export const CardDrpActions = ({
  title,
  children,
  titleDrp,
  ItemsDrp = [],
  OnId,
  disabled = false,
  isLoading = false,
}) => {
  const [collapse, setcollapse] = useState(false);
  return (
    <div className="card-body pt-9 pb-0">
      <div className="d-flex justify-content-between">
        <h3 className="card-body-title px-4 pt-4">{title ? title : ""}</h3>
        {!isLoading ? (
          <DropDownButton
            titleDrp={titleDrp}
            ItemsDrp={ItemsDrp}
            OnId={OnId}
            disabled={disabled}
          ></DropDownButton>
        ) : null}
      </div>
      <hr className="separator-title mx-auto" />
      <div className={collapse ? "card-hidden" : "card-bodyplain"}>
        {children}
      </div>
    </div>
  );
};
