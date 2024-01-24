import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import qs from "qs";
import {
  Card,
  Typography,
  ButtonBase,
  Button,
  Icon,
  Link,
  Skeleton,
  IconType,
  Badge,
  Divider,
  Checkbox,
  useTranslation,
  pushNotification,
  Modal,
  FormControl,
  Textarea,
  AppContext,
} from "@butlerhospitality/ui-sdk";
import "./index.scss";
import { AppEnum, Product } from "@butlerhospitality/shared";
import { get as _get } from "lodash";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { useQueryController } from "../../util/hooks/useQueryController";
import { subscribe } from "../../util/pubsub";
import { OrderQueryParams, ORDER_STATUS, Order, WebSocketsActionTypes } from "../../util/constants";
import { setAlphaColor } from "../../util";
import { useFetch } from "../../hooks/use-fetch";
import { usePatch } from "../../hooks/use-patch";
import ConfirmModal from "../confirm-modal";

const TextInfo: React.FC<{
  label: string;
  text: string | React.ReactNode;
  icon?: IconType;
  className?: string;
}> = ({ label, text, icon, className }) => (
  <div className={className}>
    <Typography className="ui-block" size="small" muted>
      {label}
    </Typography>
    <div className="ui-flex v-center">
      {icon && <Icon type={icon} size={20} className="mr-5" />}
      {typeof text === "string" ? <Typography>{text}</Typography> : text}
    </div>
  </div>
);

interface IDefaultParams {
  version: number;
}

interface IConfirm extends IDefaultParams {
  printReceipt: boolean;
}

interface IReject extends IDefaultParams {
  reason: string;
}

interface ICancel extends IDefaultParams {
  reason: string;
}

enum PageModes {
  BROWSE = "browse",
  REJECT = "reject",
  CANCEL = "cancel",
}

