import { Router, Switch, Route } from "react-router-dom";
import { Content } from "@butlerhospitality/ui-sdk";
import { Helmet } from "react-helmet-async";
import AppDashboardList from "./view/app-dashboard";

const App = ({ history }: { history: any }): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Butler Platform - Dashboard</title>
      </Helmet>
      <Router history={history}>
        <Switch>
          <Route>
            <Content>
              <Switch>
                <Route path="/">
                  <Switch>
                    <Route exact path="/">
                      <AppDashboardList />
                    </Route>
                  </Switch>
                </Route>
              </Switch>
            </Content>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
