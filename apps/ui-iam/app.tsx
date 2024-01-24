import { useContext, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { AppContext, initLocalization } from "@butlerhospitality/ui-sdk";

import { AppEnum } from "@butlerhospitality/shared";
import UserListView from "./view/user/list";
import UserEditView from "./view/user/edit";
import UserDetailView from "./view/user/details";
import UserCreateView from "./view/user/create";

import RoleListView from "./view/role/list";
import RoleEditView from "./view/role/edit";
import RoleDetailView from "./view/role/details";
import RoleCreateView from "./view/role/create";

import PermissionGroupListView from "./view/permission-group/list";
import PermissionGroupEditView from "./view/permission-group/edit";
import PermissionGroupDetailView from "./view/permission-group/details";
import PermissionGroupCreateView from "./view/permission-group/create";
import {
  USER_BASE_ROUTE,
  ROLE_BASE_ROUTE,
  SERVICE_BASE_ROUTE,
  PERMISSION_GROUPS_BASE_ROUTE,
} from "./data/share";

import "./styles.scss";
import { resources } from "./locales";

initLocalization(resources);

const UserRoutes = () => {
  return (
    <Switch>
      <Route exact path={`${USER_BASE_ROUTE}/list`}>
        <UserListView />
      </Route>
      <Route exact path={`${USER_BASE_ROUTE}/edit/:id`}>
        <UserEditView />
      </Route>
      <Route exact path={`${USER_BASE_ROUTE}/create`}>
        <UserCreateView />
      </Route>
      <Route exact path={`${USER_BASE_ROUTE}/details/:id`}>
        <UserDetailView />
      </Route>
    </Switch>
  );
};

const RoleRoutes = () => {
  return (
    <Switch>
      <Route exact path={`${ROLE_BASE_ROUTE}/list`}>
        <RoleListView />
      </Route>
      <Route exact path={`${ROLE_BASE_ROUTE}/edit/:id`}>
        <RoleEditView />
      </Route>
      <Route exact path={`${ROLE_BASE_ROUTE}/details/:id`}>
        <RoleDetailView />
      </Route>
      <Route exact path={`${ROLE_BASE_ROUTE}/create`}>
        <RoleCreateView />
      </Route>
    </Switch>
  );
};

const PermissionGroupsRoutes = () => {
  return (
    <Switch>
      <Route exact path={`${PERMISSION_GROUPS_BASE_ROUTE}/list`}>
        <PermissionGroupListView />
      </Route>
      <Route exact path={`${PERMISSION_GROUPS_BASE_ROUTE}/edit/:id`}>
        <PermissionGroupEditView />
      </Route>
      <Route exact path={`${PERMISSION_GROUPS_BASE_ROUTE}/details/:id`}>
        <PermissionGroupDetailView />
      </Route>
      <Route exact path={`${PERMISSION_GROUPS_BASE_ROUTE}/create`}>
        <PermissionGroupCreateView />
      </Route>
    </Switch>
  );
};

const App = ({ history }: { history: any }): JSX.Element => {
  /**
   * @description App context
   */
  const { setNavigation } = useContext(AppContext);

  /**
   * @description Initializing navigation for ui-network app
   */
  useEffect(() => {
    setNavigation?.(AppEnum.IAM, [
      {
        name: "Users",
        path: "/iam/users/list",
        permission: true,
      },
      {
        name: "Roles",
        path: "/iam/roles/list",
        permission: true,
      },
      {
        name: "Permission groups",
        path: "/iam/permission-groups/list",
        permission: true,
      },
    ]);
  }, []);

  return (
    <Router history={history}>
      <Switch>
        <Route>
          <Switch>
            <Route exact path={SERVICE_BASE_ROUTE}>
              <Redirect to={`${USER_BASE_ROUTE}/list`} />
            </Route>
            <Route path={USER_BASE_ROUTE}>
              <UserRoutes />
            </Route>
            <Route path={ROLE_BASE_ROUTE}>
              <RoleRoutes />
            </Route>
            <Route path={PERMISSION_GROUPS_BASE_ROUTE}>
              <PermissionGroupsRoutes />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
