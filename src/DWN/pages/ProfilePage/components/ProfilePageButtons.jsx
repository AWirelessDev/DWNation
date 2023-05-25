import { Button } from "react-bootstrap";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { ReactDatePicker } from "../../../components";

export const ProfilePageButtons = ({
  editable,
  handleSetCancel,
  handleSetSave,
  profileFormState,
  headerFields,
  hasEditPermission,
  collapse,
  effectiveDate,
  handleSetShow,
  currentDate,
  setEffectiveDate,
  isContractor,
  isLoading = false,
}) => {
  const minDate = moment().toDate();
  const maxDate = moment().add(2, "months").toDate();

  const errors =
    profileFormState?.form?.errors?.length && !hasEditPermission
      ? profileFormState?.form?.errors?.filter(
          (item) =>
            ![
              "supervisorMDMWorkerId",
              "companyId",
              "organizationRoleId",
              "hireDate",
              "programCodeId",
              "jobCodeId",
            ].includes(item?.key)
        )
      : profileFormState?.form?.data?.SendToOmni
      ? profileFormState?.form?.errors
      : profileFormState?.form?.errors?.filter(
          (item) => !["programCodeId", "jobCodeId"].includes(item?.key)
        );

  return (
    <div>
      {editable && (
        <div className="effective-date-now-message-show-mobile">
          Changes can take up to 30 minutes from effective date to apply.{" "}
        </div>
      )}
      <div className="d-flex flex-row-reverse px-2">
        {editable && (
          <Button
            variant="danger"
            className="btn-cancel"
            onClick={handleSetCancel}
          >
            Cancel
          </Button>
        )}
        {editable && (
          <Button
            variant="success"
            className="btn-save"
            onClick={handleSetSave}
            disabled={
              (!profileFormState?.hasFormChanges &&
                !headerFields.hasHeaderChanges) ||
              (isContractor &&
                (!headerFields.preferredFirstName ||
                  !headerFields.legalLastName ||
                  !headerFields.legalFirstName ||
                  !headerFields.titleId ||
                  !headerFields.locationLevelId)) ||
              errors?.length
            }
          >
            Save
          </Button>
        )}
        {!editable && collapse && !isLoading && (
          <Button variant="outline-secondary" size="lg" onClick={handleSetShow}>
            <FontAwesomeIcon icon={faEdit} className="search-icon" /> Edit
          </Button>
        )}
        &nbsp; &nbsp;
        {editable && (
          <div>
            <ReactDatePicker
              className="p-2 effective-date"
              placeholder="Effective Date - NOW"
              handleDateChange={(selectedDate) =>
                setEffectiveDate(selectedDate)
              }
              startDate={effectiveDate}
              minDate={currentDate}
              maxDate={maxDate}
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              timeIntervals={60}
              minTime={
                moment(effectiveDate).format("MM/dd/yyy") ===
                moment(currentDate).format("MM/dd/yyy")
                  ? setHours(
                      setMinutes(currentDate, currentDate.getMinutes()),
                      currentDate.getHours()
                    )
                  : null
              }
              maxTime={
                moment(effectiveDate).format("MM/dd/yyy") ===
                moment(currentDate).format("MM/dd/yyy")
                  ? setHours(setMinutes(currentDate, 45), 23)
                  : null
              }
            />
          </div>
        )}
        &nbsp;
        {editable && (
          <div className="effective-date-now-message">
            Changes can take up to 30 minutes from effective date to apply.{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageButtons;
