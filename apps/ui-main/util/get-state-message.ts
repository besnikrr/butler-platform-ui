import { AppState } from "@butlerhospitality/ui-sdk";

const getStateMessage = (state: AppState): string => {
  switch (state) {
    case AppState.Initializing:
      return "Initializing";
    case AppState.GettingTenant:
      return "Getting Tenant";
    case AppState.Authenticating:
      return "Authenticating";
    case AppState.GettingUserProfile:
      return "GettingUserProfile";
    case AppState.Initialized:
      return "Initialized";
    default:
      return "";
  }
};
export default getStateMessage;
