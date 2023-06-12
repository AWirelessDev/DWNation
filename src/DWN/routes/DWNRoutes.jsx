import React, { Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "../../layout";
import { DashboardPage, PeopleProfilePage } from "../pages";
import {
  RoleProvider,
  LookupsProvider,
  ActionProvider,
  RoleContext,
} from "../provider";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";

export const DWNRoutes = () => {
  return (
    <>    
    <RoleProvider>
      <DWNAppRoutes />      
     </RoleProvider>
    </>
  );
};

export const DWNAppRoutes = () => {
  const RoleCtx = useContext(RoleContext);
  if (RoleCtx.isLoading) {
    // <PropSpiner label="Loading..." />;
  } else {
     return (
      <ActionProvider>
        
          {/* <Navbar /> */}
          <div className="container-fluid z-index-0 position-relative">
            <Suspense
              fallback={
                <div className="d-flex w-100 align-items-center justify-content-center vh-100">
                  {/* <PropSpiner label="Loading..." /> */}
                </div>
              }
            >
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />                
                <Route exact path="profile" element={<PeopleProfilePage />} />                
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/*" element={<ErrorPage code={404} />} />
                <Route path="/error/:code" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </div>        
      </ActionProvider>
     );
   }
};
