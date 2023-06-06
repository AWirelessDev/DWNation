import { useMsal } from "@azure/msal-react";
import { useState, useEffect, useContext } from "react";
import { RoleContext } from "../DWN/provider";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const getAccessToken = async (accounts, instance) => {
  const accessTokenRequest = {
    account: accounts[0],
  };
  return await instance
    .acquireTokenSilent(accessTokenRequest)
    .then((accessTokenResponse) => {
      // Acquire token silent success
      return accessTokenResponse.idToken;
    })
    .catch((error) => {
      if (error instanceof InteractionRequiredAuthError) {
        instance
          .acquireTokenRedirect(accessTokenRequest)
          .then((accessTokenResponse) => {
            // Acquire token silent success
            return accessTokenResponse.idToken;
          });
      }
      console.log(error);
    });
};

/**
 *
 * @param {string} url
 * @param {object} headers
 * @returns
 */
export const useFetch = (
  url,
  headers,
  method = "GET",
  isAuthorizationRequired = false
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accounts, instance } = useMsal();

  //----------BEGIN Impersonation-------------------------
  // const RoleCtx = useContext(RoleContext);
  // const impersonation = RoleCtx.impersonation || false;
  // const impersonEmail = RoleCtx.impersonEmail || false;
  // let ImpersonEmail = false;
  // if (impersonation != false) {
  //   ImpersonEmail = impersonEmail;
  // }
  // if (impersonation != false) {
  //   headers = { ...headers, ["Impersonate"]: ImpersonEmail };
  // }  
  //----------END Impersonation------------------------

  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      const accessToken = await getAccessToken(accounts, instance);
       headers = isAuthorizationRequired
         ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...headers,
           }
       : { "Content-Type": "application/json", ...headers };

      try {
        const res = await fetch(url, {
          method: method,
          headers,
        });

        if (!res.ok) {
          setError(res.status);

          // Check if the response is HTML
          const contentType = res.headers.get("content-type");
          let jsonStatus;

          if (contentType && contentType.indexOf("application/json") !== -1) {
            const json = await res.json();
            jsonStatus = json;
            jsonStatus.status = res.status;
          } else {
            // Create a JSON array with only the response status
            jsonStatus = { isValid: false, status: res.status };
          }

          RoleCtx.setAuthoAccess(jsonStatus);
        } else {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        setError(e.status);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [url]);

  return error ? [null, loading, error] : [data, loading, null];
};
