import React, { useState, useContext, useReducer, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMsal } from "@azure/msal-react";
import { useFetch } from "../../../hooks/useFetch";
import { 
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
} from "../../components/";
import { AlertNoData } from "../../components/Alerts/AlertNoData";
import { LookupsContext, RoleContext } from "../../provider";
import {
  formatDataAndPost,  
  UPDATE_CORRECTLY,
  VICTRA_CLASSIFICATION_ID,
} from "./ProfilePageHelper";
import { initialState, formReducer } from "../../../Reducer/FormReducer";
import { isLoginUserAdmin } from "../../helpers";
import { ReactToast } from "../../components/Toast/ReactToast";
import "./ProfilePage.scss";

export const PeopleProfilePage = ({subscriber_data}) => {
  
  const currentDate = new Date();
  
  const [profileFormState, dispatch] = useReducer(formReducer, initialState);
  const [collapse, setCollapse] = useState(true);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [editable, setEditable] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(currentDate);
  const navigate = useNavigate();
  const [showAfSave, setShowAfSave] = useState(false);  
  const [toastMessage, setToastMessage] = useState(null);
   const loginUserDetails = useContext(RoleContext);
 // const location = useLocation();
  //const { phone = "", historySearch = "" } = queryString.parse(location.search);
  const hasViewPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasEditPermission = hasHrAdminPermission(loginUserDetails?.data?.roles);
  const hasManagerPermission = ""
    //loginUserDetails?.data.mdmWorkerId.toString() !== ""// id.toString();
  const { accounts, instance } = useMsal();

  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  //----------END Impersonation-------------------------

  const [DataPeople, setDataPeople] = useState(null);
  const [loadingPeopleData, setLoadingPeopleData] = useState(true);
  const fetchEmployeeData = async () => {
   const responseData = subscriber_data;   
  
    setDataPeople(responseData);
   
    console.log("subscriber_data:", subscriber_data);    
 
    subscriber_data ? setEditable(false) : setEditable(true)
    
    // const values = {
    //   first_Name: responseData.first_Name,
    //   last_Name: responseData.last_Name,
    //   mdn: responseData.mdn,       
    //   hasHeaderChanges: false,
    // };
    // setHeaderFields(values);
    // setHeaderValues(values);
    setLoadingPeopleData(false);
  };
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const [headerFields, setHeaderFields] = useState({});
  const [headerValues, setHeaderValues] = useState({});
  
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
 

  const patchDataCustomerDetails = async (method) => {
    setShowAfSave(false);
  
    const updateState = {
      ...profileFormState?.form?.data,           
    };
    dispatch({
      type: "UPDATE_FORM_DATA",
      form: { data: profileFormState?.form?.data, isFetchLoading: true },
      hasFormChanges: false,
    });

    debugger;
    const apiData = await formatDataAndPost(
      updateState,
      DataPeople,
      employeeRoles,
      loginUserDetails,
      effectiveDate,
      accounts,
      instance,
      impersonation,
      impersonEmail,
      method
    )
    if (apiData?.subscriber_ID) {   
      setDataPeople(apiData);
     
      setEditable(false);
      dispatch({
        type: "UPDATE_FORM_DATA",
        form: { apiData: {} },
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
   
    var method = "";

    DataPeople ?
    method = "PATCH" :
    method = "POST";

    patchDataCustomerDetails(method);
    
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

  const isContractor =
    DataPeople?.classificationId !== VICTRA_CLASSIFICATION_ID;
  return (
    <>     
      <CardDrpActions
        key={DataPeople}
        title={"DWP Subscribers"}
       // titleDrp={"Create"}
       // ItemsDrp={ItemsDrp}
       // OnId={id}
        //disabled={DataPeople?.statusId === "WRKST2" || !ItemsDrp?.length}
       // isLoading={loadingPeopleData}
      >
        
        <br></br>
       
        <hr className="separator mt-0 mx-auto" />
        {
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
             // pendingChanges={pendingChanges}
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
