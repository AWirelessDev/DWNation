import { getAccessToken } from "../hooks";


export const getApi = async (url, headers, accounts = {}, instance = {}, impersonation = true, impersonEmail = true ) => {
//----------BEGIN Impersonation-------------------------
if(impersonation != false) { headers = {...headers, ['Impersonate']: impersonEmail}}
//----------END Impersonation-------------------------

  const accessToken = await getAccessToken(accounts, instance);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  });
  if (!response.ok) {
    // Check if the response is HTML
    const contentType = response.headers.get("content-type");
    let jsonStatus;

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const json = await response.json();
      jsonStatus = json;
      jsonStatus.status = response.status;
    } else {
      // Create a JSON array with only the response status
      jsonStatus = { isValid: false, status: response.status };
    }

    
    return jsonStatus;
  } else {
    const json = await response.json();
    return json;
  }
};


export const patchApi = async (
  url,
  headers,
  payload,
  //accounts = {},
  //instance = {}
  //, impersonation = false, impersonEmail = false
) => {
 
 { headers = {...headers}}
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",      
      ...headers,
    },
    body:  JSON.stringify(payload),
  });
  
  const jsonStatus = await response.json()
            jsonStatus.status = response.status;
  return await jsonStatus;
};

export const putApi = async (
  url,
  headers,
  payload = null,
  accounts = {},
  instance = {}, impersonation = false, impersonEmail = false
) => {
  //----------BEGIN Impersonation-------------------------
  if(impersonation != false) { headers = {...headers, ['Impersonate']: impersonEmail}}
  //----------END Impersonation-------------------------

  const accessToken = await getAccessToken(accounts, instance);
  let options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  }
  if(payload) {
    options = {
      ...options,
      body: JSON.stringify(payload)
    }
  }
  const response = await fetch(url, options);
  if(payload) {
    return await response.json();
  } else {
    if(response.status === 200) {
      return true;
    }
    return false;
  }
  
};

export const deleteApi = async (url, headers, accounts = {}, instance = {}, impersonation = false, impersonEmail = false, payload= null) => {
  //----------BEGIN Impersonation-------------------------
  if(impersonation != false) { headers = {...headers, ['Impersonate']: impersonEmail}}
  //----------END Impersonation-------------------------
  
  const accessToken = await getAccessToken(accounts, instance);

  let options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${accessToken}`,
      ...headers,
    },
  }
  if(payload) {
    options = {
      ...options,
      body: JSON.stringify(payload)
    }
  }
  const response = await fetch(url, options);
  return await response.json();
};
