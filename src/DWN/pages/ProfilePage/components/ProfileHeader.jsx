import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import DropDown from "./DropDown/DropDown";
import "../ProfilePage.scss";
import "../../../../styles.scss";
import BinaryImage from "../../../components/BinaryImage/BinaryImage";
import InputField from "./InputField/InputField";
import { AlphaNumericValidator } from "../../../../validators";
import LocationsModal from "./LocationsModal";

export const ProfileHeader = ({
  position,
  email,
  pendingChanges,
  editable,
  lookups = {},
  setHeaderFields,
  headerFields,
  ppimage,
  hasEditPermission = false,
  hasManagerPermission = false,
  isContractor = false,
  locations,
  positions,
  locationList = [],
}) => {
  const handleChange = (e) => {
    if (AlphaNumericValidator(e.target.value?.toString())) {
      setHeaderFields({
        ...headerFields,
        [e.target.name]: e.target.value,
        hasHeaderChanges: true,
      });
    }
  };

  const primaryLocation = locations.filter(
    (location) => location.assignmentType === "Primary"
  );

  const secondaryLocations = locations.filter(
    (location) => location.assignmentType !== "Primary"
  );

  return (
    <>
      <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
        <div className="me-7 mb-4 mx-auto">
          <div className="symbol ">
            <BinaryImage
              base64Data={ppimage}
              altText={"My picture Profile"}
              altClassName="profile-img"
            />
          </div>
        </div>
        <div className="flex-grow-1 ">
          <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
            <div className="d-flex flex-column">
              {!editable ? (
                <>
                  <div className="d-flex flex-row  flex-wrap flex-row-cols-sm-1 flex-row-cols-md-4 flex-row-cols-lg-4 flex-row-cols-xl-4 center-sm">
                    <div className="pt-1 bd-highlight profile-name ">
                      <h2
                        id="preferredFirstName"
                        className={`${
                          pendingChanges?.includes("legalFirstName")
                            ? "highlight-background-pending-change bd-highlight profile-name"
                            : "bd-highlight profile-name"
                        }`}
                      >
                        {headerFields?.legalFirstName} &nbsp;
                      </h2>
                      {pendingChanges?.includes("legalFirstName") && (
                        <div className="highlight-pending-change">
                          Pending change
                        </div>
                      )}
                    </div>
                    <div>
                      {headerFields?.preferredFirstName &&
                        headerFields?.preferredFirstName?.toLowerCase() !==
                          headerFields?.legalFirstName?.toLowerCase() && (
                          <div
                            className={`${
                              pendingChanges?.includes("preferredFirstName")
                                ? "highlight-background-pending-change bd-highlight profile-name"
                                : "bd-highlight profile-name"
                            }`}
                          >
                            ({headerFields?.preferredFirstName}) &nbsp;
                          </div>
                        )}

                      {pendingChanges?.includes("preferredFirstName") && (
                        <div className="highlight-pending-change">
                          Pending change
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className={`${
                          pendingChanges?.includes("legalLastName")
                            ? "highlight-background-pending-change bd-highlight profile-name"
                            : "bd-highlight profile-name"
                        }`}
                      >
                        {headerFields?.legalLastName} &nbsp;
                      </div>
                      {pendingChanges?.includes("legalLastName") && (
                        <div className="highlight-pending-change">
                          Pending change
                        </div>
                      )}
                    </div>
                    {headerFields?.pronounId ? (
                      <div className="p-2 bd-highlight">
                        <div
                          id="pronounsId"
                          className={`${
                            pendingChanges?.includes("pronounsId") &&
                            "highlight-background-pending-change"
                          }`}
                        >
                          {headerFields?.pronounId
                            ? lookups?.pronouns?.find((pronoun) => {
                                return (
                                  pronoun.lookupValuePK ===
                                  headerFields?.pronounId
                                );
                              })?.lookupName
                            : null}
                        </div>
                        {pendingChanges?.includes("pronounsId") && (
                          <div className="highlight-pending-change">
                            Pending change
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={`${
                      pendingChanges?.includes("positionId")
                        ? "highlight-background-pending-change d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm"
                        : "d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm"
                    } `}
                  >
                    <a>{position}</a>
                  </div>
                  {pendingChanges?.includes("positionId") && (
                    <div className="highlight-pending-change">
                      Pending change
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2">
                    <div className="col">
                      <InputField
                        id="legalFirstName"
                        label="Legal First Name"
                        name="legalFirstName"
                        value={headerFields?.legalFirstName}
                        onChange={handleChange}
                        disabled={
                          !(
                            (hasEditPermission || hasManagerPermission) &&
                            isContractor
                          )
                        }
                        errors={
                          headerFields?.legalFirstName
                            ? []
                            : [
                                {
                                  key: "legalFirstName",
                                  message: "Legal First Name is required",
                                },
                              ]
                        }
                      />
                      <InputField
                        id="legalLastName"
                        label="Legal Last Name"
                        name="legalLastName"
                        value={headerFields?.legalLastName}
                        onChange={handleChange}
                        disabled={
                          !(
                            (hasEditPermission || hasManagerPermission) &&
                            isContractor
                          )
                        }
                        errors={
                          headerFields?.legalLastName
                            ? []
                            : [
                                {
                                  key: "legalLastName",
                                  message: "Legal Last Name is required",
                                },
                              ]
                        }
                      />
                    </div>
                    <div className="col">
                      <InputField
                        id="preferredFirstName"
                        label="Preferred First Name"
                        name="preferredFirstName"
                        value={headerFields?.preferredFirstName}
                        onChange={handleChange}
                        disabled={
                          !(
                            (hasEditPermission || hasManagerPermission) &&
                            isContractor
                          )
                        }
                        errors={
                          headerFields?.preferredFirstName
                            ? []
                            : [
                                {
                                  key: "preferredFirstName",
                                  message: "Preferred First Name is required",
                                },
                              ]
                        }
                      />
                      <DropDown
                        id="pronounId"
                        value={headerFields?.pronounId}
                        onInputChange={handleChange}
                        editable={!editable}
                        placeholder="Select the Pronouns"
                        label="Pronouns"
                        name="pronounId"
                        pendingChanges={pendingChanges}
                        options={lookups?.pronouns || []}
                        optionLabel="lookupName"
                        optionValue="lookupValuePK"
                      />
                    </div>
                  </div>
                  <DropDown
                    id="positionId"
                    label="Position"
                    value={headerFields?.titleId}
                    onInputChange={handleChange}
                    isDisabled={
                      !(
                        (hasEditPermission || hasManagerPermission) &&
                        isContractor
                      )
                    }
                    placeholder="Select the Position"
                    name="titleId"
                    pendingChanges={pendingChanges}
                    options={positions || []}
                    optionLabel="lookupName"
                    optionValue="lookupValuePK"
                    errors={
                      headerFields?.titleId
                        ? []
                        : [
                            {
                              key: "titleId",
                              message: "Position is required",
                            },
                          ]
                    }
                  />
                  <br />
                </>
              )}
              <div className="d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm">
                <a className="profile-head-email" href={`mailto:${email}`}>
                  <FontAwesomeIcon icon={faEnvelope} /> {email}
                </a>
              </div>
              {editable && isContractor ? (
                <div>
                  <DropDown
                    id="mdmLocationLevelId"
                    label="Primary Location(s)"
                    placeholder="Select the Primary Location"
                    value={headerFields?.locationLevelId || null}
                    onInputChange={handleChange}
                    name="locationLevelId"
                    pendingChanges={pendingChanges}
                    options={locationList || []}
                    optionLabel="locationName"
                    optionValue="mdmLocationLevelId"
                    isDisabled={!hasEditPermission || !isContractor}
                    errors={
                      headerFields?.locationLevelId
                        ? []
                        : [
                            {
                              key: "locationLevelId",
                              message: "Primary Location is required",
                            },
                          ]
                    }
                  />
                  <br />
                </div>
              ) : (
                <div>
                  <div
                    className={`${
                      pendingChanges?.includes("mdmLocationLevelId")
                        ? "highlight-background-pending-change d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm"
                        : "d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm"
                    } `}
                  >
                    <div className="d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm">
                      <a>Primary Location(s): &emsp;&emsp;&emsp;</a>{" "}
                    </div>
                    <LocationsModal
                      locations={primaryLocation || []}
                      title="Primary Location(s)"
                    />
                  </div>

                  {pendingChanges?.includes("mdmLocationLevelId") && (
                    <div className="highlight-pending-change">
                      Pending change
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm">
                <div className="d-flex flex-wrap fs-6 mb-2 pe-2 profile-head-dat center-sm">
                  <a>Secondary Location(s): &emsp;</a>
                </div>
                <LocationsModal
                  locations={
                    secondaryLocations?.sort((a, b) =>
                      a.locationName > b.locationName ? 1 : -1
                    ) || []
                  }
                  title="Secondary Location(s)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileHeader;
