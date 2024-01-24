/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { Suspense, useContext } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import {
  AppContext,
  useAppState,
  AppState,
  Wrapper,
  NavBar,
  Content,
  Body,
  Footer,
  Notification,
  Spinner,
} from "@butlerhospitality/ui-sdk";

import AppStateInfo from "./components/AppStateInfo";
import HeaderNavBar from "./components/HeaderNavBar";
import SideNavList from "./components/SideNavList";

const SignIn = React.lazy(() => import("./view/sign-in"));
const ResetPassword = React.lazy(() => import("./view/reset-password"));
const ChangePassword = React.lazy(() => import("./view/change-password"));
const ForgotPassword = React.lazy(() => import("./view/forgot-password"));

const DashboardApp = React.lazy(() => import("../ui-dashboard/app"));
const NetworkApp = React.lazy(() => import("../ui-network/app"));
const VoucherApp = React.lazy(() => import("../ui-voucher/app"));
const IAMApp = React.lazy(() => import("../ui-iam/app"));
const MenuAppV2 = React.lazy(() => import("../ui-menu/app"));
const Orders = React.lazy(() => import("../ui-orders/app"));

const history = createBrowserHistory();

function ErrorsPreventedInitializing({ message }: { message: string }) {
  return <b>ErrorsPreventedInitializing {message}</b>;
}

function App() {
  const { setTenant, setIsUserAuthenticated, setUserDetails, tenant, user } =
    useContext(AppContext);

  const [initializingState, errorInitializingApp] = useAppState({
    setTenant,
    setIsUserAuthenticated,
    setUserDetails,
    authenticated: user?.authenticated || false,
    authorizeConfig: {
      cognito: tenant?.cognito || { clientId: "", userPoolId: "" },
    },
    historyPush: history.push,
  });

  if (initializingState === AppState.ErrorsPreventedInitializing) {
    return (
      <ErrorsPreventedInitializing message={errorInitializingApp.message} />
    );
  }
  if (initializingState !== AppState.Initialized) {
    return <AppStateInfo state={initializingState} />;
  }
  if (tenant.cognito.clientId === "" || tenant.cognito.poolId === "") {
    return (
      <ErrorsPreventedInitializing message="tenant.cognito.clientId or tenant.cognito.userPoolId is empty" />
    );
  }

  return (
    <Suspense
      fallback={
        <div className="ui-flex w-100 h-100 center v-center justify-items-center app-card center ui-rounded">
          <Spinner />
        </div>
      }
    >
      <Router history={history}>
        <Switch>
          <Route path="/sign-in" render={() => <SignIn />} />
          <Route path="/reset-password" render={() => <ResetPassword />} />
          <Route path="/change-password" render={() => <ChangePassword />} />
          <Route path="/forgot-password" render={() => <ForgotPassword />} />
          <Route path="/orders" render={() => <Orders history={history} />} />
          <Route>
            <Wrapper withBreadcrumb>
              <Body>
                <SideNavList />
                <NavBar>
                  <HeaderNavBar />
                </NavBar>
                <Content>
                  <Route
                    exact
                    path="/"
                    render={() => <DashboardApp history={history} />}
                  />
                  <Route
                    path="/network"
                    render={() => <NetworkApp history={history} />}
                  />
                  <Route
                    path="/voucher"
                    render={() => <VoucherApp history={history} />}
                  />
                  <Route
                    path="/iam"
                    render={() => <IAMApp history={history} />}
                  />
                  <Route
                    path="/menu"
                    render={() => <MenuAppV2 history={history} />}
                  />
                </Content>
                <Notification />
              </Body>
              <Footer>Butler</Footer>
            </Wrapper>
          </Route>
        </Switch>
        <Notification />
      </Router>
    </Suspense>
  );
}

export default App;
