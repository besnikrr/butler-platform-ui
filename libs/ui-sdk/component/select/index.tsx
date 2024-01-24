import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { List, ListItem } from "../list";
import { DropdownBase } from "../../primitive/dropdown";
import { Card } from "../card";
import { Tooltip } from "../tooltip";
import { Chip } from "../chip";
import { Icon } from "../icon";
import { useForkRef } from "../../util";

import "./index.scss";
import { InputSearch } from "../input-search";

interface OptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value?: number | string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
}

const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return <ListItem {...props}>{children}</ListItem>;
};

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  selectProps?: React.HTMLAttributes<HTMLSelectElement>;
  value?: number | string;
  name?: string;
  filter?: string;
  error?: string;
  multiple?: boolean;
  placeholder?: string;
  onSearch?: (search: string) => void;
  infiniteScroll?: boolean;
  onReachEnd?: () => void;
  dropdownClassName?: string;
  dropdownProps?: any;
}

const Select: React.FC<SelectProps> = ({
  disabled,
  children,
  selectProps,
  value,
  filter,
  name,
  error,
  multiple,
  placeholder,
  onSearch,
  onReachEnd,
  infiniteScroll,
  dropdownClassName,
  dropdownProps,
  ...props
}) => {
  const [vals, setVals]: any = useState([]);
  const [val, setVal] = useState("");
  // useForkRef
  const dropRef = useRef<any>(null);
  const rawSelectRef = useRef<HTMLSelectElement>(null);
  // @ts-ignore
  const selectRef = useForkRef<HTMLSelectElement>(
    // @ts-ignore
    selectProps?.ref as any,
    rawSelectRef
  );

  useEffect(() => {
    if (!rawSelectRef.current || !value) return;
    rawSelectRef.current.value = value as any;
    rawSelectRef.current?.dispatchEvent(new Event("change"));
  }, [value]);

  const handleOptionClick = (e: any) => {
    if (!rawSelectRef.current) return;
    if (multiple) {
      const selectedOption = e.target.innerHTML;
      for (let i = 0; i < rawSelectRef.current?.options.length; i += 1) {
        const option = rawSelectRef.current.options[i];
        if (option.innerHTML === selectedOption) {
          option.selected = !option.selected;
        }
      }
    } else {
      rawSelectRef.current.selectedIndex = e.target.value;
    }
    rawSelectRef.current.dispatchEvent(new Event("change"));
    dropRef.current.closeDropdown();
  };

  useEffect(() => {
    if (!rawSelectRef.current) return;
    const handleChange = (e: any) => {
      if (multiple) {
        const newVals = [];
        for (let i = 0; i < e.target.options.length; i += 1) {
          const option = e.target.options[i];
          if (option.selected) {
            newVals.push(option.value);
          }
        }
        // eslint-disable-next-line no-param-reassign
        e.target.defaultValue = newVals;
        selectProps?.onChange?.(e);
        setVals(newVals);
      } else {
        setVal(e.target.options[e.target.selectedIndex].text);
        selectProps?.onChange?.(e);
      }
    };

    const checkSelected = () => {
      if (multiple) {
        const newVals = [];
        // @ts-ignore
        for (let i = 0; i < rawSelectRef?.current?.options?.length; i += 1) {
          const option = rawSelectRef?.current?.options[i];
          if (option?.selected) {
            newVals.push(option.value);
          }
        }
        setVals(newVals);
      } else {
        if (!rawSelectRef.current) return;
        let selectedIndex = rawSelectRef.current.options.selectedIndex || 0;
        if (selectedIndex < 0) selectedIndex = 0;
        setVal(rawSelectRef?.current?.options[selectedIndex]?.text);
      }
    };
    checkSelected();
    rawSelectRef.current.addEventListener("change", handleChange);
    // eslint-disable-next-line
    return () => {
      if (!rawSelectRef.current) return;
      rawSelectRef.current.removeEventListener("change", handleChange);
    };
  }, [rawSelectRef, selectProps]);

  const removeMultipleOption = (categoryToRemove: any, index: any) => {
    if (rawSelectRef) {
      const refOption = rawSelectRef?.current?.options[index];
      if (refOption) {
        refOption.selected = false;
        rawSelectRef?.current?.dispatchEvent(new Event("change"));
      }
    }
  };

  return (
    <>
      <select
        {...selectProps}
        multiple={multiple}
        ref={selectRef}
        defaultValue={
          // eslint-disable-next-line
          multiple
            ? undefined
            : !["undefined", "null"].includes(typeof value)
            ? value
            : selectProps?.defaultValue
        }
        className="selectselect"
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<OptionProps>(child)) return null;
          return React.createElement("option", {
            ...child.props,
            key: index,
            onClick: handleOptionClick,
          });
        })}
      </select>
      <DropdownBase
        ref={dropRef as any}
        attachment="top center"
        targetAttachment="bottom center"
        offset="1px -0.5px"
        dropdownComponent={Card}
        dropdownComponentProps={
          infiniteScroll
            ? {
                onScroll: (e: any) => {
                  // check if we are at the bottom of the list
                  if (
                    e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
                    e.currentTarget.clientHeight
                  ) {
                    onReachEnd?.();
                  }
                },
              }
            : {}
        }
        dropdownComponentStyle={{
          maxHeight: 170,
          overflowY: "auto",
          borderRadius: 0,
        }}
        renderTrigger={(openDropdown, triggerRef, open) => (
          // eslint-disable-next-line
          <div
            {...props}
            className={classNames(
              "ui-select-trigger",
              {
                "ui-select-trigger-multiple": multiple,
                "ui-select-open": open,
                "ui-disabled": disabled,
                "ui-select-error": !!error,
              },
              props.className
            )}
            onClick={!disabled ? openDropdown : undefined}
            ref={triggerRef}
          >
            {/* eslint-disable-next-line */}
            {multiple ? (
              rawSelectRef?.current?.selectedIndex !== -1 ? (
                <div className="ui-select-multi-wrapper">
                  {React.Children.map(children, (child, index) => {
                    const option = rawSelectRef?.current?.options[index];
                    if (!React.isValidElement<OptionProps>(child)) return null;
                    return option?.selected ? (
                      <Chip
                        size="medium"
                        onClose={(e: any) => {
                          e.stopPropagation();
                          removeMultipleOption(child.props?.children, index);
                          return false;
                        }}
                      >
                        {child.props?.children}
                      </Chip>
                    ) : null;
                  })}
                </div>
              ) : (
                <span className="ui-placeholder">{placeholder}</span>
              )
            ) : val &&
              !(
                rawSelectRef.current &&
                rawSelectRef.current.options[
                  rawSelectRef.current.selectedIndex
                ] &&
                rawSelectRef.current.options[rawSelectRef.current.selectedIndex]
                  .disabled
              ) ? (
              <span className="">{val}</span>
            ) : (
              <span className="ui-placeholder">{val}</span>
            )}
            <div className="ui-select-suffix">
              <Icon type="ArrowDown" size={12} />
              {!!error && (
                <Tooltip offset={[0, 25]} content={error} placement="right">
                  <Icon type="Infoi" size={18} />
                </Tooltip>
              )}
            </div>
          </div>
        )}
        className={classNames("ui-select", dropdownClassName)}
        matchTriggerWidth
        {...dropdownProps}
      >
        {!!onSearch && (
          <InputSearch
            size="small"
            placeholder="Search..."
            className="w-100 my-5"
            value={filter}
            onChange={(e: any) => {
              onSearch(e.target.value);
            }}
          />
        )}
        <List>
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement<OptionProps>(child)) return null;
            return React.cloneElement(child, {
              key: index,
              value: index,
              selected: multiple
                ? vals.includes(child.props.value)
                : child.props.children === val,
              onClick: handleOptionClick,
            });
          })}
        </List>
      </DropdownBase>
    </>
  );
};

export { Select, Option, SelectProps, OptionProps };
