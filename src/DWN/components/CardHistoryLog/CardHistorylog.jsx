import './CardHistorylog.scss';

export const CardHistorylog = ({ title = '', children, headerClassName, showSeparator = true }) => {
  return (
    <div className="card-body">
      <h3 className={`card-body-title px-4 pt-4 ${headerClassName}`}>{title ? title : ""}</h3>
      {showSeparator && <hr className="separator-title mx-auto" />}
      <div>{children}</div>
    </div>
  );
};