const OrderView: React.FC = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const { t } = useTranslation();
  const [filters, setFilters] = useState<OrderQueryParams | null>(null);
  const [order, setOrder] = useState<Order>();
  const queryClient = useQueryClient();
  const [pageMode, setPageMode] = useState<PageModes>(PageModes.BROWSE);
  const [printReceipt, setPrintReceipt] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const { removeField } = useQueryController();

  const patchConfirmMutation = usePatch<Order, IConfirm>({
    path: `/${order?.id}/confirm`,
    cacheKeys: ["/dashboard", "/list-by-hubs"],
  });

  const rejectOrderMutation = usePatch<Order, IReject>({
    path: `/${order?.id}/reject`,
    cacheKeys: ["/dashboard", "/list-by-hubs"],
  });

  const patchAssignToMeMutation = usePatch<Order, IDefaultParams>({
    path: `/${order?.id}/assign-to-me`,
    cacheKeys: [`/${order?.id}`, "/dashboard"],
  });

  const cancelOrderMutation = usePatch<Order, ICancel>({
    path: `/${order?.id}/cancel`,
    cacheKeys: ["/dashboard", "/list-by-hubs"],
  });

  const handleOrderConfirmation = (): void => {
    removeField("order");
    pushNotification(t("order_has_been_confirmed_and_assigned"), {
      type: "info",
    });
  };

  const handleModalClose = (type: PageModes): void => {
    setPageMode(PageModes.BROWSE);
    removeField("order");
    setReason("");
    pushNotification(type === PageModes.CANCEL ? t("order_has_been_cancelled") : t("order_has_been_rejected"), {
      type: "success",
    });
  };

  useEffect(() => {
    if (patchConfirmMutation.isSuccess) {
      handleOrderConfirmation();
    } else if (rejectOrderMutation.isSuccess || cancelOrderMutation.isSuccess) {
      handleModalClose(pageMode);
    }
  }, [patchConfirmMutation.isSuccess, rejectOrderMutation.isSuccess, cancelOrderMutation.isSuccess]);

  const { data: orderData, isLoading: orderIsLoading } = useFetch(AppEnum.ORDER)<Order, OrderQueryParams>(
    {
      path: `/${filters?.order}`,
      query: filters ? { ...filters } : {},
    },
    { enabled: filters?.order !== undefined }
  );

  const confirmOrder = async (): Promise<void> => {
    patchConfirmMutation.mutate({ printReceipt, version: order?.version as number });
  };

  const showAssignToMeButton = useMemo((): boolean => {
    return order?.status === ORDER_STATUS.PENDING && order?.meta?.dispatcher?.id !== user.details?.id;
  }, [order, user]);

  const assignToMe = async (): Promise<void> => {
    patchAssignToMeMutation.mutate({ version: order?.version as number });
    setShowModal(false);
  };

  const rejectOrder = async (): Promise<void> => {
    rejectOrderMutation.mutate({ version: order?.version as number, reason });
  };

  const cancelOrder = async (): Promise<void> => {
    cancelOrderMutation.mutate({ version: order?.version as number, reason });
  };

  useEffect(() => {
    if (!orderIsLoading) {
      setOrder(_get(orderData, "payload"));
    }
  }, [orderData]);

  useEffect(() => {
    const queryParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    setFilters(queryParams);
  }, [window.location.search]);

  useEffect(() => {
    const unsubscribe = subscribe(WebSocketsActionTypes.ORDER_UPDATED, (data: number) => {
      queryClient.invalidateQueries(`/${data}`);
    });
    return unsubscribe;
  }, []);

  const renderModalBody = (): React.ReactNode => {
    return (
      <>
        <Typography h2>{t("confirm_assign")}</Typography>
        <Divider />
        <Typography className="ui-flex mb-10">{t("do_yuo_want_to_assign_order_to_yourself")}</Typography>
        <Divider />
        <div className="ui-flex v-center end">
          <Button className="mr-10" variant="ghost" onClick={() => setShowModal(false)}>
            {t("cancel")}
          </Button>
          <Button
            disabled={false}
            variant="primary"
            onClick={() => {
              assignToMe();
            }}
          >
            {t("assing")}
          </Button>
        </div>
      </>
    );
  };

  if (orderIsLoading) {
    return (
      <Card size="small" className="orders-app-column">
        <Skeleton parts={["cardHeaderAction", "divider", "block-3"]} />
      </Card>
    );
  }

  return (
    <Card size="small" className={classNames("orders-app-column")}>
      <div className="h-100 ui-flex column">
        <div className="ui-flex v-center between">
          <div className="ui-flex v-center">
            <Typography className="ui-block" size="large" bold>
              {t("order")} #{order?.number}
            </Typography>
            <Typography className="ui-block ml-10" muted>
              {order?.products?.length} {t("items")}
            </Typography>
          </div>
          <div className="ui-flex v-center">
            {order?.meta.dispatcher && showAssignToMeButton && (
              <Typography className="ui-block mr-10" size="small" muted>
                {order.meta.dispatcher.name}
              </Typography>
            )}
            {showAssignToMeButton && (
              <Link
                onClick={() => setShowModal(true)}
                disabled={patchAssignToMeMutation.isLoading}
                component={ButtonBase}
                className="text-small"
              >
                {t("assing_to_me")}
              </Link>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", marginRight: -10 }} className="my-10 pr-10 pb-10">
          <Card size="small">
            <Typography className="ui-block" muted>
              {t("hotel_hub_info")}
            </Typography>
            <TextInfo label={t("hotel_name")} text={order?.meta?.hotelName} icon="Bed" className="mt-10" />
            <TextInfo label={t("hub_name")} text={order?.meta?.hubName} icon="Bed" className="mt-10" />
            <TextInfo label={t("room_number")} text={order?.meta?.roomNumber} icon="Bed" className="mt-10" />
          </Card>
          <Card size="small" className="mt-10">
            <div className="ui-flex v-center between mb-10">
              <Typography className="ui-block" muted>
                {t("guest_personal_info")}
              </Typography>
              <Link component={ButtonBase} className="text-small">
                {t("view_more")}
              </Link>
            </div>
            <TextInfo label={t("guest_name")} text={order?.client?.name} icon="Bed" />
            <TextInfo label={t("phone_number")} text={order?.client?.phoneNumber} icon="Bed" className="mt-10" />
          </Card>
          <Card size="small" className="mt-10">
            <Typography className="ui-block mb-10" muted>
              {t("payment")}
            </Typography>
            <TextInfo
              label={t("payment_type")}
              text={
                <Badge className="mt-5" leftIcon="CreditCard" iconSize={14} size="small">
                  {order?.paymentType}
                </Badge>
              }
              className="mt-10"
            />
          </Card>
          <Card size="small" className="mt-10">
            <Typography className="ui-block" muted>
              {t("order_info")}
            </Typography>
            <TextInfo label={t("order_type")} text={order?.type} icon="Bed" className="mt-10" />
            <TextInfo label={t("delivery_date")} text="14:00h" icon="Bed" className="mt-10" />
            <TextInfo label={t("delivery_time")} text="13:00h" icon="Bed" className="mt-10" />
            <TextInfo
              label={t("order_time")}
              text={
                <Badge
                  className="mt-5"
                  iconColor="#FF9039"
                  backgroundColor={setAlphaColor("#FF9039", 0.2)}
                  leftIcon="CreditCard"
                  iconSize={14}
                  size="small"
                >
                  15min
                </Badge>
              }
              className="mt-10"
            />
          </Card>
          <Card size="small" className="mt-10">
            <Typography className="ui-block" muted>
              {t("order_info")}
            </Typography>
            <div className="order-view-info-prices mt-10">
              {order?.products?.map((product: Product) => {
                return (
                  <div className="ui-flex v-center between w-100" key={product.id}>
                    <Typography className="ui-block">
                      {product?.quantity}x {product?.name}
                    </Typography>
                    <div>
                      {product?.originalPrice !== product?.price && (
                        <Typography className="ui-span ui-typography-muted mt-10 pr-5 ui-text-line">
                          ${product?.originalPrice.toFixed(2)}
                        </Typography>
                      )}
                      <Typography>${product?.price.toFixed(2)}</Typography>
                    </div>
                  </div>
                );
              })}
            </div>
            <Divider vertical={10} />
            <div className="order-view-info-prices mt-10">
              <div className="ui-flex v-center between w-100">
                <Typography className="ui-block">{t("subtotal")}</Typography>
                <Typography className="ui-block">${order?.totalNet?.toFixed(2)}</Typography>
              </div>
              <div className="ui-flex v-center between w-100">
                <Typography className="ui-block">{t("tax")}</Typography>
                <Typography className="ui-block">${order?.tax?.toFixed(2)}</Typography>
              </div>
              <div className="ui-flex v-center between w-100">
                <Typography className="ui-block" bold>
                  {t("total")}
                </Typography>
                <Typography className="ui-block" bold>
                  ${order?.grandTotal.toFixed(2)}
                </Typography>
              </div>
            </div>
          </Card>
        </div>
        <div className="ui-flex between v-center">
          <div className="ui-flex v-center">
            <Button
              onClick={(): void => setPageMode(PageModes.REJECT)}
              disabled={order?.status !== ORDER_STATUS.PENDING || rejectOrderMutation.isLoading}
              className="mr-10"
            >
              {t("reject")}
            </Button>
            {[ORDER_STATUS.PREPARATION, ORDER_STATUS.IN_DELIVERY, ORDER_STATUS.CONFIRMATION].includes(
              order?.status as ORDER_STATUS
            ) && (
              <Button
                variant="ghost"
                onClick={(): void => setPageMode(PageModes.CANCEL)}
                disabled={cancelOrderMutation.isLoading}
                className="text-danger"
              >
                {t("cancel_order")}
              </Button>
            )}
          </div>
          <div className="ui-flex v-center">
            {order?.status === ORDER_STATUS.PENDING && (
              <Checkbox
                label={t("print_receipt")}
                checked={printReceipt}
                disabled={patchConfirmMutation.isLoading}
                onChange={(): void => setPrintReceipt(!printReceipt)}
              />
            )}
            <Button variant="ghost" className="mr-10" onClick={(): void => history.push(`/orders/${order?.id}/edit`)}>
              {t("edit_order")}
            </Button>
            <Button
              onClick={confirmOrder}
              disabled={order?.status !== ORDER_STATUS.PENDING || patchConfirmMutation.isLoading}
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        visible={pageMode === PageModes.REJECT || pageMode === PageModes.CANCEL}
        onClose={(): void => setPageMode(PageModes.BROWSE)}
        style={{ minWidth: 500 }}
      >
        <Typography h2>{t("note_with_reason")}</Typography>
        <Divider vertical={20} />
        <form>
          <FormControl vertical>
            <Textarea autoComplete="off" autoFocus onChange={(event) => setReason(event.target.value.trim())} />
          </FormControl>
          <div className="w-100 ui-flex end mt-30">
            <Button
              variant="ghost"
              onClick={(): void => {
                setPageMode(PageModes.BROWSE);
                setReason("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              className="ml-10"
              variant="primary"
              disabled={!reason || rejectOrderMutation.isLoading || cancelOrderMutation.isLoading}
              onClick={pageMode === PageModes.CANCEL ? cancelOrder : rejectOrder}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Modal>
      {showModal && <ConfirmModal onClose={() => setShowModal(false)}>{renderModalBody()}</ConfirmModal>}
    </Card>
  );
};

export { OrderView };
