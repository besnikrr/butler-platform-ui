import { useContext, useState, useRef } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import {
  AppContext,
  Button,
  ButtonBase,
  Dropdown,
  Icon,
  IconType,
  InputSearch,
  SideNav,
  SideNavListItemType,
  Typography,
} from "@butlerhospitality/ui-sdk";
import { AppEnum } from "@butlerhospitality/shared";
import { useFetchApps } from "../store/app";

const pathAppMap: { [key: string]: AppEnum } = {
  "": AppEnum.DASHBOARD,
  network: AppEnum.NETWORK,
  voucher: AppEnum.VOUCHER,
  discount: AppEnum.DISCOUNT,
  iam: AppEnum.IAM,
  menu: AppEnum.MENU,
  orders: AppEnum.ORDER,
};

const getAppEnumBy = (path: string): AppEnum => {
  const pathParts = path.split("/");
  const pathPart = pathParts[1];
  const appEnum = pathAppMap[pathPart];
  if (!appEnum && pathPart !== "sign-in") {
    throw new Error(`AppEnum not found for path: ${path}`);
  }
  return appEnum;
};

const getAppTitle = (app: AppEnum) => {
  if (app === AppEnum.NETWORK) return "Network";
  if (app === AppEnum.IAM) return "Users & Roles";
  if (app === AppEnum.MENU) return "Menu";
  if (app === AppEnum.VOUCHER) return "Voucher";
  if (app === AppEnum.DISCOUNT) return "Discount";
  if (app === AppEnum.ORDER) return "Orders";
  return "";
};

function SideNavList() {
  const history = useHistory();
  const location = useLocation();
  const { getNavigation } = useContext(AppContext);

  const [filter, setFilter] = useState<string>("");

  const dropdownRef = useRef<any>(null);

  const { data: apps } = useFetchApps({});

  const getActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path ? "primary" : "ghost";
    }
    return matchPath(location.pathname, path) ? "primary" : "ghost";
  };

  const items = getNavigation?.(getAppEnumBy(location.pathname))?.filter(
    (item) => item.permission
  );

  if (!items) {
    return null;
  }

  return (
    <SideNav>
      <div className="main-sidebar-header ui-flex v-center between mb-20 pl-10">
        <Typography h1>
          {getAppTitle(getAppEnumBy(location.pathname))}
        </Typography>
        <Dropdown
          renderTrigger={(openDropdown, triggerRef) => {
            return (
              <Button
                variant="ghost"
                ref={triggerRef}
                onClick={openDropdown}
                iconOnly
              >
                <Icon type="Union" />
              </Button>
            );
          }}
          ref={dropdownRef}
          placement="left"
          hasArrow
        >
          <div className="main-app-list ui-flex column">
            <InputSearch
              autoFocus
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {apps
              ?.filter(
                (app) =>
                  app.name.toLowerCase().includes(filter.toLowerCase()) ||
                  app.description.toLowerCase().includes(filter.toLowerCase())
              )
              .map((app) => (
                <ButtonBase
                  key={app.name}
                  className="main-app-card ui-flex mt-10 p-5 ui-rounded"
                  onClick={() => {
                    setFilter("");
                    dropdownRef?.current?.closeDropdown();
                    history.push(`/${app.dashboard_settings.path}`);
                  }}
                >
                  <div
                    className="main-app-card-icon ui-flex v-center center ui-rounded"
                    style={{
                      backgroundColor: app.dashboard_settings?.color,
                      color: app.dashboard_settings?.iconColor,
                    }}
                  >
                    <Icon
                      type={app.dashboard_settings?.icon as IconType}
                      size={24}
                    />
                  </div>
                  <div className="pl-10">
                    <Typography size="large">
                      {getAppTitle(app.name as AppEnum) ?? app.name}
                    </Typography>
                    <Typography p muted>
                      {app?.description}
                    </Typography>
                  </div>
                </ButtonBase>
              ))}
          </div>
        </Dropdown>
      </div>
      <div className="main-sidebar-wrapper">
        {items?.map((item: SideNavListItemType) => (
          <Button
            key={item.path}
            onClick={() => history.push(item.path)}
            variant={getActive(
              `/${item.path.split("/").slice(1, 3).join("/")}`
            )}
            className="w-100 text-large"
            muted
          >
            {item.name}
          </Button>
        ))}
      </div>
    </SideNav>
  );
}

export default SideNavList;
