import { useMsal } from "@azure/msal-react";
import { useState, useEffect, useContext } from "react";
import { getAccessToken } from "../hooks";
import { RoleContext } from "../DWN/provider";

/**
 *
 * @param {string} url
 * @param {object} headers
 * @param { string} to use in query string for url2
 * @param {string} url2  second api call
 * @param {object} headers2
 * @param {string} paramId in case of create form  we will not call first api
 * @returns
 */

export const useFetchJoin = (
  url,
  headers,
  IdJoin,
  url2,
  headers2,
  paramId = null
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data2, setData2] = useState(null);
  const { accounts, instance } = useMsal();

  //----------BEGIN Impersonation-------------------------
  const RoleCtx = useContext(RoleContext);
  const impersonation = RoleCtx.impersonation || false;
  const impersonEmail = RoleCtx.impersonEmail || false;
  let ImpersonEmail = false;
  if (impersonation != false) {
    ImpersonEmail = impersonEmail;
  }
  if (impersonation != false) {
    (headers = { ...headers, ["Impersonate"]: ImpersonEmail }),
      (headers2 = { ...headers2, ["Impersonate"]: ImpersonEmail });
  }
  //----------END Impersonation-------------------------

  useEffect(() => {
    const doFetch = async () => {
      setLoading(true);
      const accessToken = await getAccessToken(accounts, instance);
      try {
        let FullUrl = url2;
        if (!paramId) {
          const res = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              ...headers,
            },
          });
          const json = await res.json();
          if (!res.ok) {
            setError(res.status);
            const jsonStatus = json
            jsonStatus.status = res.status;

            RoleCtx.setAuthoAccess(jsonStatus);
          } else {
            setData(json);
          }
          const obj = json;

          for (const prop in obj) {
            prop === IdJoin ? (FullUrl = url2 + obj[prop]) : "";
          }
        } else {
          FullUrl = url2 + paramId;
        }

        const res2 = await fetch(FullUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...headers2,
          },
        });

        const json2 = await res2.json();
        
        if (!res2.ok) {
          setError(res2.status); 
          const jsonStatus2 = json2
            jsonStatus2.status = res2.status;
            RoleCtx.setAuthoAccess(jsonStatus2);
          
        } else {
          setData2(json2);
        }

      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, []);

  return [data, loading, error, data2];
};
