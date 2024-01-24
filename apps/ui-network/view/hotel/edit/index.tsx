import { Switch, Route } from "react-router-dom";

import CarService from "./car-service";
import PaymentSettings from "./payment-settings";
import VoucherSettings from "./voucher-settings";
import HotelEditorGeneralInfo from "./general-information";
import HotelMenu from "./menu";
import Activities from "./activities";
import ServiceFee from "./service-fee";

const HotelEditRoute = () => {
  return (
    <Switch>
      <Route exact path="/network/hotel/edit/general-information/:id">
        <HotelEditorGeneralInfo />
      </Route>
      <Route exact path="/network/hotel/edit/payment-settings/:id">
        <PaymentSettings />
      </Route>
      <Route exact path="/network/hotel/edit/menu/:id">
        <HotelMenu />
      </Route>
      <Route exact path="/network/hotel/edit/service-fee/:id">
        <ServiceFee />
      </Route>
      <Route exact path="/network/hotel/edit/vouchers/:id">
        <VoucherSettings />
      </Route>
      <Route exact path="/network/hotel/edit/shuttle-app/:id">
        <CarService />
      </Route>
      <Route exact path="/network/hotel/edit/activities/:id">
        <Activities />
      </Route>
    </Switch>
  );
};

export default HotelEditRoute;
