import { ButtonBase, ButtonBaseProps } from "@butlerhospitality/ui-sdk";
import classNames from "classnames";
import React from "react";

import "./index.scss";

interface TabButtonProps extends ButtonBaseProps {
  className?: string;
  active?: string | null;
  id: string;
  outline?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  id,
  className,
  outline,
  ...props
}) => {
  return (
    <ButtonBase
      {...props}
      id={id}
      className={classNames(
        "ui-tab-button",
        { active: active === id, outline, "ui-disabled": props.disabled },
        className
      )}
    >
      {props.children}
    </ButtonBase>
  );
};

export { TabButton };
