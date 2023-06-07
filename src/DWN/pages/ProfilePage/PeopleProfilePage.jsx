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
  getCustomerDetailsByPhone,
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
  const { phone = "", historySearch = "" } = queryString.parse(location.search);
  const hasViewPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasEditPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasManagerPermission = ""
    //loginUserDetails?.data.mdmWorkerId.toString() !== ""// id.toString();
  const { accounts, instance } = useMsal();
  const {
    VITE_REACT_URL_API_SUB,
    VITE_OCP_APIM_SUBSCRIPTION_KEY
  } = import.meta.env;

  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------

  const [DataPeople, setDataPeople] = useState(null);
  const [loadingPeopleData, setLoadingPeopleData] = useState(true);
  const fetchEmployeeData = async () => {
    const responseData = await getCustomerDetailsByPhone(
      `${VITE_REACT_URL_API_SUB}?phoneNumber=${phone}`,
    { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY },   
      accounts,
      instance,
      impersonation,
      impersonEmail
    );
    // const responseData = [
    //   {
    //     id: 1,
    //     status: "Active",      
    //     first_Name: "John",
    //     last_Name: "stoney",
    //     mdn: "789456123"
    //   }];

    if (responseData.isValid === false) {
      setLoadingPeopleData(false);
      navigate(`/error/${responseData.status}`);
      return;
    }
  
    setDataPeople(responseData);
   
    const values = {
      first_Name: responseData[0].first_Name,
      last_Name: responseData[0].last_Name,
      mdn: responseData[0].mdn,       
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
    `${VITE_REACT_URL_API_SUB}?phoneNumber=${phone}`,
    { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY }   
  );
  const [dataPendingChanges, isDataPendingChangesLoading] = useFetch(
    `${VITE_REACT_URL_API_SUB}?phoneNumber=${phone}`,
    { "Ocp-Apim-Subscription-Key": VITE_OCP_APIM_SUBSCRIPTION_KEY }   
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

  const handleClose = () => {
    setShowAfSave(false);
  };

  // const fetchPermissions = async () => {
  //   const employeePermissions = await getApi(
  //     `${VITE_REACT_URL_API_VISION3}/GetUserPermissions/${DataPeople.mdmWorkerId}`,
  //     {
  //       "x-functions-key": VITE_FUNCTION_KEY_VISION3,
  //     },
  //     accounts,
  //     instance,
  //     impersonation,
  //     impersonEmail
  //   );
  //   if (employeePermissions?.roles?.length) {
  //     const roles = employeePermissions?.roles.map((role) => {
  //       return visionRoles.find((_visionRole) => {
  //         return _visionRole.name === role;
  //       })?.id;
  //     });
  //     setEmployeeRoles(roles);
  //   }
  // };

  const patchDataCustomerDetails = async () => {
    setShowAfSave(false);
  
    const updateState = {
      ...profileFormState?.form?.data,
      // first_Name:
      //   headerFields?.first_Name !== DataPeople?.first_Name
      //     ? headerFields?.first_Name
      //     : null,
      // last_Name:
      //   headerFields?.last_Name !== DataPeople?.last_Name
      //     ? headerFields?.last_Name
      //     : null,
      // city:
      //   headerFields?.city !== profileFormState?.form?.data.city
      //     ? headerFields?.city
      //     : null,      
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
    if (apiData?.subscriber_ID) {
      const _pendingChangesList = await fetchPendingChangesApi(
        apiData.subscriber_ID,
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      await fetchEmployeeData();
     // await fetchPermissions();
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
          </div>
        ),
      });
    }
  };

  const handleSetSave = () => {
    patchDataCustomerDetails();
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
        title={"Customer Profile"}
        titleDrp={"Create"}
        ItemsDrp={ItemsDrp}
       // OnId={id}
        disabled={DataPeople?.statusId === "WRKST2" || !ItemsDrp?.length}
        isLoading={loadingPeopleData}
      >
        
        <br></br>
       
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
            
              headerFields={headerFields}
            />
            {/* {!editable && pendingChangesList?.length > 0 ? (
              <PendingChanges
                setCollapse={setCollapse}
                collapse={collapse}
                showPendingChanges={showPendingChanges}
                dataPendingChanges={pendingChangesList || []}
                isDataPendingChangesLoading={isDataPendingChangesLoading}
                setPendingChangesList={setPendingChangesList}
                setToastMessage={setToastMessage}
              />
            ) : null} */}
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

      {toastMessage && (
        <ReactToast
          handleClose={() => setToastMessage(null)}
          {...toastMessage}
        />
      )}
    </>
  );
};
