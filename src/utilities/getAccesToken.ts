import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../providers/loginRequest";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const useAccessToken = () => {
  const { accounts, instance, inProgress } = useMsal();

  const getAccessToken = async () => {
    if (inProgress === "login") {
      await instance.handleRedirectPromise();
    }

    if (accounts.length === 0) {
      throw new Error("No accounts found.");
    }

    const account = accounts[0];
    const { scopes } = loginRequest;

    try {
      const responseToken = await instance.acquireTokenSilent({
        scopes: scopes,
        account: account,
      });

      return responseToken.accessToken;
    } catch (error) {
      console.error("Error acquiring token:", error);

      if (error instanceof InteractionRequiredAuthError) {
        if (instance.getAllAccounts().length > 0) {
          try {
            const responseToken = await instance.acquireTokenPopup({
              scopes: scopes,
              account: account,
            });
            return responseToken.accessToken;
          } catch (popupError) {
            console.error("Error acquiring token via popup:", popupError);
            throw popupError;
          }
        }
      }

      throw error;
    }
  };

  return { getAccessToken };
};

export default useAccessToken;
