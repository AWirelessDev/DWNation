import React, {  useReducer } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CustomersTable from "./components/CustomersTable";
import TransactionTable from "./components/TransactionTable";
import { initialState, formReducer } from "../../../Reducer/FormReducer";
import "./DashboardPage.scss";
import { useContext } from "react";
import { ActionContext } from "../../provider/ActionProvider";

export const DashboardPage = () => {
  const [dashboardState, dashboardDispatch] = useReducer(
    formReducer,
    initialState
  );

  //const actionContext = useContext(ActionContext);
  //const { tabState, tabDispatch} = actionContext;
  return (
    <div>
      <br />
      <h2 className="title-dwn">DW Nation Customers </h2>
      <br />
      <Tabs
        className={"tab-body left"}
       // selectedIndex={tabState.tabIndex}
       // onSelect={(index) => tabDispatch({ type: "CURRENT_TAB", tabIndex: index })}
      >
        <TabList className={"tab-dash-list d-flex gap-1"}>
          <Tab>Customers</Tab>
          <Tab>Transactions</Tab>
        </TabList>
        <TabPanel>
          <CustomersTable
            dispatch={dashboardDispatch}
            dashboardState={dashboardState}
          />
       </TabPanel>
        <TabPanel>
          <TransactionTable
            dispatch={dashboardDispatch}
            dashboardState={dashboardState}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};
