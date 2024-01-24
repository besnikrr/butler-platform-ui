import React, { useContext, useEffect, useState } from "react";
import { useParams, Link as RouterLink, Redirect, useHistory } from "react-router-dom";
import {
  Card,
  Column,
  useApi,
  Grid,
  Row,
  Typography,
  Link,
  Skeleton,
  AppContext,
  pushNotification,
  useTranslation,
  Button,
  Dropdown,
  Icon,
  DeleteResourceMeta,
  GoToOMSLink,
  Badge,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import classNames from "classnames";
import { CategoryCollapsible } from "./category-collapsible";
import HotelsListView from "./hotel-list";

import "../style.scss";
import DeleteResource from "./delete-resource";

interface Menu {
  id: string;
  name: string;
  dateCreated: string;
  status: string;
  assignedHotels: number;
  hasChanges?: boolean;
  published?: boolean;
}
const MenusManageView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [menuHasChanges, setMenuHasChanges] = useState<boolean>();
  const [menuPublish, setMenuPublish] = useState<boolean>();
  const [deleteResourceMeta, setDeleteResourceMeta] = useState<DeleteResourceMeta>();
  const canGetMenu = can(PERMISSION.MENU.CAN_GET_SINGLE_MENU);
  const canGetMenuHotels = can(PERMISSION.MENU.CAN_GET_MENU_HOTELS);
  const canPublishenu = can(PERMISSION.MENU.CAN_PUSH_MENU_TO_PRODUCTION);
  const canUpdateMenu = can(PERMISSION.MENU.CAN_UPDATE_MENU);
  const canAssignMenu = can(PERMISSION.MENU.CAN_ASSIGN_MENU);
  const canGetHotels = can(PERMISSION.MENU.CAN_GET_HOTELS);
  const canDeleteMenu = can(PERMISSION.MENU.CAN_DELETE_MENU);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        const result = await menuServiceApi.get<HTTPResourceResponse<Menu>>(`/${id}?formatted=true`);
        setData(result.data.payload);
      } catch (error: any) {
        pushNotification(error.response?.data?.message, {
          type: "error",
        });
        history.push("/menu/menu/list");
      } finally {
        setLoading(false);
      }
    };

    if (canGetMenu) {
      getData();
    }
  }, []);

  const handlePushProduction = async () => {
    try {
      const result = await menuServiceApi.post<HTTPResourceResponse<Menu>>(`/${id}/push-production`);
      setMenuHasChanges(result.data.payload?.hasChanges);
      setMenuPublish(result.data.payload?.published);
      pushNotification("Menu status updated successfully", {
        type: "success",
      });
    } catch (e: any) {
      pushNotification(e.message, { type: "error" });
    }
  };

  if (!canGetMenu) {
    pushNotification("You have no permissions to view menu", {
      type: "warning",
    });
    return <Redirect to="/menu/menu/list" />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Skeleton parts={["header"]} className="pt-10" />
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "block"]} />
        </Card>
        <Card className="mt-20" page>
          <Skeleton parts={["filterTable-2"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <div className="ui-flex v-center">
              <Typography h2>{data.name}</Typography>
              <Badge
                leftIcon="Circle"
                iconSize={5}
                size="small"
                className={classNames({ "menu-inactive-badge": data.status !== "ACTIVE" }, "ml-30")}
              >
                {data?.status === "ACTIVE" ? t("active") : t("inactive")}
              </Badge>
            </div>
            <Dropdown
              renderTrigger={(openDropdown, triggerRef) => (
                <Button size="small" variant="ghost" ref={triggerRef} onClick={openDropdown} iconOnly>
                  <Icon type="MoreHorizontal01" size={18} />
                </Button>
              )}
              hasArrow
              placement="right"
            >
              <div className="ui-flex column network-action-dropdown">
                <div>
                  {canPublishenu && (
                    <Button className="w-100" variant="ghost" muted onClick={handlePushProduction}>
                      <Icon type="Send" size={20} className="mr-10" />
                      {t("push_to_production")}
                      {menuHasChanges ? "*" : ""}
                    </Button>
                  )}
                  {canDeleteMenu && (
                    <Button
                      className="w-100"
                      variant="danger-ghost"
                      muted
                      onClick={() => {
                        setDeleteResourceMeta({
                          label: "menu",
                          resource: "menu",
                          id,
                        });
                      }}
                    >
                      <Icon type="Delete" size={20} className="mr-10" />
                      {t("Delete")}
                    </Button>
                  )}
                </div>
              </div>
            </Dropdown>
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={
              <>
                <Typography h2>{t("menu_items")}</Typography>
                {canUpdateMenu && (
                  <Link component={RouterLink} to={`/menu/menu/manage/${id}`}>
                    {t("edit")}
                  </Link>
                )}
              </>
            }
          >
            <div className="ui-flex end between v-start mb-20">
              {data?.oms_id && <GoToOMSLink path={`menu-management/${data.oms_id}`} />}
            </div>
            {Object.keys(data?.categories || []).map((key: string) => {
              const category = data.categories[key] as any;
              return <CategoryCollapsible key={key} category={category} className="menu-category-collapsible" />;
            })}
          </Card>
        </Column>
      </Row>
      {canGetMenuHotels && (
        <Row>
          <Column>
            <Card
              className="menu-content"
              page
              header={
                <>
                  <Typography h2>{t("hotels_assigned")}</Typography>
                  {canAssignMenu && canGetHotels && (
                    <Link
                      component={RouterLink}
                      to={`/menu/menu/hotels/${encodeURIComponent(data.name)}/${id}`}
                      disabled={menuPublish}
                    >
                      {menuPublish ? t("menu_not_published") : t("edit")}
                    </Link>
                  )}
                </>
              }
            >
              <HotelsListView />
            </Card>
          </Column>
        </Row>
      )}
      {deleteResourceMeta && (
        <DeleteResource
          meta={deleteResourceMeta}
          onClose={() => {
            setDeleteResourceMeta(undefined);
          }}
          onDelete={() => {
            setDeleteResourceMeta(undefined);
            pushNotification("Menu deleted successfully", {
              type: "success",
            });
            history.push("/menu/menu/list");
          }}
        />
      )}
    </Grid>
  );
};

export default MenusManageView;
