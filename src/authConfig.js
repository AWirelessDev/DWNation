export const msalConfig = {
    auth: {
      clientId: import.meta.env.VITE_CLIENT_ID,
      authority: import.meta.env.VITE_AUTHORITY, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: import.meta.env.VITE_REACT_PUBLIC_URL,
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
    