/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
import classNames from "classnames";
import React, { HTMLAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import TetherComponent from "react-tether";
import { useForkRef, useOutsideClick } from "../../util";

import "./index.scss";

type PlacementType = "left" | "right" | "center";
interface DropdownBaseProps {
  refElement?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
  onClose?: () => void;
  className?: string;
  placement?: PlacementType;
  renderTrigger: (openDropdown: () => void, triggerRef?: any, open?: boolean) => React.ReactNode;
  matchTriggerWidth?: boolean;
  dropdownComponentClassName?: string;
  offset?: string;
  attachment: string;
  targetAttachment: string;
  dropdownComponent?: React.ElementType<any>;
  dropdownComponentStyle?: React.CSSProperties;
  dropdownComponentProps?: HTMLAttributes<any>;
}

function OutsideClick(props: {
  className?: string;
  onClick: (target: HTMLElement) => void;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useOutsideClick(wrapperRef, props.onClick);

  return (
    <span ref={wrapperRef} className={props.className}>
      {props.children}
    </span>
  );
}

const DropdownBase = React.forwardRef<any, DropdownBaseProps>(
  (
    {
      renderTrigger,
      onOpen,
      onClose,
      children,
      className,
      matchTriggerWidth,
      dropdownComponentClassName,
      offset,
      attachment,
      targetAttachment,
      dropdownComponent,
      dropdownComponentProps,
      dropdownComponentStyle,
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef(null);
    const triggerRef = useForkRef(dropdownRef, ref);
    const DropDownComponent = dropdownComponent || "div";

    const toggleDropdown = () => {
      const open = !isDropdownOpen;
      setIsDropdownOpen(open);
      if (onOpen && open) {
        onOpen(open);
      }
    };
    // usecallback to avoid unnecessary re-renders
    const closeDropdown = useCallback(() => {
      setIsDropdownOpen(false);
      if (onOpen) {
        onOpen(false);
      }
      onClose?.();
    }, [onOpen]);

    useEffect(() => {
      const onEscPress = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
          event.stopPropagation();
          closeDropdown();
        }
      };
      if (isDropdownOpen) {
        document.addEventListener("keydown", onEscPress);
      }
      return (): void => {
        document.removeEventListener("keydown", onEscPress);
      };
    }, [closeDropdown, isDropdownOpen]);

    useImperativeHandle(ref, () => ({ closeDropdown, isDropdownOpen }), [closeDropdown, isDropdownOpen]);

    const clickedOutside = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (dropdownRef?.current?._targetNode?.current?.contains(e)) {
        return;
      }
      if (isDropdownOpen) {
        closeDropdown();
      }
    };

    return (
      <TetherComponent
        ref={triggerRef as any}
        attachment={attachment}
        targetAttachment={targetAttachment}
        // offset={generateOffset(placement)}
        offset={offset}
        className={classNames("ui-dropdown-wrapper", className)}
        constraints={[
          {
            to: "window",
            attachment: "bottom",
            pin: true,
          },
        ]}
        /* renderTarget: This is what the item will be tethered to, make sure to attach the ref */
        renderTarget={(refEl) => {
          if (isDropdownOpen) {
            refEl.current?.classList.add("ui-hover");
          } else {
            refEl.current?.classList.remove("ui-hover");
          }
          return renderTrigger(toggleDropdown, refEl, isDropdownOpen);
        }}
        /* renderElement: If present, this item will be tethered to the the component returned by renderTarget */
        renderElement={(refEl) => {
          return (
            isDropdownOpen && (
              <OutsideClick onClick={clickedOutside}>
                <DropDownComponent
                  ref={refEl as React.RefObject<HTMLDivElement>}
                  style={{
                    width:
                      (matchTriggerWidth && (dropdownRef?.current as any)?._targetNode?.current?.offsetWidth) || "auto",
                    zIndex: 99,
                    ...dropdownComponentStyle,
                  }}
                  className={classNames(
                    "ui-dropdown",
                    `ui-dropdown-placement-${attachment}`,
                    dropdownComponentClassName
                  )}
                  {...dropdownComponentProps}
                >
                  {children}
                </DropDownComponent>
              </OutsideClick>
            )
          );
        }}
      />
    );
  }
);

export { DropdownBase };
