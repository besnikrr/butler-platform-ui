import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import qs from "qs";
import { Badge, ButtonBase, Card, Icon, IconType, Typography, useTranslation } from "@butlerhospitality/ui-sdk";
import { setAlphaColor } from "../../util";
import { orderTypeColor, Order, ORDER_TYPE } from "../../util/constants";

import "./index.scss";

interface OrderCardProps {
  order: Order;
}

const orderPaymentType = {
  CHARGE_TO_ROOM: {
    label: "charge_to_room",
    icon: "CreditCard" as IconType,
  },
  CREDIT_CARD: {
    label: "credit_card",
    icon: "Doors" as IconType,
  },
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const orderActive = useMemo(() => {
    const queryParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    return `${order.id}` === queryParams.order;
  }, [order, window.location.search]);

  const handleClick = () => {
    const queryParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    queryParams.order = `${order.id}`;
    history.push(`?${qs.stringify(queryParams)}`);
  };

  return (
    <ButtonBase onClick={handleClick} className={classNames("order-card mt-10", { active: orderActive })}>
      <Card size="xsmall" className="wh-100">
        <div className="order-card-header ui-flex v-center between">
          <div className="order-card-text ui-flex v-center">
            <Typography bold>#{order.number}</Typography>
            <Typography className="mx-5" bold muted>
              -
            </Typography>
            <Typography className="order-card-title" bold>
              {order.client.name}
            </Typography>
          </div>
          <div className="ui-flex v-center ml-10">
            <Badge
              className=""
              color={order.meta.hubColor}
              backgroundColor={setAlphaColor(order.meta.hubColor, 0.1)}
              size="small"
            >
              <Icon className="mr-5" type="Store01" size={12} />
              {order.meta.hubName}
            </Badge>
            <Badge
              className="ml-5"
              size="small"
              color="#FFFFFF"
              backgroundColor={orderTypeColor[order.type as ORDER_TYPE]}
            >
              {order.type.charAt(0)}
            </Badge>
          </div>
        </div>
        <div className="order-card-body ui-flex column center between">
          <div className="ui-flex v-start mb-10">
            <div className="ui-flex">
              <Icon className="mr-5" type="Bed" size={20} />
            </div>
            <Typography className="ui-block">{order.meta.hotelName}</Typography>
          </div>
          <Typography className="ui-flex v-center" muted>
            <div className="ui-flex v-center">
              <Icon className="mr-5" type="Bike" size={20} />
            </div>
            {order?.meta?.foodCarrier ? order.meta.foodCarrier.name : "N/A"}
          </Typography>
        </div>
        <div className="order-card-footer ui-flex v-center between">
          <div className="order-card-footer-options ui-flex v-center">
            <Badge
              size="small"
              iconColor="#FF9039"
              backgroundColor={setAlphaColor("#FF9039", 0.2)}
              leftIcon="Clock"
              iconSize={12}
            >
              15min
            </Badge>
            <Badge size="small" leftIcon={orderPaymentType[order.paymentType].icon} iconSize={12}>
              {t(orderPaymentType[order.paymentType].label)}
            </Badge>
            <Badge size="small" backgroundColor={setAlphaColor("#79CD6B", 0.2)}>
              ${order.grandTotal}
            </Badge>
          </div>
          {order?.meta?.dispatcher ? (
            <div className="ui-flex v-center">
              <Icon type="Headset" size={16} className="mr-5 ui-muted" />
              <Typography size="small" muted>
                {order.meta.dispatcher.name
                  .split(" ")[0]
                  .concat(` ${order.meta.dispatcher.name.split(" ")[1].charAt(0).toUpperCase()}.`)}
              </Typography>
            </div>
          ) : (
            <Typography size="small" muted>
              {t("not_assigned")}
            </Typography>
          )}
        </div>
      </Card>
    </ButtonBase>
  );
};

export { OrderCard };
