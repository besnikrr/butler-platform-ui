import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import { CognitoUserSession } from "amazon-cognito-identity-js";

async function Authenticate(
  cognitoConfig: any,
  input: AmazonCognitoIdentity.IAuthenticationDetailsData
) {
  return new Promise((resolve, reject) => {
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(input);
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: cognitoConfig.poolId,
      ClientId: cognitoConfig.clientId,
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
      newPasswordRequired(userAttributes: any) {
        delete userAttributes.email_verified;
        delete userAttributes.email;

        cognitoUser.completeNewPasswordChallenge(
          authenticationDetails.getPassword(),
          userAttributes,
          {
            onSuccess: (result) => {
              window.location.href = "/change-password";
            },
            onFailure: (err) => {
              throw err;
            },
          }
        );
      },
    });
  });
}

export async function CognitoUser(
  cognitoConfig: any
): Promise<AmazonCognitoIdentity.CognitoUserSession> {
  return new Promise((resolve, reject) => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: cognitoConfig.poolId,
      ClientId: cognitoConfig.clientId,
    });
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      throw "no current user exists";
    }
    cognitoUser?.getSession(function (
      err: Error | null,
      session: CognitoUserSession
    ): void {
      if (err) {
        return reject(err.message);
      }
      return resolve(session);
    });
  });
}

export async function GetCurrentUser(
  cognitoConfig: any
): Promise<AmazonCognitoIdentity.CognitoUser> {
  return new Promise((resolve, reject) => {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: cognitoConfig?.poolId,
      ClientId: cognitoConfig?.clientId,
    });
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      resolve(cognitoUser);
    } else {
      reject(new Error("Can't find cognito user"));
    }
  });
}

export function SignOut(cognitoConfig: any) {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: cognitoConfig.poolId,
    ClientId: cognitoConfig.clientId,
  });
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

export { Authenticate };
