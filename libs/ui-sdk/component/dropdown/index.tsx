import React from "react";
import classNames from "classnames";
import { Card } from "../card";
import { DropdownBase } from "../../primitive/dropdown";
import "./index.scss";

type PlacementType = "left" | "right" | "center";
interface DropdownProps {
  className?: string;
  disabled?: boolean;
  hasArrow?: boolean;
  placement?: PlacementType;
  onClose?: () => void;
  renderTrigger: (
    openDropdown: () => void,
    triggerRef?: any,
    open?: boolean
  ) => React.ReactNode;
  ref?: any;
}

function generateOffset(placement: PlacementType) {
  switch (placement) {
    case "left":
      return "-15px 15px";
    case "right":
      return "-15px -10px";
    case "center":
      return "-15px 0";
    default:
      return "0 0";
  }
}

const Dropdown: React.FC<DropdownProps> = React.forwardRef(
  (
    {
      renderTrigger,
      children,
      className,
      placement = "left",
      hasArrow,
      onClose,
    },
    ref
  ) => {
    return (
      <DropdownBase
        ref={ref}
        attachment={`top ${placement}`}
        targetAttachment={`bottom ${placement}`}
        offset={generateOffset(placement)}
        className={classNames("ui-dropdown-wrapper", className)}
        renderTrigger={(...props) => renderTrigger(...props)}
        dropdownComponentStyle={{
          boxShadow: "0px 2px 3px var(--shadow-color, rgba(0,0,0,0.07)",
          borderRadius: 10,
          zIndex: 99,
        }}
        dropdownComponentClassName={classNames(
          { [`ui-arrow-${placement}`]: hasArrow },
          className
        )}
        dropdownComponent={Card}
        dropdownComponentProps={{
          // @ts-ignore
          size: "small",
        }}
        onClose={onClose}
      >
        {children}
      </DropdownBase>
    );
  }
);

export { Dropdown };
