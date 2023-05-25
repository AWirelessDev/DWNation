import React, { useState } from "react";
import moment from "moment";
import {
  ActionType,
  ReactTable,
  AlertType,
  SimpleModal,
  PropSpiner,
  VisionToolTip,
} from "../../../components";
import "../ProfilePage.scss";
import { useMsal } from "@azure/msal-react";
import { hasPermission } from "../../../helpers";
import { deleteApi } from "../../../../helpers";

export const PendingChanges = ({
  collapse,
  setCollapse,
  showPendingChanges,
  dataPendingChanges,
  isDataPendingChangesLoading,
  setPendingChangesList,
  setToastMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { VITE_REACT_URL_API_PMC, VITE_EVENTS_FUNCTION_KEY_PMC } = import.meta
    .env;
  const { accounts, instance } = useMsal();

  const handleDeleteEvent = async (eventId) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirm) {
      try {
        setIsLoading(true);
        const json = await deleteApi(
          `${VITE_REACT_URL_API_PMC}/DeleteEmployeeEvent/${eventId}`,
          { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
          accounts,
          instance
        );

        setPendingChangesList(
          dataPendingChanges.filter((item) => item.eventId !== eventId)
        );
        setIsLoading(false);
        setToastMessage({
          title: "Saved",
          position: "top-center",
          EventTime: "",
          Delay: 15000,
          classbg: ["success"],
          children: <div>Pending change deleted successfully</div>,
        });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setToastMessage({
          title: "Error",
          position: "top-center",
          EventTime: "",
          Delay: 15000,
          classbg: ["danger"],
          children: (
            <div className="error-toast-message">
              Unable to delete the pending change
            </div>
          ),
        });
      }
    }
  };
  const labelNames = (labelKeys) => {
    const labels = [];
    if (labelKeys?.length) {
      // while pushing labels give space and name
      labelKeys?.forEach((label) => {
        switch (label?.toLowerCase()) {
          case "preferredfirstname":
            labels.push(" Preferred First Name");
            return;
          case "pronounsid":
            labels.push(" Pronouns");
            return;
          case "classificationid":
            labels.push(" Classification");
            return;
          case "positionid":
            labels.push(" Position");
            return;
          case "reportsto":
            labels.push(" Reports To");
            return;
          case "comissiongroup":
            labels.push(" Commission Group");
            return;
          case "paytypeid":
            labels.push(" Exempt/Non-Exempt");
            return;
          case "jobcodeid":
            labels.push(" Job Code");
            return;
          case "programcodeid":
            labels.push(" Program Code");
            return;
          case "mdmcompanyid":
            labels.push(" Primary Company");
            return;
          case "mdmcompanyids":
            labels.push(" Companies");
            return;
          case "rqorganizationroleid":
            labels.push(" Organization Role");
            return;
          case "visionroleid":
            labels.push(" Vision Role");
            return;
          case "phone":
            labels.push(" Office Phone Number");
            return;
          case "mdmworkerapplicationprovisioningroleid":
            labels.push(" App Provisioning Role");
            return;
          case "sendtoomni":
            labels.push(" Omni Access");
            return;
          case "terminationdate":
            labels.push(" Termination Date");
            return;
          case "phoneext":
            labels.push(" Office Phone Number Ext");
            return;
          case "mdmlocationlevelid":
            labels.push(" Primary Location");
            return;
          case "hiredate":
            labels.push(" Hire Date");
            return;
          case "legalfirstname":
            labels.push(" Legal First Name");
            return;
          case "legallastname":
            labels.push(" Legal Last Name");
            return;
          case "onepos":
            labels.push(" One POS Code");
            return;
          default:
            labels.push(` ${label}`);
            return;
        }
      });
    }
    return labels;
  };

  const columns = [
    {
      label: "Type",
      renderCell: () => (
        <AlertType
          value={"Profile Change"}
          customClassName="alter-adjustable"
        />
      ),
    },
    {
      label: "Submitted By",
      renderCell: (item) => <b>{item.createdByName}</b>,
    },
    {
      label: "Submission Date",
      renderCell: (item) => (
        <b>{moment(item?.createdDatetime).format("MM/DD/YYYY")}</b>
      ),
    },
    {
      label: "Field(s)",
      renderCell: (item) => {
        const labels = labelNames(
          item?.attributes &&
            Object.keys(item?.attributes).filter((key) => {
              return item?.attributes[key] !== null;
            })
        ).toString();
        return (
          <VisionToolTip text={labels} placement="auto">
            {labels}
          </VisionToolTip>
        );
      },
    },
    {
      label: "Effective Date",
      renderCell: (item) =>
        moment.utc(item?.effectiveDate).local().format("MM/DD/YYYY h:mm a"),
    },
    {
      label: "Status",
      renderCell: (item) => (
        <VisionToolTip text={item.errorDetails || item.status} placement="auto">
          <AlertType value={item.status} customClassName="alter-adjustable" />
        </VisionToolTip>
      ),
    },
    {
      label: "Manage",
      renderCell: (item) => (
        <div>
          {item?.status?.toLowerCase() === "processed" ? (
            "-"
          ) : (
            <div>
              <ActionType
                value="view"
                data={item}
                handleClick={() => {
                  showPendingChanges(
                    Object.keys(item?.attributes).filter((key) => {
                      return item?.attributes[key] !== null;
                    })
                  );
                }}
              />
              &nbsp; &nbsp; &nbsp; &nbsp;
              {hasPermission("btnDeleteEmployeeEvent") && (
                <ActionType
                  value="delete"
                  data={item}
                  handleClick={() => {
                    handleDeleteEvent(item.eventId);
                    showPendingChanges(null);
                  }}
                />
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  const [show, setShow] = useState(false);

  const handleCollapse = () => {
    if (collapse) {
      setCollapse(!collapse);
    } else {
      setShow(!show);
    }
  };

  const handleClose = () => {
    setShow(!show);
  };

  const handleSubmit = () => {
    setShow(!show);
    setCollapse(true);
    showPendingChanges(null);
  };

  const buttons = [
    {
      name: "Close",
      variant: "outline-secondary",
      handleClick: () => handleClose(),
    },
    {
      name: "Confirm",
      variant: "primary",
      handleClick: () => handleSubmit(),
      className: "btn-confirm-primary",
    },
  ];
  return (
    <>
      {show && (
        <SimpleModal
          title={"Return to Current View"}
          handleClose={handleClose}
          buttons={buttons}
          size="md"
        >
          <div>
            <br />
            Hold on! We're returning you to the current profile view
            <br />
            <br />
          </div>
        </SimpleModal>
      )}
      <div className="pending-changes-header-title">
        View profile change history
        <li
          className={`fa-regular ${
            collapse ? "fa-angle-down" : "fa-angle-up"
          } fa-space`}
          onClick={handleCollapse}
        />
      </div>
      <div className={`${collapse ? "table-hidden" : "table-show"}`}>
        {isLoading ? (
          <PropSpiner label="Loading ..." />
        ) : (
          <ReactTable
            columns={columns}
            list={dataPendingChanges}
            isLoading={isDataPendingChangesLoading}
            pageSize={10}
            customTheme={{
              Table: `--data-table-library_grid-template-columns: minmax(135px, 1fr) minmax(200px, 1fr) minmax(150px, 1fr) minmax(350px, 1fr) minmax(180px, 1fr) minmax(120px, 1fr) minmax(50px, 1fr);`,
            }}
            hasPagination
          />
        )}
      </div>
    </>
  );
};
export default PendingChanges;
