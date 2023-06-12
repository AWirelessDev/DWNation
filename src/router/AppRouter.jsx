import { Route, Routes } from "react-router-dom";
import { DWNRoutes } from "../DWN"
import { LoginPage } from "../auth";
import { useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

export const AppRouter = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  useEffect(() => {
    if (!isAuthenticated) {
      instance.loginRedirect();
    }
  });

  // const appInsights = new ApplicationInsights({
  //   config: {
  //     instrumentationKey: "569c90da-8369-433e-9166-24ccee999cff",
  //   },
  // });

  // appInsights.loadAppInsights();

  // // Track Page Views
  // appInsights.trackPageView({
  //   name: "Home DWN",
  //   uri: window.location.pathname,
  // });

  // // Track User Interactions
  // const trackClick = (event) => {
  //   appInsights.trackEvent({ name: "Clicked Button" });
  // };

  // trackClick();

  // const trackFormSubmit = (event) => {
  //   appInsights.trackEvent({ name: "Submitted Form" });
  // };

  // trackFormSubmit();

  // // Track Performance Metrics
  // const startTime = performance.now();

  // // Log time taken to load the page
  // appInsights.trackMetric({
  //   name: "Page Load Time",
  //   value: (performance.now() - startTime) / 1000,
  // });

  // Track Exceptions
  /* 
  window.onerror = (message, source, lineNumber, columnNumber, error) => {
    appInsights.trackException({ exception: error });
  };
 */
  return (
    <>
      <Routes>
        <Route path="login" element={isAuthenticated ? <LoginPage /> : null} />
        <Route path="/*" element={<DWNRoutes />}/>
      </Routes>
    </>
  );
};
