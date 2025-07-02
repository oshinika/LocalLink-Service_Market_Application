import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "@asgardeo/auth-react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const config = {
  signInRedirectURL: "http://localhost:5173",
  signOutRedirectURL: "http://localhost:5173",
  clientID: "2QKAWYqqMc8DpUOFGfi46os1zb8a",
  storage: "sessionStorage",
  baseUrl: "https://api.asgardeo.io/t/orgshzcc",
  scope: [
    "openid",
    "profile",
    "email",
    "roles",
    "groups",
    "internal_login",
    "internal_user_mgt_view",
    "internal_user_mgt_update",
    "internal_user_mgt_create",
    "internal_user_mgt_list",
    "internal_user_mgt_delete",
    "internal_role_mgt_update",
    "scim2",
    "scim2:User.write"
  ],
  resourceServerURLs: [
    "https://api.asgardeo.io/t/orgshzcc/scim2"
  ],
  endpoints: {
    authorizationEndpoint: "https://api.asgardeo.io/t/orgshzcc/oauth2/authorize",
    tokenEndpoint: "https://api.asgardeo.io/t/orgshzcc/oauth2/token",
    endSessionEndpoint: "https://api.asgardeo.io/t/orgshzcc/oidc/logout"
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider config={config}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
