import { AppEnum } from "@butlerhospitality/shared";
import { ICognitoConfig } from "../auth/types";

export interface SideNavListItemType {
  path: string;
  name: string;
  permission: boolean;
}

export type AppsNavigationType = {
  [key in AppEnum]: SideNavListItemType;
};

export type AppContextType = {
  user: UserStateInterface;
  tenant: Tenant;
  setIsUserAuthenticated?: (value: boolean) => void;
  setUserDetails?: (value: UserDetails | null) => void;
  setTenant?: (value: Tenant | null) => void;
  can: (permissionName: string) => boolean;
  setNavigation?: (app: AppEnum, navigation: SideNavListItemType[]) => void;
  getNavigation?: (app: AppEnum) => SideNavListItemType[];
  navigation: AppsNavigationType;
};

export type SetNavInput = {
  app: AppEnum;
  navigation: SideNavListItemType[];
};
export type UserStateInterface = {
  authenticated: boolean;
  details?: UserDetails;
};

export type UserDetails = {
  id?: number;
  displayName?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
};

export type Permissions = string[];

export type ChildrenProps = {
  children: React.ReactNode;
};

export type ActionType = {
  type: string;
  value?: boolean | UserDetails | Tenant | SetNavInput;
};

export interface UserInterface {
  username: string;
  password: string;
}

export interface Tenant {
  cognito: ICognitoConfig;
}
