export enum AuthorizerType {
  DefaultAuthorizer,
  CognitoAuthorizer,
}

export interface ICognitoConfig {
  poolId: string;
  clientId: string;
}

export interface AuthorizeConfig {
  cognito: ICognitoConfig;
}
