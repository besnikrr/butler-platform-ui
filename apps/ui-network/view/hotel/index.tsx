import { Switch, Route } from "react-router-dom";

import List from "./list";
import HotelDetails from "./details";
import HotelCreateView from "./create";
import HotelEditorRoute from "./edit";

export default function HotelRoute() {
  return (
    <Switch>
      <Route exact path="/network/hotel/list">
        <List />
      </Route>
      <Route path="/network/hotel/edit">
        <HotelEditorRoute />
      </Route>
      <Route path="/network/hotel/create">
        <HotelCreateView />
      </Route>
      <Route exact path="/network/hotel/view/:id">
        <HotelDetails />
      </Route>
    </Switch>
  );
}
