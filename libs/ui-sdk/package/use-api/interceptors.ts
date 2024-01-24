import { AppEnum, appsDefinitionLocal, Tenant } from "@butlerhospitality/shared";
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { CognitoUser } from "../auth";

enum StatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER = 500,
  NOT_IMPLEMENTED = 501,
}

const getUrl = (app: AppEnum): string => {
  if (process.env.NX_STAGE === "local") {
    const appDefinition = appsDefinitionLocal[app];
    return `http://localhost:${appDefinition.port}/api/${app === "iam" ? "iam" : app}`;
  }
  return `/api/${app}`;
};

const onRequest = async (config: AxiosRequestConfig, tenant: Tenant, app: AppEnum) => {
  const apiConfig = config;
  if (process.env.JEST_WORKER_ID) {
    return config;
  }

  apiConfig.baseURL = `${getUrl(app)}`;

  if (apiConfig && apiConfig.headers) {
    const token = (await CognitoUser(tenant.cognito)).getAccessToken().getJwtToken();

    apiConfig.headers.Authorization = token;
  }

  return apiConfig;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  let errorMessage = error?.response?.data.message;

  if (error?.response?.data.status === StatusCodes.UNPROCESSABLE_ENTITY) {
    errorMessage = error.response?.data.errors.join(". \n ");
  }

  const errorResponse = {
    ...error,
    response: {
      ...error?.response,
      data: {
        ...error?.response?.data,
        message: errorMessage,
      },
    },
  };

  return Promise.reject(errorResponse);
};

export function setupInterceptorsTo(axiosInstance: AxiosInstance, tenant: Tenant, app: AppEnum): AxiosInstance {
  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => onRequest(config, tenant, app),
    onRequestError
  );
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
