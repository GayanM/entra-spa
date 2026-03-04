// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App.jsx";
import { msalConfig } from "./authConfig.js";
import "./index.css";

function logUrlState(tag) {
  console.log(`[${tag}] location.href`, window.location.href);
  console.log(`[${tag}] location.hash`, window.location.hash);
  console.log(`[${tag}] location.search`, window.location.search);
}

logUrlState("BOOT-START");

const msalInstance = new PublicClientApplication(msalConfig);

// Expose for debugging in console: window.msal
window.msal = msalInstance;

(async () => {
  console.log("[BOOT] msal initialize() start");
  await msalInstance.initialize();
  console.log("[BOOT] msal initialize() done");

  logUrlState("BEFORE-handleRedirectPromise");

  let redirectResponse = null;
  try {
    redirectResponse = await msalInstance.handleRedirectPromise();
    console.log("[BOOT] handleRedirectPromise() response:", redirectResponse);
  } catch (e) {
    console.error("[BOOT] handleRedirectPromise() ERROR:", e);
  }

  const allAccounts = msalInstance.getAllAccounts();
  console.log("[BOOT] accounts after redirect:", allAccounts);

  if (redirectResponse?.account) {
    msalInstance.setActiveAccount(redirectResponse.account);
    console.log("[BOOT] setActiveAccount from redirectResponse");
  } else if (allAccounts.length > 0) {
    // Set a default active account if one exists
    msalInstance.setActiveAccount(allAccounts[0]);
    console.log("[BOOT] setActiveAccount from existing accounts[0]");
  } else {
    console.log("[BOOT] no accounts to set active");
  }

  console.log("[BOOT] activeAccount:", msalInstance.getActiveAccount());

  logUrlState("AFTER-handleRedirectPromise");

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );

  console.log("[BOOT] React rendered");
})();