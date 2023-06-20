import React, {  useReducer } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import EventsTable from "./components/EventsTable";
import PeopleTable from "./components/PeopleTable";
import { initialState, formReducer } from "../../../Reducer/FormReducer";
import "./DashboardPage.scss";
import { useContext } from "react";
import { ActionContext } from "../../provider/ActionProvider";

export const DashboardPage = () => {
  const [dashboardState, dashboardDispatch] = useReducer(
    formReducer,
    initialState
  );

  const actionContext = useContext(ActionContext);
  const { tabState, tabDispatch} = actionContext;
  return (
    <div>
      <br />
      <h2 className="title-pmc">DW Nation </h2>
      <br />
      <Tabs
        className={"tab-body left"}
        selectedIndex={tabState.tabIndex}
        onSelect={(index) => tabDispatch({ type: "CURRENT_TAB", tabIndex: index })}
      >
        <TabList className={"tab-dash-list d-flex gap-1"}>
          <Tab>Events</Tab>
        </TabList>
        <TabPanel>
          <EventsTable
            dispatch={dashboardDispatch}
            dashboardState={dashboardState}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};
