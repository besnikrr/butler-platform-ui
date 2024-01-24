/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from "react";
import classNames from "classnames";
import { Card, Typography, useTranslation } from "@butlerhospitality/ui-sdk";

import "./index.scss";

interface DrawerProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ open, onClose, ...props }) => {
  const { t } = useTranslation();
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("keydown", close);
    }
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <>
      {open && <div role="none" className="order-drawer-backdrop" onClick={onClose} />}
      <Card
        className={classNames("order-drawer", { "order-drawer-open": open })}
        header={<Typography h2>{t("select_hubs")}</Typography>}
      >
        <div className="order-drawer-content">{props.children}</div>
      </Card>
    </>
  );
};

export { Drawer };
