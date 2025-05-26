import React, { useEffect, useRef, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { LogLevel, PublicClientApplication } from "@azure/msal-browser";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import { loginRequest } from "./loginRequest";

type Props = {
  children: React.ReactNode;
};

export const MsalProviderWithHistory = ({ children }: Props) => {
  const clientId = import.meta.env.VITE_MSAL_CLIENT_ID!;
  const tenantId = import.meta.env.VITE_MSAL_TENANT_ID!;
  const redirectUri = window.location.origin;

  const msalInstanceRef = useRef(
    new PublicClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      },
      system: {
        loggerOptions: {
          logLevel: LogLevel.Info,
        },
      },
    }),
  );

  const msalInstance = msalInstanceRef.current;
  const [isMsalReady, setIsMsalReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for MSAL initialization to resolve
        await msalInstance.initialize();

        const response = await msalInstance.handleRedirectPromise();

        if (response?.account) {
          msalInstance.setActiveAccount(response.account);
        } else {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
          }
        }

        await msalInstance.acquireTokenSilent({
          scopes: loginRequest.scopes,
          account: msalInstance.getAllAccounts()[0],
        });
      } catch (err) {
        console.error(
          "Error during MSAL redirect handling or token acquisition",
          err,
        );
      } finally {
        setIsMsalReady(true);
      }
    };

    checkAuth();
  }, [msalInstance]);

  if (!isMsalReady)
    return <FullscreenLoader content="Checking authentication..." />;

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default MsalProviderWithHistory;
