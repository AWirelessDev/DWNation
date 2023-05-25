import React, { useState, useContext, useReducer, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMsal } from "@azure/msal-react";
import { useFetch } from "../../../hooks/useFetch";
import {
  PeopleTimeline,
  ProfileForm,
  ProfileHeader,
  HistoryTable,
  PendingChanges,
  ProfilePageButtons,
  hasHrAdminPermission,
} from "./components";
import {
  Card,
  CardDrpActions,
  PropSpiner,
  SimpleModal,
  Breadcrumb,
} from "../../components/";
import { AlertNoData } from "../../components/Alerts/AlertNoData";
import { LookupsContext, RoleContext } from "../../provider";
import {
  formatDataAndPost,
  fetchPendingChangesApi,
  UPDATE_CORRECTLY,
  VICTRA_CLASSIFICATION_ID,
  getEmployeeDetailsById,
} from "./ProfilePageHelper";
import { initialState, formReducer } from "../../../Reducer/FormReducer";
import { isLoginUserAdmin } from "../../helpers";
import { ReactToast } from "../../components/Toast/ReactToast";
import "./ProfilePage.scss";
import { getApi } from "../../../helpers";

export const PeopleProfilePage = ({}) => {
  const currentDate = new Date();
  const [profileFormState, dispatch] = useReducer(formReducer, initialState);
  const [collapse, setCollapse] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [editable, setEditable] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(currentDate);
  const navigate = useNavigate();
  const [showAfSave, setShowAfSave] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [pendingChangesList, setPendingChangesList] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const { lookups, visionRoles, positions } = useContext(LookupsContext);
  const loginUserDetails = useContext(RoleContext);
  const location = useLocation();
  const { id = "", historySearch = "" } = 1;//queryString.parse(location.search);
  const hasViewPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasEditPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasManagerPermission = ""
    //loginUserDetails?.data.mdmWorkerId.toString() !== ""// id.toString();
  const { accounts, instance } = useMsal();
  const {
    VITE_REACT_URL_API_PMC,
    VITE_EVENTS_FUNCTION_KEY_PMC,
    VITE_REACT_URL_API_VISION3,
    VITE_FUNCTION_KEY_VISION3,
    VITE_REACT_URL_API_MDM,
    VITE_FUNCTION_KEY_MDM,
  } = import.meta.env;

  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------

  const [DataPeople, setDataPeople] = useState(null);
  const [loadingPeopleData, setLoadingPeopleData] = useState(true);
  const fetchEmployeeData = async () => {
    const responseData = await getEmployeeDetailsById(
      `${VITE_REACT_URL_API_PMC}/GetEmployeeDetailsById/${id}`,
      { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (responseData.isValid === false) {
      setLoadingPeopleData(false);
      navigate(`/error/${responseData.status}`);
      return;
    }
    const _locations = await getApi(
      `${VITE_REACT_URL_API_MDM}/GetAllLocationLevelsForBusinessGroup/${
        responseData.bussinessGroupId || 1
      }`,
      {
        "x-functions-key": VITE_FUNCTION_KEY_MDM,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (_locations?.length) {
      setLocationList(_locations);
    } else {
      setLocationList([]);
    }
    setDataPeople(responseData);
    let locationId = 0;
    if (responseData?.locations?.length) {
      const primaryLocations = responseData.locations.find(
        (location) => location.assignmentType === "Primary"
      );
      locationId = primaryLocations?.mdmLocationLevelId || 0;
    }
    const values = {
      legalFirstName: responseData?.legalFirstName,
      legalLastName: responseData?.legalLastName,
      preferredFirstName: responseData?.preferredFirstName,
      pronounId: responseData?.pronounId,
      titleId: responseData?.titleId,
      locationLevelId: locationId,
      hasHeaderChanges: false,
    };
    setHeaderFields(values);
    setHeaderValues(values);
    setLoadingPeopleData(false);
  };
  useEffect(() => {
    fetchEmployeeData();
  }, []);
  const [DataHis, loading] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetEventsByEmployeeId/${id}`,
    { "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC }
  );
  const [dataPendingChanges, isDataPendingChangesLoading] = useFetch(
    `${VITE_REACT_URL_API_PMC}/GetEmployeeEvents/${id}`,
    {
      "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
    }
  );

  const [uplineManager, setUplineManager] = useState(false);
  const [headerFields, setHeaderFields] = useState({});
  const [headerValues, setHeaderValues] = useState({});

  /**
   *  This useEffect is to used when user delete/remove all pending changes then
   *  set collapse false and show Edit
   */
  useEffect(() => {
    setPendingChanges(null);
    setCollapse(true);
  }, [pendingChangesList]);

  useEffect(() => {
    if (DataPeople?.mdmWorkerId) {
      const isDownlineManager = getApi(
        `${VITE_REACT_URL_API_VISION3}/CheckDownlineWorker/${DataPeople?.mdmWorkerId}/false`,
        { "x-functions-key": `${VITE_FUNCTION_KEY_VISION3}` },
        accounts,
        instance,
        impersonation,
        impersonEmail
      );

      if (isDownlineManager) setUplineManager(isDownlineManager);
    }
  }, [DataPeople?.mdmWorkerId]);

  useEffect(() => {
    setPendingChangesList(dataPendingChanges);
  }, [dataPendingChanges]);
  // initial Changes
  useEffect(() => {
    dispatch({
      type: "INITIAL_FORM_DATA",
      form: { data: {} },
      hasFormChanges: false,
    });
  }, []);

  const showPendingChanges = (data) => {
    setPendingChanges(data);
  };

  const handleSetShow = () => {
    setEffectiveDate(new Date());
    setEditable(true);
  };

  let ItemsDrp = [];

  if (loginUserDetails?.data.mdmWorkerId?.toString() !== id) {
    ItemsDrp = [
      "Performance Improvement Plan - EGET",
      "Performance Improvement Plan - CX",
      "SCF Move/Demotion",
      "SCF Termination",
    ];

    if (
      (isLoginUserAdmin() || uplineManager) &&
      loginUserDetails?.data.mdmWorkerId?.toString() !== id
    ) {
      ItemsDrp.unshift("Formal Coaching and Documentation");
    }
  }

  const handleClose = () => {
    setShowAfSave(false);
  };

  const fetchPermissions = async () => {
    const employeePermissions = await getApi(
      `${VITE_REACT_URL_API_VISION3}/GetUserPermissions/${DataPeople.mdmWorkerId}`,
      {
        "x-functions-key": VITE_FUNCTION_KEY_VISION3,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (employeePermissions?.roles?.length) {
      const roles = employeePermissions?.roles.map((role) => {
        return visionRoles.find((_visionRole) => {
          return _visionRole.name === role;
        })?.id;
      });
      setEmployeeRoles(roles);
    }
  };

  const postDataEmployeeDetails = async () => {
    setShowAfSave(false);
    if (profileFormState?.form?.errors?.length) {
      // if admin/hr no need to remove any keys else we have to remove below keys for manager
      let removeKeys = hasEditPermission
        ? []
        : [
            "supervisorMDMWorkerId",
            "companyId",
            "organizationRoleId",
            "hireDate",
            "programCodeId",
            "jobCodeId",
          ];

      // omni flag false remove program and job code
      if (!profileFormState?.form?.data?.SendToOmni) {
        removeKeys = [...removeKeys, "programCodeId", "jobCodeId"];
      }

      if (
        profileFormState?.form?.data?.classificationId ===
        VICTRA_CLASSIFICATION_ID
      ) {
        // for victra employee remove reports to
        removeKeys = [...removeKeys, "supervisorMDMWorkerId"];
        const errors = profileFormState?.form?.errors?.filter((error) => {
          return !removeKeys.includes(error?.key);
        });
        if (errors?.length) {
          return;
        }
      } else {
        const errors = profileFormState?.form?.errors?.filter((error) => {
          return !removeKeys.includes(error?.key);
        });
        if (errors?.length) {
          return;
        }
      }
    }
    const updateState = {
      ...profileFormState?.form?.data,
      gender:
        headerFields?.pronounId !== DataPeople?.pronounId
          ? headerFields?.pronounId
          : null,
      preferredFirstName:
        headerFields?.preferredFirstName !== DataPeople?.preferredFirstName
          ? headerFields?.preferredFirstName
          : null,
      legalFirstName:
        headerFields?.legalFirstName !== DataPeople?.legalFirstName
          ? headerFields?.legalFirstName
          : null,
      legalLastName:
        headerFields?.legalLastName !== DataPeople?.legalLastName
          ? headerFields?.legalLastName
          : null,
      positionId:
        headerFields?.titleId?.toString() !== DataPeople?.titleId?.toString()
          ? headerFields?.titleId?.toString()
          : null,
      locationLevelId:
        headerFields?.locationLevelId?.toString() !==
        headerValues?.locationLevelId?.toString()
          ? headerFields?.locationLevelId?.toString()
          : null,
    };
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: { data: profileFormState?.form?.data, isFetchLoading: true },
      hasFormChanges: false,
    });

    const apiData = await formatDataAndPost(
      updateState,
      DataPeople,
      employeeRoles,
      loginUserDetails,
      effectiveDate,
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    if (apiData?.eventId) {
      const _pendingChangesList = await fetchPendingChangesApi(
        apiData.mdmEmployeeId,
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      await fetchEmployeeData();
      await fetchPermissions();
      setPendingChangesList(_pendingChangesList);
      setEditable(false);
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: { data: {} },
        hasFormChanges: false,
      });
      setToastMessage({
        title: "Saved",
        position: "top-center",
        EventTime: "",
        Delay: 15000,
        classbg: "success",
        children: <div>{"Profile saved successfully"}</div>,
      });
    } else {
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: { data: profileFormState?.form?.data },
        hasFormChanges: apiData !== UPDATE_CORRECTLY,
      });
      setToastMessage({
        title: "Error",
        position: "top-center",
        EventTime: "",
        Delay: 15000,
        classbg: "danger",
        children: (
          <div className="error-toast-message">
            {apiData === UPDATE_CORRECTLY
              ? UPDATE_CORRECTLY
              : "Unable to save the employee profile details."}
            {apiData.message === "Invalid MDMEmployeeId!" ? (
              <div className="offwhite fw-normal mt-2">
                {DataPeople.legalFirstName} {DataPeople.legalLastName} does not
                yet exist within PMC, please try again in 15 minutes.
              </div>
            ) : null}
          </div>
        ),
      });
    }
  };

  const handleSetSave = () => {
    postDataEmployeeDetails();
  };

  const handleSetCancel = () => {
    setEditable(false);
    setShowAfSave(false);
    setHeaderFields(headerValues);
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: { data: {} },
      hasFormChanges: false,
    });
  };

  const buttons = [
    {
      name: "Close",
      variant: "outline-secondary",
      handleClick: () => handleClose(),
    },
    {
      name: "Confirm",
      variant: "primary",
      handleClick: () => postDataEmployeeDetails(),
      className: "btn-confirm-primary",
    },
  ];

  const [employeeRoles, setEmployeeRoles] = useState([]);
  useEffect(() => {
    if (DataPeople?.mdmWorkerId) {
      fetchPermissions();
    }
  }, [DataPeople?.mdmWorkerId]);

  const isContractor =
    DataPeople?.classificationId !== VICTRA_CLASSIFICATION_ID;
  return (
    <>
      <br />
      <Breadcrumb />
      <br />

      <CardDrpActions
        key={DataPeople}
        title={"Employee Profile"}
        titleDrp={"Create"}
        ItemsDrp={ItemsDrp}
        OnId={id}
        disabled={DataPeople?.statusId === "WRKST2" || !ItemsDrp?.length}
        isLoading={loadingPeopleData}
      >
        {loadingPeopleData || profileFormState?.form?.isFetchLoading ? (
          <div style={{ textAlign: "center" }}>
            <PropSpiner label="Loading ..." />
          </div>
        ) : DataPeople ? (
          <ProfileHeader
            key={`header-${editable}-${headerFields}-${employeeRoles}`}
            email={DataPeople?.email}
            position={DataPeople?.title}
            pendingChanges={pendingChanges}
            editable={editable}
            lookups={lookups}
            headerFields={headerFields}
            setHeaderFields={setHeaderFields}
            ppimage={DataPeople?.image}
            hasEditPermission={hasEditPermission}
            hasManagerPermission={hasManagerPermission}
            isContractor={isContractor}
            locations={DataPeople?.locations}
            positions={positions}
            locationList={locationList}
          />
        ) : (
          <AlertNoData />
        )}
        <br></br>
        {loading ||
        profileFormState?.form?.isFetchLoading ||
        loadingPeopleData ? (
          ""
        ) : DataHis ? (
          <PeopleTimeline Data={DataHis} />
        ) : (
          <AlertNoData />
        )}
        <hr className="separator mt-0 mx-auto" />
        {loading ||
        profileFormState?.form?.isFetchLoading ||
        loadingPeopleData ? (
          <div style={{ textAlign: "center" }}>
            <PropSpiner label="Loading ..." />
          </div>
        ) : (
          <div key={`block=${editable}`}>
            <ProfileForm
              key={`form-${editable}-${DataPeople}-${employeeRoles}`}
              Data={DataPeople}
              pendingChanges={pendingChanges}
              Editable={!editable}
              dispatch={dispatch}
              profileFormState={profileFormState}
              hasViewPermission={hasViewPermission}
              hasEditPermission={hasEditPermission}
              hasManagerPermission={hasManagerPermission}
              employeeRoles={employeeRoles}
              isOwnProfile={
                loginUserDetails?.data.mdmWorkerId?.toString() === id
              }
              headerFields={headerFields}
            />
            {!editable && pendingChangesList?.length > 0 ? (
              <PendingChanges
                setCollapse={setCollapse}
                collapse={collapse}
                showPendingChanges={showPendingChanges}
                dataPendingChanges={pendingChangesList || []}
                isDataPendingChangesLoading={isDataPendingChangesLoading}
                setPendingChangesList={setPendingChangesList}
                setToastMessage={setToastMessage}
              />
            ) : null}
          </div>
        )}
        <hr className="separator mx-auto" />
        {!profileFormState?.form?.isFetchLoading && (
          <ProfilePageButtons
            isLoading={loadingPeopleData}
            editable={editable}
            handleSetCancel={handleSetCancel}
            handleSetSave={handleSetSave}
            profileFormState={profileFormState}
            headerFields={headerFields}
            collapse={collapse}
            effectiveDate={effectiveDate}
            handleSetShow={handleSetShow}
            currentDate={currentDate}
            setEffectiveDate={setEffectiveDate}
            hasEditPermission={hasEditPermission}
            isContractor={isContractor}
          />
        )}
        <br />
      </CardDrpActions>
      <br />
      <Card title={"History"}>
        <HistoryTable DataHis={DataHis} isLoading={loading} />
      </Card>

      {showAfSave && (
        <SimpleModal
          title={"Confirm Changes"}
          handleClose={handleClose}
          buttons={buttons}
          drop={false}
          size="lg"
        >
          <div>
            <br />
            Please be informed that changing the Preferred First Name will also
            change the email address to match the new first name. This will
            happen once the changes have been synced across all the systems.
            Confirmation is needed from you.
            <br />
          </div>
        </SimpleModal>
      )}

      {toastMessage && (
        <ReactToast
          handleClose={() => setToastMessage(null)}
          {...toastMessage}
        />
      )}
    </>
  );
};
