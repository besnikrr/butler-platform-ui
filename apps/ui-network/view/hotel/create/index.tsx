import { Switch, Route } from "react-router-dom";

import HotelCreateGeneralInfo from "./general-information";

const HotelEditorRoute = () => {
  return (
    <Switch>
      <Route exact path="/network/hotel/create">
        <HotelCreateGeneralInfo />
      </Route>
    </Switch>
  );
};

export default HotelEditorRoute;
