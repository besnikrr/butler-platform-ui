import { useContext, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { AppContext, initLocalization } from "@butlerhospitality/ui-sdk";

import { AppEnum, PERMISSION } from "@butlerhospitality/shared";
import CategoryListView from "./view/category/list";
import CategoryEditorView from "./view/category/create";
import CategoryView from "./view/category/details";
import CategoryManage from "./view/category/edit";
import ItemsListView from "./view/item/list";
import ItemsCreateView from "./view/item/create";
import ItemsEditView from "./view/item/edit";
import ItemsManageView from "./view/item/details";
import ModifiersListView from "./view/modifier/list";
import MenusBatchEdit from "./view/menu/batch-edit";
import ModifiersEditorView from "./view/modifier/create";
import ModifiersView from "./view/modifier/details";
import ModifiersManageView from "./view/modifier/edit";
import LabelsListView from "./view/label/list";
import LabelsEditorView from "./view/label/create";
import LabelsManageView from "./view/label/edit";
import LabelsView from "./view/label/details";

import HotelsEditorView from "./view/menu/hotel-edit";
import MenusListView from "./view/menu/list";
import MenuEditorView from "./view/menu/create";
import MenuEdit from "./view/menu/edit";
import MenusManageView from "./view/menu/details";
import "./view/menu/style.scss";

import "./styles.scss";

/**
 * @description Initializing localization
 */
import { resources } from "./locales";

initLocalization(resources);

const App = ({ history }: { history: any }): JSX.Element => {
  /**
   * @description App context
   */
  const { setNavigation, can } = useContext(AppContext);

  const canGetMenus = can(PERMISSION.MENU.CAN_GET_MENUS);
  const canGetCategories = can(PERMISSION.MENU.CAN_GET_CATEGORIES);
  const canGetItems = can(PERMISSION.MENU.CAN_GET_ITEMS);
  const canGetSubcategories = can(PERMISSION.MENU.CAN_GET_SUBCATEGORIES);
  const canGetModifiers = can(PERMISSION.MENU.CAN_GET_MODIFIERS);
  const canGetLabels = can(PERMISSION.MENU.CAN_GET_LABELS);

  useEffect(() => {
    setNavigation?.(AppEnum.MENU, [
      {
        name: "Menu",
        path: "/menu/menu/list",
        permission: canGetMenus,
      },
      {
        name: "Category",
        path: "/menu/category/list",
        permission: canGetCategories,
      },
      {
        name: "Item",
        path: "/menu/item/list",
        permission: canGetItems,
      },
      {
        name: "Modifier",
        path: "/menu/modifier/list",
        permission: canGetModifiers,
      },
      {
        name: "Label",
        path: "/menu/label/list",
        permission: canGetLabels,
      },
    ]);
  }, [canGetMenus, canGetCategories, canGetSubcategories, canGetItems, canGetModifiers, canGetLabels]);

  return (
    <Router history={history}>
      <Switch>
        <Route path="/menu/category">
          <Switch>
            <Route exact path="/menu/category/list">
              <CategoryListView />
            </Route>
            <Route exact path="/menu/category/editor">
              <CategoryEditorView />
            </Route>
            <Route exact path="/menu/category/view/:id">
              <CategoryView />
            </Route>
            <Route exact path="/menu/category/manage/:id">
              <CategoryManage />
            </Route>
          </Switch>
        </Route>
        <Route path="/menu/item">
          <Switch>
            <Route exact path="/menu/item/list">
              <ItemsListView />
            </Route>
            <Route exact path="/menu/item/create">
              <ItemsCreateView />
            </Route>
            <Route exact path="/menu/item/manage/:type/:id">
              <ItemsEditView />
            </Route>
            <Route exact path="/menu/item/view/:id">
              <ItemsManageView />
            </Route>
          </Switch>
        </Route>
        <Route path="/menu/modifier">
          <Switch>
            <Route exact path="/menu/modifier/list">
              <ModifiersListView />
            </Route>
            <Route exact path="/menu/modifier/editor">
              <ModifiersEditorView />
            </Route>
            <Route exact path="/menu/modifier/view/:id">
              <ModifiersView />
            </Route>
            <Route exact path="/menu/modifier/manage/:id">
              <ModifiersManageView />
            </Route>
          </Switch>
        </Route>
        <Route path="/menu/label">
          <Switch>
            <Route exact path="/menu/label/list">
              <LabelsListView />
            </Route>
            <Route exact path="/menu/label/editor">
              <LabelsEditorView />
            </Route>
            <Route exact path="/menu/label/view/:id">
              <LabelsView />
            </Route>
            <Route exact path="/menu/label/manage/:id">
              <LabelsManageView />
            </Route>
          </Switch>
        </Route>
        <Route path="/menu">
          <Switch>
            <Route exact path="/menu/menu/list">
              <MenusListView />
            </Route>
            <Route exact path="/menu/menu/batch-edit">
              <MenusBatchEdit />
            </Route>
            <Route exact path="/menu/menu/editor">
              <MenuEditorView />
            </Route>
            <Route exact path="/menu/menu/manage/:id">
              <MenuEdit />
            </Route>
            <Route exact path="/menu/menu/view/:id">
              <MenusManageView />
            </Route>
            <Route exact path="/menu/menu/hotels/:name/:id">
              <HotelsEditorView />
            </Route>
            <Redirect to="/menu/menu/list" />
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
// eof2
