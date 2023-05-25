import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DWNApp } from "./DWNApp";
import "./styles.scss";
import "react-tabs/style/react-tabs.css";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <DWNApp />
    </MsalProvider>
  </BrowserRouter>
);
