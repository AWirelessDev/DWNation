import React from "react";
import ActivityLog from "../components/ActivityLog/ActivityLog";
import ActivityHistory from "../components/ActivityHistory/ActivityHistory";

export const CommonHistoryLog = ({ activityId, mdmEmployeeId}) => {
  return (
    <>
      <ActivityHistory id={mdmEmployeeId} />
      <br />
      <ActivityLog id={activityId} />
    </>
  );
};
