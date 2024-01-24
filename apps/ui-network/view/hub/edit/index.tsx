import { Switch, Route } from "react-router-dom";

import HubCreateEdit from "./hub-edit";
import EditNextMvSettings from "./edit-nextmv-settings";
import EditExpeditorSettings from "./edit-expeditor-settings";

const HubEditor = () => {
  return (
    <Switch>
      <Route exact path="/network/hub/edit/:id">
        <HubCreateEdit />
      </Route>
      <Route exact path="/network/hub/edit/next-mv-settings/:id">
        <EditNextMvSettings />
      </Route>
      <Route exact path="/network/hub/edit/expeditor-settings/:id">
        <EditExpeditorSettings />
      </Route>
    </Switch>
  );
};

export default HubEditor;
