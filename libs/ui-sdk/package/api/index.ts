import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { appsDefinitionLocal, AppEnum } from "@butlerhospitality/shared";
import { CognitoUser, ICognitoConfig } from "../auth/index";

export const getUrl = (app: AppEnum): string => {
  if (process.env.NX_STAGE === "local") {
    const appDefinition = appsDefinitionLocal[app];
    return `http://localhost:${appDefinition.port}/api/${app}`;
  }
  return `/api/${app}`;
};

export const createApi = (
  app: AppEnum,
  cognito?: ICognitoConfig
): AxiosInstance => {
  const api = axios.create({
    baseURL: getUrl(app),
  });

  if (app !== AppEnum.TENANT) {
    api.interceptors.request.use(async (axiosConfig: AxiosRequestConfig) => {
      if (axiosConfig && axiosConfig.headers) {
        const token = (await CognitoUser(cognito))
          .getAccessToken()
          .getJwtToken();

        axiosConfig.headers.Authorization = token;
      }
      return axiosConfig;
    });
  }

  return api;
};

export const iamServiceApi = createApi(AppEnum.IAM);
