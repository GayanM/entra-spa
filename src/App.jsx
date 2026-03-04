import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export default function App() {
  const { instance, accounts, inProgress } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Accounts:", accounts);
    console.log("Active:", activeAccount);
  }, [accounts, activeAccount]);

  const signIn = async () => {
    await instance.loginRedirect(loginRequest);
  };

  const getToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      setToken(response.accessToken);
    } catch (err) {
      setError(err.message);
    }
  };

  const signOut = async () => {
    await instance.logoutRedirect();
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="logo">
        <span className="logo-icon">🔐</span>
        <span className="logo-text">OneIAM</span>
      </div>
        <h1>OneIAM OAuth Demo</h1>

        <div className="status">
          <p><strong>Status:</strong> {inProgress}</p>
          <p><strong>Accounts:</strong> {accounts.length}</p>
          <p><strong>Active:</strong> {activeAccount?.username || "None"}</p>
        </div>

        {!activeAccount ? (
          <button className="primary" onClick={signIn}>
            Sign In with Microsoft
          </button>
        ) : (
          <>
            <p className="welcome">
              Signed in as <strong>{activeAccount.username}</strong>
            </p>

            <div className="btn-group">
              <button className="primary" onClick={getToken}>
                Get Access Token
              </button>
              <button className="secondary" onClick={signOut}>
                Sign Out
              </button>
            </div>
          </>
        )}

        {error && <div className="error">{error}</div>}

        {token && (
          <div className="token-box">
            <h3>Access Token</h3>
            <textarea readOnly value={token} />
          </div>
        )}
      </div>

      <div className="hero">
        <img src="/girl.png" alt="OneIAM Representative" />
      </div>
    </div>
  );
}