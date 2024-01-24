import { AppState } from "./app-state";
import { CognitoUser } from "../authenticate";
import { getTenant } from "./get-tenant";
import { Tenant } from "../../context/types";

interface InitArgs {
  onAppStateChange: (appState: AppState, error?: string) => void;
  redirectToSignIn: () => void;
}

async function init(
  setAppState: any
): Promise<[boolean, Tenant | null, boolean]> {
  try {
    setAppState(AppState.Initializing);
    setAppState(AppState.GettingTenant);
    const tenant = await getTenant();
    if (!tenant.result) {
      setAppState(
        AppState.ErrorsPreventedInitializing,
        "Failed to load tenant"
      );
      return [false, null, false];
    }
    try {
      setAppState(AppState.Authenticating);
      await CognitoUser(tenant.result?.cognito);
    } catch (e) {
      setAppState(AppState.Initialized);
      return [true, tenant.result, true];
    }
    setAppState(AppState.Initialized);
    return [true, tenant.result, false];
  } catch (e) {
    setAppState(
      AppState.ErrorsPreventedInitializing,
      "Unknown error prevented app from initializing"
    );
    return [false, null, false];
  }
}

export { init };
