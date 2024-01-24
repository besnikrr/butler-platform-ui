export enum AuthorizerType {
  DefaultAuthorizer,
  CognitoAuthorizer,
}

export interface IConfig {
  config: any;
  setConfig: (_config: Config) => void;
  getConfig: () => Config;
}

export interface ICognitoConfig {
  userPoolId: string;
  clientId: string;
}

export type Config = {
  cognitoConfig?: ICognitoConfig;
  authorizer?: AuthorizerType;
};

const instance = (function (): IConfig {
  return {
    config: undefined,
    setConfig(_config: Config) {
      this.config = {
        ...this.config,
        ..._config,
      };
    },
    getConfig(): Config {
      return this.config;
    },
  };
})();

export default instance;
