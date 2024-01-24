import { useContext, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import {
  initLocalization,
  AppContext,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import { AppEnum, PERMISSION } from "@butlerhospitality/shared";

import * as routes from "./routes";
import HotelProgramListView from "./view/hotel-program/list";
import ProgramListView from "./view/program/list";
import ProgramDetails from "./view/program/details";
import ProgramCreateView from "./view/program/create";
import ProgramDetailsEdit from "./view/program/edit/details";
import ProgramConfigEdit from "./view/program/edit/config";
import CodesListView from "./view/code/list";

import "./styles.scss";

import { resources } from "./locales";

initLocalization(resources);

const App = ({ history }: { history: any }): JSX.Element => {
  const { t } = useTranslation();
  /**
   * @description App context
   */
  const { setNavigation, can } = useContext(AppContext);

  const canGetHotelsWithVouchers =
    can && can(PERMISSION.VOUCHER.CAN_LIST_VOUCHER_PROGRAMS_HOTELS);
  const canListVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_LIST_VOUCHER_PROGRAMS_HOTELS);
  const canGetHotelVoucherCodes =
    can && can(PERMISSION.VOUCHER.CAN_GET_HOTEL_VOUCHER_CODES);
  const defaultView = routes.hotelProgramList.path;

  /**
   * @description Initializing navigation for ui-voucher app
   */
  useEffect(() => {
    let navigation: any = [];
    navigation = [
      {
        name: t("HOTELS"),
        path: routes.hotelProgramList.path,
        permission: canGetHotelsWithVouchers,
      },
    ];
    setNavigation?.(AppEnum.VOUCHER, navigation);
  }, [
    canGetHotelsWithVouchers,
    canListVoucherPrograms,
    canGetHotelVoucherCodes,
  ]);

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/voucher">
          <Redirect to={defaultView} />
        </Route>
        <Route exact path={routes.hotelProgramList.path}>
          <HotelProgramListView />
        </Route>
        <Route exact path={`${routes.programCreate.path}`}>
          <ProgramCreateView />
        </Route>
        <Route exact path={`${routes.programList.path}/:hotelId`}>
          <ProgramListView />
        </Route>
        <Route exact path={`${routes.codeList.path}/:hotelId`}>
          <CodesListView />
        </Route>
        <Route exact path={`${routes.programDetails.path}/:id`}>
          <ProgramDetails />
        </Route>
        <Route exact path={`${routes.programEditDetails.path}/:id`}>
          <ProgramDetailsEdit />
        </Route>
        <Route exact path={`${routes.programEditConfigs.path}/:type/:id`}>
          <ProgramConfigEdit />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
