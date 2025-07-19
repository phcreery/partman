import { Login } from "@/api/interface/index";
import client from "@/api";

// * User login interface
export const loginApi = async (params: Login.ReqLoginForm): Promise<Login.ResLogin> => {
  const authData = await client.collection("users").authWithPassword(params.username, params.password);
  return authData as unknown as Login.ResLogin;
};

export const loginApiAsAdmin = async (params: Login.ReqLoginForm): Promise<Login.ResLogin> => {
  const adminAuthData = await client.collection("_superusers").authWithPassword(params.username, params.password);
  return adminAuthData as unknown as Login.ResLogin;
};

export const loginApiWithOAuth2 = async (provider: string): Promise<Login.ResLogin> => {
  const authData = await client.collection("users").authWithOAuth2({
    // provider,
    provider: "oidc",
    urlCallback: url => {
      window.location.href = url;
    }
    // redirectUrl: "https://example.com"
  });
  console.log("OAuth2 login data", authData);
  return authData as unknown as Login.ResLogin;
};

export const listAuthMethods = async (): Promise<Login.ResAuthMethods> => {
  const authMethods = await client.collection("users").listAuthMethods();
  return authMethods as unknown as Login.ResAuthMethods;
};

// * User logout
export const logoutApi = () => {
  return null;
};
