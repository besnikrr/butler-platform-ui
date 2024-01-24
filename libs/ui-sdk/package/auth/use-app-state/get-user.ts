import { AppEnum, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AppState } from "./app-state";
import { createApi } from "../../api/index";
import { AuthorizeConfig, AuthorizerType, ICognitoConfig } from "../types";
import { GetCurrentUser } from "../authenticate";
import { UserDetails } from "../../context/types";

export const getUserForDefaultAuthorizer = async (
  cognito: ICognitoConfig
): Promise<GetUserReturnType> => {
  try {
    const iamServiceApi = createApi(AppEnum.IAM, cognito);
    const getUserResponse = await iamServiceApi.get<HTTPResourceResponse<any>>(
      "/users/auth/me"
    );
    if (!getUserResponse.data.payload) {
      return [
        AppState.ErrorsPreventedInitializing,
        { message: "Wrong result format." },
        null,
      ];
    }
    if (getUserResponse.data.errors && getUserResponse.data.errors.length) {
      return [
        AppState.ErrorsPreventedInitializing,
        {
          message:
            getUserResponse.data.errors[0] ||
            "getUser: ErrorsPreventedInitializing",
        },
        null,
      ];
    }
    return [AppState.Initialized, null, getUserResponse.data.payload];
  } catch (err) {
    return [
      AppState.ErrorsPreventedInitializing,
      { message: "Failed to load user from IAM app." },
      null,
    ];
  }
};

const getUserForCognitoAuthorizer = async (
  authorizeConfig: AuthorizeConfig
): Promise<GetUserReturnType> => {
  try {
    const result = await GetCurrentUser(authorizeConfig.cognito);
    const userDetails: UserDetails = {
      displayName: result.getUsername(),
      email: result.getUsername(),
      roles: [],
      permissions: [],
    };
    return [AppState.Initialized, null, userDetails];
  } catch (e) {
    return [
      AppState.ErrorsPreventedInitializing,
      { message: "Failed to load user from Cognito Authorizer" },
      null,
    ];
  }
};

const getUser = (): GetUserType => {
  return <() => Promise<GetUserReturnType>>{
    [AuthorizerType.DefaultAuthorizer]: getUserForDefaultAuthorizer,
    [AuthorizerType.CognitoAuthorizer]: getUserForCognitoAuthorizer,
  }[AuthorizerType.DefaultAuthorizer];
};

export type GetUserType = () => Promise<GetUserReturnType>;
type GetUserReturnType = [
  AppState,
  { message: string } | null,
  UserDetails | null
];

export default getUser;
