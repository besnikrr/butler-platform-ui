import { useEffect, useContext } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { initLocalization, AppContext } from "@butlerhospitality/ui-sdk";

import { AppEnum, PERMISSION } from "@butlerhospitality/shared";

import { Helmet } from "react-helmet-async";
import CityRoute from "./view/city";
import HotelRoute from "./view/hotel";
import HubRoute from "./view/hub";

import "./styles.scss";

/**
 * @description Initializing localization
 */
import { resources } from "./locales";

initLocalization(resources);

const APP_NETWORK_UI_DEFAULT_VIEW = "/network/city/list";

/**
 * @description Main App Component
 * @param {Object} props - Component props
 * @param {Object} props.history - Browser history created by react-router-dom inside ui-main
 * @returns {JSX} - UI Network App as component
 */

const App = ({ history }: { history: any }): JSX.Element => {
  /**
   * @description App context
   */
  const { setNavigation } = useContext(AppContext);
  const { can } = useContext(AppContext);
  const canGetCities = can(PERMISSION.NETWORK.CAN_GET_CITIES);
  const canGetHubs = can(PERMISSION.NETWORK.CAN_GET_HUBS);
  const canGetHotels = can(PERMISSION.NETWORK.CAN_GET_HOTELS);
  /**
   * @description Initializing navigation for ui-network app
   */
  useEffect(() => {
    setNavigation?.(AppEnum.NETWORK, [
      {
        name: "City",
        path: "/network/city/list",
        permission: !!canGetCities,
      },
      {
        name: "Hub",
        path: "/network/hub/list",
        permission: !!canGetHubs,
      },
      {
        name: "Hotel",
        path: "/network/hotel/list",
        permission: !!canGetHotels,
      },
    ]);
  }, [canGetCities, canGetHubs, canGetHotels]);

  return (
    <>
      <Helmet>
        <title>Butler Platform - Network</title>
      </Helmet>
      <Router history={history}>
        <Switch>
          <Route>
            <Switch>
              <Route exact path="/network">
                <Redirect to={APP_NETWORK_UI_DEFAULT_VIEW} />
              </Route>
              <Route path="/network/city">
                <CityRoute />
              </Route>
              <Route path="/network/hotel">
                <HotelRoute />
              </Route>
              <Route path="/network/hub">
                <HubRoute />
              </Route>
            </Switch>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
