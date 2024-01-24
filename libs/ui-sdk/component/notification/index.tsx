import React from "react";
import toaster, { Toaster } from "react-hot-toast";
import { Card, Icon, Typography } from "@butlerhospitality/ui-sdk";

import "./index.scss";
import { ToastPosition } from "react-hot-toast/dist/core/types";

interface NotificationProps {
  className?: string;
}

const Notification: React.FC<NotificationProps> = () => {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{
        right: 20,
        top: 80,
        bottom: 20,
        left: 20,
      }}
      containerClassName="ui-notification"
    />
  );
};

interface PushNotificationOptionsProps {
  type: "success" | "error" | "warning" | "info";
  content?: React.ReactNode;
  position?: ToastPosition;
}

const getIcon = (type?: PushNotificationOptionsProps["type"]) => {
  switch (type) {
    case "success":
      return <Icon type="Checkmark" size={18} />;
    case "error":
      return <Icon type="XInCircle" size={18} />;
    case "warning":
      return <Icon type="WarningTriangle" size={18} />;
    default:
      return null;
  }
};

const pushNotification = (content: React.ReactNode, options?: PushNotificationOptionsProps) => {
  toaster.custom(
    <Card
      size="small"
      className={`ui-notification-content ui-notification-${options?.type || "info"}`}
      data-testid="ui-notification"
    >
      <div className="ui-flex v-center">
        <div className="ui-flex">{getIcon(options?.type)}</div>
        <div className="ml-5 ui-notification-content-text">
          {options?.content || <Typography size="small">{content}</Typography>}
        </div>
      </div>
    </Card>,
    { position: options?.position }
  );
};

export { Notification, pushNotification };
