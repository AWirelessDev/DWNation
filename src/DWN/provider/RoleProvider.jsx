import { createContext } from "react";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import { getApi } from "../../helpers";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RoleContext = createContext(false);

export const RoleProvider = ({ children }) => {
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();
  const userEmailAddress = accounts && accounts[0]?.username;
  const [loginUserData, setLoginUserData] = useState({});
  const [data, setData] = useState({});
  const [impersonation, setImpersonation] = useState(false);
  const [impersonEmail, setImpersEmail] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [authoAccess, setAuthoAccess] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  // this logic will be here because after login user details we have to check
  const checkImpersonationPermission = async (userDetails) => {
    const loginUserRoles = userDetails?.roles?.length ? userDetails?.roles : [];
    return loginUserRoles.includes("Impersonation");
  };

  const actionAfterUserDetails = async (
    hasImpersonationPermission,
    userDetails
  ) => {
    setData(userDetails);
    setLoginUserData(userDetails);
    setInitialLoad(false);
    const localStorageImpersonEmail =
      window.localStorage.getItem("impersonEmail");
    if (localStorageImpersonEmail && hasImpersonationPermission) {
      setImpersonation(true);
      setImpersEmail(localStorageImpersonEmail);
    } else {
      setIsLoading(false);
      if (localStorage.getItem("impersonEmail"))
        localStorage.removeItem("impersonEmail");
    }
  };

  const fetchLoginUserDetails = async () => {
    const userDetails = await getUserAndPermissionDetails(
      userEmailAddress,
      accounts,
      instance
    );
    const hasImpersonationPermission = await checkImpersonationPermission(
      userDetails
    );
    await actionAfterUserDetails(hasImpersonationPermission, userDetails);

    if (!userDetails.roles || userDetails.roles.length === 0) {
      navigate("/error/401");
    }
  };

  const fetchImpersonUserDetails = async () => {
    if (impersonation) {
      const userDetails = await getUserAndPermissionDetails(
        impersonEmail,
        accounts,
        instance,
        impersonation,
        impersonEmail
      );
      setData(userDetails);
      if (!localStorage.getItem("impersonEmail")) {
        localStorage.setItem("impersonEmail", impersonEmail);
        navigate("/");
      } else {
        setIsLoading(false);
      }
    } else if (loginUserData) {
      setData(loginUserData);
      localStorage.removeItem("impersonEmail");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchLoginUserDetails();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      fetchImpersonUserDetails();
    }
  }, [impersonation]);

  useEffect(() => {
    if (!authoAccess || !authoAccess.isValid) {
      if (authoAccess.status === 401) {
        navigate(`/error/401`);
      }
      if (authoAccess.status === 403) {
        navigate(`/error/403`);
      }
      if (authoAccess.status === 500) {
        navigate(`/error/500`);
      }
      if (authoAccess.status === 503) {
        navigate(`/error/503`);
      }
      //if (authoAccess.status !== null) { navigate(`/error/${authoAccess.status}`);}
    }
  }, [authoAccess]);

  return (
    <RoleContext.Provider
      value={{
        data,
        impersonation,
        setImpersonation,
        impersonEmail,
        setImpersEmail,
        loginUserData,
        isLoading,
        authoAccess,
        setAuthoAccess,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const getUserAndPermissionDetails = async (
  userEmailAddress,
  accounts,
  instance,
  impersonation = false,
  impersonEmail = false,
) => {
  const {
    VITE_REACT_URL_API_PMC,
    VITE_REACT_URL_API_VISION3,
    VITE_EVENTS_FUNCTION_KEY_PMC,
    VITE_FUNCTION_KEY_VISION3,
  } = import.meta.env;

  
  let employeeDetails = {};
  let roleDetails = {};

  try {
    const employeeResponse = await getApi(
      `${VITE_REACT_URL_API_PMC}/GetEmployeeByEmail/${userEmailAddress}`,
      {
        "x-functions-key": VITE_EVENTS_FUNCTION_KEY_PMC,
      },
      accounts,
      instance,
      impersonation,
      impersonEmail
    );

    if (employeeResponse?.mdmWorkerId) {
      employeeDetails = employeeResponse;
      const roleResponse = await getApi(
        `${VITE_REACT_URL_API_VISION3}/GetUserPermissions/${employeeResponse?.mdmWorkerId}`,
        {
          "x-functions-key": VITE_FUNCTION_KEY_VISION3,
        },
        accounts,
        instance,
      );
  
      if (roleResponse?.permissions) {
        roleDetails = roleResponse;
      }
    }

  } catch (error) {
    console.log("/error/" + error?.status || "500");
  }


  return { ...employeeDetails, ...roleDetails };
};
