import { useContext, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { AppContext, Body, Content, initLocalization, NavBar, Wrapper } from "@butlerhospitality/ui-sdk";

import HeaderNavBar from "./component/HeaderNavBar";
import { CreateOrder } from "./view/editor";
import { OrdersDashboard } from "./view/dashboard";
import { OrderProvider } from "./view/editor/store/order-context";
import { History } from "./view/history";
import { getToken } from "./util/helpers";
import { publish } from "./util/pubsub";

import "./styles.scss";

import { resources } from "./locales";

const webSocketUrl = process.env.NX_WEB_SOCKET_URL || "";
initLocalization(resources);

const App = ({ history }: { history: any }): JSX.Element => {
  const { tenant } = useContext(AppContext);

  useEffect(() => {
    getToken(tenant).then((res) => {
      const websocket = new WebSocket(`${webSocketUrl}?token=${res}`);
      websocket.onopen = () => {
        console.log("connected");
      };

      websocket.onmessage = (event) => {
        const { data, id } = JSON.parse(event.data);
        publish(data, id);
      };

      return () => {
        websocket.close();
      };
    });
  }, []);

  return (
    <Wrapper compact>
      <Body>
        <NavBar>
          <HeaderNavBar />
          {/* <HeaderNavBar /> */}
        </NavBar>
        <Content>
          <Router history={history}>
            <Switch>
              <Route>
                <Switch>
                  <Route exact path="/orders">
                    <OrdersDashboard />
                  </Route>
                  <Route exact path="/orders/create">
                    <OrderProvider>
                      <CreateOrder />
                    </OrderProvider>
                  </Route>
                  <Route path="/orders/:id/edit">
                    <OrderProvider>
                      <CreateOrder />
                    </OrderProvider>
                  </Route>
                  <Route path="/orders/history">
                    <History />
                  </Route>
                </Switch>
              </Route>
            </Switch>
          </Router>
        </Content>
      </Body>
    </Wrapper>
  );
};

export default App;
