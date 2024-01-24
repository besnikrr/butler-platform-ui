import React, { useContext, useEffect, useState } from "react";
import qs from "qs";
import {
  AppContext,
  Badge,
  Button,
  ButtonBase,
  Card,
  Divider,
  Grid,
  Icon,
  InputSearch,
  Modal,
  Skeleton,
  Typography,
  useDebounce,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { AppEnum, Hub } from "@butlerhospitality/shared";
import { size as _size, get as _get } from "lodash";
import { useQueryClient } from "react-query";
import { buildOrderStatus, firstLetterUppercase } from "../../util/helpers";
import { subscribeToMultipleTopics } from "../../util/pubsub";
import { useFetch } from "../../hooks/use-fetch";
import { Drawer, OrderCard, OrderView, SelectHubsDrawer } from "../../component";
import { setAlphaColor } from "../../util";
import {
  initialHubsAndStatusesState,
  OrderStatuses,
  showOrderStatuses,
  OrderQueryParams,
  Order,
  WebSocketsActionTypes,
} from "../../util/constants";
import { useQueryController } from "../../util/hooks/useQueryController";

const OrdersDashboard: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { user } = useContext(AppContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const search = useDebounce<string>(searchValue);
  const [hubs, setHubs] = useState<Hub[]>();
  const { setParams, removeParams, getValues, removeField, toggleParam } = useQueryController();
  const [filters, setFilters] = useState<OrderQueryParams | null>(null);
  const { hubIds, ...restOp } = filters || {};
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [myAssignedOrders, setMyAssignedOrders] = useState<number[]>([]);

  const { data: orders, isLoading: ordersLoading } = useFetch(AppEnum.ORDER)<Order[], OrderQueryParams>(
    {
      path: "/dashboard",
      query: filters && filters.hubIds?.[0] !== "all" ? { ...filters, search } : { ...restOp, search },
    },
    { enabled: _size(filters?.hubIds) > 0 }
  );

  const { data: hubsAndStatusesOrderCount } = useFetch(AppEnum.ORDER)<any, OrderQueryParams>(
    {
      path: "/list-by-hubs",
      query: filters?.hubIds?.[0] !== "all" ? { hubIds: filters?.hubIds } : {},
    },
    { enabled: _size(filters?.hubIds) > 0 }
  );

  const { data: hubsData, isLoading: hubsLoading } = useFetch(AppEnum.NETWORK)<Hub[], OrderQueryParams>({
    path: "/hubs",
    query: { paginated: false, statuses: ["true"] },
  });

  const { data: unFilteredOrders, isLoading: unFilteredOrdersLoading } = useFetch(AppEnum.ORDER)<
    Order[],
    OrderQueryParams
  >(
    {
      path: "/dashboard",
      query: filters && filters.hubIds?.[0] !== "all" ? { hubIds: filters?.hubIds } : {},
    },
    { enabled: _size(filters?.hubIds) > 0 }
  );

  const { data: changedOrder, isLoading: isChangedOrderLoading } = useFetch(AppEnum.ORDER)<Order>(
    {
      path: `/${orderId}`,
    },
    { enabled: orderId > 0 }
  );

  const params: any = React.useMemo(
    () =>
      qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      }),
    [window.location.search]
  );
  const selectedHubIds: string[] = React.useMemo(() => getValues("hubs"), [params.hubs]);
  const selectedStatuses: string[] = React.useMemo(() => getValues("status"), [params.status]);

  const showUpdatedModalCondition = (data: string) => {
    return [
      WebSocketsActionTypes.ORDER_PICKUP,
      WebSocketsActionTypes.ORDER_CONFIRMED,
      WebSocketsActionTypes.ORDER_CANCELLED,
      WebSocketsActionTypes.ORDER_REJECTED,
      WebSocketsActionTypes.ORDER_ASSIGNED,
      WebSocketsActionTypes.ORDER_REMOVED_FOOD_CARRIER,
    ].includes(data);
  };

  useEffect(() => {
    if (!hubsLoading) {
      setHubs(_get(hubsData, "payload"));
    }
  }, [hubsData]);

  useEffect(() => {
    if (!unFilteredOrdersLoading) {
      const myOrder = unFilteredOrders?.payload
        ?.filter((order) => order?.meta?.dispatcher?.id === user.details?.id)
        .map((order) => order.id);
      setMyAssignedOrders(myOrder as number[]);
    }
  }, [unFilteredOrders]);

  useEffect(() => {
    setFilters({
      hubIds: selectedHubIds,
      statuses: selectedStatuses,
    });
  }, [selectedHubIds, selectedStatuses]);

  useEffect(() => {
    const unsubscribe = subscribeToMultipleTopics(
      [
        WebSocketsActionTypes.ORDER_CREATED,
        WebSocketsActionTypes.ORDER_PICKUP,
        WebSocketsActionTypes.ORDER_ASSIGNED,
        WebSocketsActionTypes.ORDER_CONFIRMED,
        WebSocketsActionTypes.ORDER_CANCELLED,
        WebSocketsActionTypes.ORDER_REJECTED,
        WebSocketsActionTypes.ORDER_REMOVED_FOOD_CARRIER,
      ],
      (id: number, action: string) => {
        if (myAssignedOrders?.includes(id) && showUpdatedModalCondition(action)) {
          setOrderId(id);
          setOrderStatus(action);
          setIsModalOpen(true);
        }
        queryClient.invalidateQueries("/dashboard");
        queryClient.invalidateQueries("/list-by-hubs");
      }
    );
    return unsubscribe;
  }, [myAssignedOrders]);

  const onApplyFilters = (cities?: string[], _hubIds?: string[]) => {
    if (cities) {
      setParams("cities", cities);
    } else {
      removeField("cities");
    }
    if (_hubIds) {
      setParams("hubs", _hubIds);
    }
    removeField("order");
  };

  const removeHub = (hubId: string) => {
    if (selectedHubIds?.length === 1) {
      removeField("city");
    }
    removeParams("hubs", hubId);
    removeField("order");
  };

  const handleToggleStatus = (status: string) => {
    removeField("order");
    toggleParam("status", status);
  };

  const renderOrders = React.useMemo(() => {
    if (orders?.payload?.length)
      return orders?.payload?.map((order: Order) => {
        return <OrderCard order={order} key={order.id} />;
      });
    return (
      <div className="ui-flex v-center center h-100">
        <div className="text-center w-100">
          <Typography size="large" className="ui-block mt-10 mb-20">
            {t("orders_no_results")}
          </Typography>
        </div>
      </div>
    );
  }, [orders, params.order]);

  return (
    <Grid gutter={0} className="orders-app-container">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SelectHubsDrawer closeDrawer={() => setDrawerOpen(false)} onApplyFilters={onApplyFilters} />
      </Drawer>
      <div className="ui-flex">
        <div className="orders-side-nav">
          <div className="ui-flex v-center between pl-10">
            <Typography h2>{t("orders")}</Typography>
          </div>
          <Divider vertical={10} />
          <Button
            size="small"
            variant="ghost"
            className="w-100 text-medium"
            onClick={(e) => {
              e.preventDefault();
              history.push("/orders/history");
            }}
          >
            {t("order_history")}
          </Button>
          <Divider vertical={10} />
          {/* orders type filter navigation */}
          <div className="ui-flex v-start column mt-10">
            {showOrderStatuses?.map((status: string) => {
              const obj = (
                hubsAndStatusesOrderCount && params.hubs
                  ? hubsAndStatusesOrderCount?.payload?.statuses
                  : initialHubsAndStatusesState.statuses
              ).find((hub: any) => hub.status === status);
              const isSelected = selectedStatuses.includes(obj.status);
              return (
                showOrderStatuses.includes(obj.status) && (
                  <Button
                    key={obj.status}
                    className={`w-100 mt-5 text-medium ${isSelected ? "ui-hover" : ""}`}
                    variant="ghost"
                    size="small"
                    onClick={() => handleToggleStatus(obj.status)}
                  >
                    <div className="ui-flex between v-center w-100">
                      {(OrderStatuses as any)[obj.status]}
                      {!!obj.count && (
                        <Badge size="small" className={isSelected ? "order-badge-selected" : ""}>
                          {obj.count}
                        </Badge>
                      )}
                    </div>
                  </Button>
                )
              );
            })}
          </div>
          <Divider vertical={10} />
          {/* Hub selection */}
          <div>
            <ButtonBase className="text-large px-10 w-100" variant="ghost">
              <div className="ui-flex between v-center w-100">
                <div className="ui-flex v-center">
                  <Icon type="Store01" size={22} />
                  <div className="ui-flex v-center ml-10">
                    {t("hubs")}
                    <Badge className="ml-10" size="small">
                      {params.hubs ? params.hubs.split(",").length : 0}
                    </Badge>
                  </div>
                </div>
                <Icon className="ui-muted pr-5" type="ArrowDown" size={16} />
              </div>
            </ButtonBase>
            <Typography className="ui-block my-10" muted>
              {t("selected_hubs")}
            </Typography>
            {selectedHubIds.length && selectedHubIds[0] === "all" ? (
              <Badge onClose={() => removeHub("all")} className="w-100 mt-5" size="large">
                <div className="order-coloured-dot default" /> {t("all")} ({orders?.total || 0})
              </Badge>
            ) : null}
            {hubs?.map(
              (hub: any) =>
                (params.hubs || []).includes(`${hub.id}`) && (
                  <Badge
                    key={hub.id}
                    onClose={() => removeHub(`${hub.id}`)}
                    backgroundColor={setAlphaColor(hub.color, 0.1)}
                    className="w-100 mt-5"
                    size="large"
                  >
                    <div style={{ backgroundColor: hub.color }} className="order-coloured-dot" /> {hub.name} (
                    {(hubsAndStatusesOrderCount
                      ? hubsAndStatusesOrderCount?.payload?.hubs
                      : initialHubsAndStatusesState.hubs
                    ).find((h: any) => h.hubId === hub.id)?.count || 0}
                    )
                  </Badge>
                )
            )}
            <Button
              onClick={() => setDrawerOpen(true)}
              className="w-100 text-medium mt-5"
              variant="ghost"
              size="small"
              rightIcon={<Icon type="Plus" size={16} />}
            >
              <div className="w-100">{t("select_another_hub")}</div>
            </Button>
          </div>
        </div>
        {/* Order Cards */}
        <Card size="small" className="orders-app-column mx-10">
          <div className="ui-flex column h-100">
            <div className="ui-flex v-center between orders-app-column-header">
              <InputSearch
                placeholder={t("search")}
                className="ui-transparent mr-20"
                size="small"
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <Button
                size="small"
                onClick={() => history.push("/orders/create")}
                rightIcon={<Icon type="Plus" size={14} />}
              >
                {t("new")}
              </Button>
            </div>
            {ordersLoading ? (
              <Skeleton parts={["labelField-3"]} />
            ) : (
              <>
                {params.hubs ? (
                  renderOrders
                ) : (
                  <div className="ui-flex v-center center h-100">
                    <div className="text-center w-100">
                      <div className="ui-flex center">
                        <Icon type="Store01" size={40} className="mt-10" />
                      </div>
                      <Typography size="large" className="ui-block mt-10 mb-20">
                        {t("no_hubs_selected")}
                      </Typography>
                      <Typography className="ui-block mb-20" muted>
                        {t("select_one_multiple_hubs_order_appear")}
                      </Typography>
                      <Button
                        onClick={() => setDrawerOpen(true)}
                        size="small"
                        variant="ghost"
                        rightIcon={<Icon type="Plus" size={14} />}
                      >
                        {t("select_hubs_to_cover")}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
        <div className="orders-order-view-container">
          {/* Order Details */}
          {ordersLoading ? (
            <Skeleton parts={["block-2"]} />
          ) : (
            <>
              {params.order ? (
                <OrderView />
              ) : (
                !params.order &&
                params.hubs && (
                  <div className="ui-flex v-center center h-100">
                    <div style={{ width: 250 }} className="text-center">
                      <div className="ui-flex center">
                        <Icon type="ShoppingBag" size={40} className="mt-10" />
                        <div
                          className="ui-flex v-center center"
                          style={{
                            borderRadius: "100%",
                            width: 20,
                            height: 20,
                            background: "#FF9039",
                          }}
                        >
                          <Typography size="small" style={{ color: "#FFF" }}>
                            {orders?.total || 0}
                          </Typography>
                        </div>
                      </div>
                      <Typography size="large" className="ui-block mt-10 mb-20">
                        <Typography size="large" bold>
                          {orders?.total || 0}
                        </Typography>{" "}
                        {t("listed_orders")}
                      </Typography>
                      <Typography muted>{t("choose_from_top_confirm_kitchen")}</Typography>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {isModalOpen && !isChangedOrderLoading && (
            <Modal
              visible
              onClose={(): void => {
                setIsModalOpen(false);
                queryClient.invalidateQueries(`/${orderId}`);
              }}
              style={{ minWidth: 500 }}
            >
              <Typography h2>{t("order_change_information")}</Typography>
              <Divider vertical={20} />
              <Typography className="ui-flex mb-10">
                <Typography>{t("order")}</Typography>
                <Typography className="ml-5 mr-5" bold>
                  #{changedOrder?.payload?.number}
                </Typography>
                <Typography>{t("of_hub")}</Typography>
                <Typography className="ml-5 mr-5" bold>
                  {changedOrder?.payload?.meta?.hubName}
                </Typography>
                {orderStatus === WebSocketsActionTypes.ORDER_ASSIGNED ? (
                  <Typography>{t("has_new_dispatcher_pick_order_again")}</Typography>
                ) : (
                  <>
                    <Typography>{t("has_new_status")}</Typography>
                    <Typography className="ml-5">({firstLetterUppercase(buildOrderStatus(orderStatus))})</Typography>
                  </>
                )}
              </Typography>
              <Divider />
              <div className="ui-flex v-center end">
                <Button
                  variant="primary"
                  onClick={(): void => {
                    setIsModalOpen(false);
                    queryClient.invalidateQueries(`/${orderId}`);
                  }}
                >
                  {t("ok")}
                </Button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Grid>
  );
};

export { OrdersDashboard };
