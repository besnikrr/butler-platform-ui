import classNames from "classnames";
import React from "react";
import { Icon, IconType } from "../icon";
import { Chip, ChipProps } from "../chip";

import "./index.scss";

interface BadgeProps extends ChipProps {
  leftIcon?: IconType;
  rightIcon?: IconType;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  iconColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  leftIcon,
  rightIcon,
  iconSize,
  className,
  color,
  backgroundColor,
  iconColor,
  ...props
}) => {
  return (
    <Chip
      {...props}
      className={classNames("ui-badge", className)}
      style={{ color, backgroundColor }}
    >
      {leftIcon && (
        <Icon
          style={{ color: iconColor }}
          type={leftIcon}
          size={iconSize}
          className="mr-5"
        />
      )}
      {props.children}
      {rightIcon && (
        <Icon
          style={{ color: iconColor }}
          type={rightIcon}
          size={iconSize}
          className="ml-5"
        />
      )}
    </Chip>
  );
};

export { Badge };
