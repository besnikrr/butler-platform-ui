import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import config, { AuthorizerType } from "./config";

config.setConfig({
  cognitoConfig: {
    userPoolId: "us-east-1_Tq29inz5l",
    clientId: "7nn3c7l878r6t3vh4mh92ubpl2",
  },
  authorizer: AuthorizerType.DefaultAuthorizer,
});
// SignInGuestUser
async function Authenticate(
  input: AmazonCognitoIdentity.IAuthenticationDetailsData
) {
  return new Promise((resolve, reject) => {
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(input);
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: config.getConfig().cognitoConfig?.userPoolId || "",
      ClientId: config.getConfig().cognitoConfig?.clientId || "",
    });
    const userData = {
      Username: input.Username,
      Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess(result) {
        resolve(result);
      },
      onFailure(error) {
        reject(error);
      },
    });
  });
}

export async function CognitoUser(): Promise<AmazonCognitoIdentity.CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: config.getConfig().cognitoConfig?.userPoolId || "",
      ClientId: config.getConfig().cognitoConfig?.clientId || "",
    });
    const cognitoUser = userPool.getCurrentUser();
    // @ts-ignore
    cognitoUser.getSession(function (err, session) {
      if (err) {
        return reject(err.message);
      }
      return resolve(session);
    });
  });
}

export async function GetCurrentUser(): Promise<AmazonCognitoIdentity.CognitoUser> {
  return new Promise((resolve, reject) => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: config.getConfig().cognitoConfig?.userPoolId || "",
      ClientId: config.getConfig().cognitoConfig?.clientId || "",
    });
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      resolve(cognitoUser);
    } else {
      reject(new Error("Can't find cognito user"));
    }
  });
}

export function SignOut() {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: config.getConfig().cognitoConfig?.userPoolId || "",
    ClientId: config.getConfig().cognitoConfig?.clientId || "",
  });
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

export async function SignInGuestUser() {
  await Authenticate({
    Username: "guest@butlerplatform.com",
    Password: "Butler1!",
  });
}

export default Authenticate;
