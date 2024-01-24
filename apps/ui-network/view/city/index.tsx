import { Switch, Route } from "react-router-dom";

import CityEdit from "./edit";
import CityList from "./list";
import CityView from "./details";
import CityCreate from "./create";

export default function CityRoute() {
  return (
    <Switch>
      <Route exact path="/network/city/list">
        <CityList />
      </Route>
      <Route exact path="/network/city/edit/:id">
        <CityEdit />
      </Route>
      <Route exact path="/network/city/create">
        <CityCreate />
      </Route>
      <Route exact path="/network/city/view/:id">
        <CityView />
      </Route>
    </Switch>
  );
}
