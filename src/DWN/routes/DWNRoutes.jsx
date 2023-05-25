import React, { Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "../../layout";
import { DashboardPage, ContractorPage, PeopleProfilePage } from "../pages";
import {
  RoleProvider,
  LookupsProvider,
  ActionProvider,
  RoleContext,
} from "../provider";
import FCADPage from "../pages/FCADPage/FCADPage";
import { PIP } from "../pages/PIPEGETPage/PIP_EGET_Page";
import { PIPCX } from "../pages/PIPCXPage/PIPCX_Page";
import { MoveDemotionPage } from "../pages/MoveDemotionPage/MoveDemotionPage";
import TerminationPage from "../pages/TerminationPage/TerminationPage";
import { LoaPage } from "../pages/LoaPage/LoaPage";
import { AddContractor } from "../pages/AddContractorPage/AddContractor";
import { PropSpiner } from "../components";
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
    <PropSpiner label="Loading..." />;
  } else {
     return (
      <ActionProvider>
        <LookupsProvider>
          <Navbar />
          <div className="container-fluid z-index-0 position-relative">
            <Suspense
              fallback={
                <div className="d-flex w-100 align-items-center justify-content-center vh-100">
                  <PropSpiner label="Loading..." />
                </div>
              }
            >
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="contractor" element={<ContractorPage />} />
                <Route path="loa" element={<LoaPage />} />
                <Route path="movedemotion" element={<MoveDemotionPage />} />
                <Route exact path="profile" element={<PeopleProfilePage />} />
                <Route path="termination" element={<TerminationPage />} />
                <Route path="fcad" element={<FCADPage />} />
                <Route path="pip" element={<PIP />} />
                <Route path="pipcx" element={<PIPCX />} />
                <Route path="addcontractor" element={<AddContractor />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/*" element={<ErrorPage code={404} />} />
                <Route path="/error/:code" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </div>
        </LookupsProvider>
      </ActionProvider>
     );
   }
};
