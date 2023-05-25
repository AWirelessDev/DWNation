import { useState } from 'react';
import './Card.scss';

export const Card = ({ title, children }) => {
  const [collapse, setcollapse] = useState(false);
  return (
    <div className="card-body pt-9 pb-0">
      <h3 className="card-body-title px-4 pt-4">{title ? title : ""}</h3>
      <hr className="separator-title mx-auto" />
      <div className={collapse ? "card-hidden" : "card-bodyplain"}>{children}</div>
    </div>
  );
};
