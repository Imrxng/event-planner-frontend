import {  Auth0Provider } from "@auth0/auth0-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Auth0ProviderWithHistory = ({ children }: Props) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;

  if (!domain || !clientId || !audience) {
    console.error("Auth0 environment variables are missing.");
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
