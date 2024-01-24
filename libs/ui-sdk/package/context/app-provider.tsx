import * as React from "react";
import _ from "lodash";
import { AppEnum } from "@butlerhospitality/shared";
import actions from "./actions";
import {
  AppContextType,
  Tenant,
  SideNavListItemType,
  AppsNavigationType,
} from "./types";
import reducer from "./reducer";

const initialState: AppContextType = {
  user: {
    authenticated: false,
  },
  tenant: {
    cognito: {
      poolId: "",
      clientId: "",
    },
  },
  navigation: {} as AppsNavigationType,
  can: (permissionName: string) => {
    return !!permissionName;
  },
};

const AppContext = React.createContext<AppContextType>(initialState);

const AppProvider = function ({
  children,
  providedValue,
}: {
  children: React.ReactNode;
  providedValue?: any;
}) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value: AppContextType = {
    ...state,
    setIsUserAuthenticated: (authenticated: boolean) => {
      dispatch({ type: actions.SET_USER_AUTHENTICATED, value: authenticated });
    },
    setTenant: (tenant: Tenant | null) => {
      dispatch({ type: actions.SET_TENANT, value: tenant as Tenant });
    },
    setUserDetails: (value: any | null) => {
      dispatch({ type: actions.SET_USER_DETAILS, value });
    },
    can: (permissionName: string): boolean => {
      const permissions = state?.user?.details?.permissions;
      return permissions?.includes(permissionName) ?? false;
    },
    setNavigation(app: AppEnum, navigation: SideNavListItemType[]) {
      dispatch({ type: actions.SET_NAVIGATION, value: { app, navigation } });
    },
    getNavigation(app: AppEnum) {
      return _.get(state, `navigation.${app}`);
    },
  };
  return (
    <AppContext.Provider value={providedValue || value}>
      {children}
    </AppContext.Provider>
  );
};
export { AppContext, AppProvider };
