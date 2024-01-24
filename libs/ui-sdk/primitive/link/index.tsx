import React from "react";
import classNames from "classnames";
import { ComponentSizeProp, SimpleSpread } from "../../util";
import { ButtonBase } from "../button";

import "./index.scss";

interface Props {
  size?: ComponentSizeProp;
  disabled?: boolean;
  muted?: boolean;
  variant?: "primary" | "primary-light" | "secondary" | "danger" | "ghost";
  component?: React.ElementType;
}

type LinkProps = SimpleSpread<any, Props>;

const Link: React.FC<LinkProps> = function ({
  size = "xlarge",
  children,
  muted,
  component = "a",
  ...props
}) {
  const renderComponent =
    component && (component === "button" ? ButtonBase : component);
  return React.createElement(
    renderComponent,
    {
      ...props,
      className: classNames(
        "ui-link",
        {
          "ui-disabled": props.disabled,
          "ui-muted": muted,
          [`ui-link-${size}`]: size,
          [`ui-link-${props.variant}`]: props.variant,
        },
        props.className
      ),
    },
    children
  );
};

export { Link };
