/* eslint-disable import/no-cycle */
import { useEffect, useState } from "react";
import { Tenant, UserDetails } from "../../context/types";
import { AppState } from "./app-state";
import { init } from "./init";
import { getUserForDefaultAuthorizer } from "./get-user";
import { AuthorizeConfig } from "../types";

type AppStateProps = {
  setIsUserAuthenticated?: (value: boolean) => void;
  setTenant?: (tenant: Tenant) => void;
  setUserDetails?: (userDetails: UserDetails) => void;
  authenticated: boolean;
  authorizeConfig: AuthorizeConfig;
  historyPush: any;
};

export function useAppState(
  props: AppStateProps
): [AppState, { message: string }] {
  const [appState, setAppState] = useState(AppState.Initializing);
  const [error, setError] = useState<{ message: string }>({ message: "" });

  const isAllowedPath = (): boolean => {
    const allowedPaths: { [key: string]: boolean } = {
      "reset-password": true,
      "forgot-password": true,
    };
    return allowedPaths[window.location.pathname.split("/")[1]];
  };

  useEffect(() => {
    const run = async () => {
      const result = await init(setAppState);
      const [success, tenant, redirectToSignIn] = result;
      if (success) {
        if (tenant) {
          props?.setTenant?.(tenant);
        }

        if (redirectToSignIn) {
          if (!isAllowedPath()) return props.historyPush("/sign-in");
        } else {
          props?.setIsUserAuthenticated?.(true);
        }
      }

      return null;
    };

    run();
  }, []);

  useEffect(() => {
    if (props.authenticated) {
      const run = async () => {
        setAppState(AppState.GettingUserProfile);
        const [appStateResult, errorResult, dataResult] =
          await getUserForDefaultAuthorizer(props.authorizeConfig.cognito);
        if (errorResult) {
          setError(errorResult);
        }
        if (dataResult) {
          props?.setUserDetails?.(dataResult);
        }

        setAppState(appStateResult);
      };
      run();
    }
  }, [props.authenticated]);

  return [appState, error];
}

export { AppState };
