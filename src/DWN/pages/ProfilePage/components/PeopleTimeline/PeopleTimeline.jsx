import React from "react";
import moment from "moment";

import "./PeopleTimeline.scss";
import { ProgressType } from "../PeopleTimeline/ProgressType";

export const PeopleTimeline = ({ Data }) => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const DataToShow = Data?.length
    ? Data?.filter((Data) => Data.showOnTimeline === true)
    : [];
  const DataToShowOrd = DataToShow.sort(
    (firstItem, secondItem) => firstItem.activityId - secondItem.activityId
  );
  let DataToShowCrr = [
    ...DataToShowOrd,
    {
      activityId: 99999,
      code: "current",
      displayName: "Current",
      activityTypeId: 0,
      mdmEmployeeId: 0,
      activityStatusId: 0,
      statusTypeCode: "APPR",
      statusTypeDesc: "Approved",
      createdBy: 0,
      storeName: "",
      districtRqId: 0,
      districtName: "",
      regionRqId: 0,
      regionName: "",
      createdDateTime: todayDate,
      area: "",
      showOnTimeline: true,
      businessUnit: "0",
      submittedBy: "PMC",
      userName: "PMC",
      effectiveDatetime: todayDate,
    },
  ];
  const EventsCnt = "events" + DataToShowCrr.length;
  const sortByDate = (DataToShowCrr) => {
    const sorter = (a, b) => {
      return (
        new Date(a.effectiveDatetime).getTime() -
        new Date(b.effectiveDatetime).getTime()
      );
    };
    DataToShowCrr.sort(sorter);
  };
  sortByDate(DataToShowCrr);
  return (
    <>
      <div className="d-flex flex-wrap ">
        <div className="timeline">
          <div className="events ">
            <ol>
              <ul>
                {DataToShowCrr?.map((experience, i) => {
                  return (
                    <li
                      className={EventsCnt}
                      key={experience.toString() + `${i}`}
                    >
                      <div className="position-relative">
                        <div className="position-inherit">
                          <ProgressType
                            value={experience.displayName}
                            efecdate={moment(
                              experience.effectiveDatetime
                            ).format("MM/DD/YYYY")}
                            submiss={experience.submittedBy}
                            ActId={experience.activityId}
                            code={experience.code}
                          />
                        </div>
                        <div className="TimeLineUp">
                          <br />
                          <span
                            className={
                              experience.displayName === "Current"
                                ? "ProgressLabel float-start px-2 d-none d-sm-block"
                                : "ProgressLabel float-start d-none d-sm-block"
                            }
                          >
                            {experience.displayName}
                          </span>
                          <br />
                          <span
                            className={
                              experience.displayName === "Current"
                                ? "ProgressLabelData  float-start px-2 d-none d-sm-block"
                                : "ProgressLabelData float-start d-none d-sm-block"
                            }
                          >
                            {moment(experience.effectiveDatetime).format(
                              "MM/DD/YYYY"
                            )}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};
