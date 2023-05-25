import { useNavigate } from "react-router-dom";
import { SimpleModal } from ".";
import { useContext } from "react";
import { ActionContext } from "../provider";

export const EventModal = ({
  formName = null,
  action = null,
  employeeFullName = null,
  adpId = null,
  children = null,
  title = null,
}) => {
  const navgiate = useNavigate();
  const actionContext = useContext(ActionContext);
  const { tabDispatch } = actionContext;

  const buttons = [
    {
      name: "Ok",
      variant: "btn btn-outline-secondary",
      className: "default",
      handleClick: () => {
        navgiate("/dashboard");
        tabDispatch({ type: "CURRENT_TAB", tabIndex: 0 });
      },
    },
  ];
  return (
    <SimpleModal
      title={title ? title : `Form ${action}`}
      size="xs"
      buttons={buttons}
      closeButton={false}
    >
      {children
        ? children
        : `The ${formName} Form for ${employeeFullName} ${
            adpId ? `(ADP ID: ${adpId})` : ""
          } has been ${action?.toLowerCase()}.`}
    </SimpleModal>
  );
};
