// src/authConfig.js

const clientId = import.meta.env.VITE_CLIENT_ID;
const tenantId = import.meta.env.VITE_TENANT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

console.log("[ENV]", { clientId, tenantId, redirectUri });

export const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    // IMPORTANT: keep hash routing enabled since you are seeing #code=
    // If you later move to history routing, we can change this.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        // MSAL internal logs
        console.log(`[MSAL ${level}] ${message}`);
      },
      logLevel: 3, // Info
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};