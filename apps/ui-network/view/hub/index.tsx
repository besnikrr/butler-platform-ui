import { Switch, Route } from "react-router-dom";

import HubList from "./list";
import HubEdit from "./edit";
import HubCreate from "./create";
import HubView from "./details";

const HubRoute = () => (
  <Switch>
    <Route exact path="/network/hub/list">
      <HubList />
    </Route>
    <Route exact path="/network/hub/create">
      <HubCreate />
    </Route>
    <Route
      exact
      path={[
        "/network/hub/edit/:id",
        "/network/hub/edit/next-mv-settings/:id",
        "/network/hub/edit/expeditor-settings/:id",
      ]}
    >
      <HubEdit />
    </Route>
    <Route exact path="/network/hub/view/:id">
      <HubView />
    </Route>
  </Switch>
);

export default HubRoute;
