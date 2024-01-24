import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  ListItem,
  DropdownBase,
  Chip,
  Icon,
  Tooltip,
  InputSearch,
  List,
  Card,
  useDebounce,
  Typography,
} from "@butlerhospitality/ui-sdk";
import { HTTPResourceResponse } from "@butlerhospitality/shared";

interface OptionProps {
  value?: number | string;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
  tabIndex?: number;
}

const Option: React.FC<OptionProps> = ({ children, ...props }) => {
  return <ListItem {...props}>{children}</ListItem>;
};

interface OnQueryParams {
  page: number;
  pageSize: number;
  filter?: string;
}

interface AsyncSelectProps {
  disabled?: boolean;
  value?: any;
  name?: string;
  error?: string;
  multiple?: boolean;
  placeholder?: string;
  onSearch?: (search: string) => void;
  onReachEnd?: () => void;
  dropdownClassName?: string;
  dropdownProps?: any;
  pageSize?: number;
  labelKey: string;
  valueKey: string;
  className?: string;
  onChange: (item: any) => void;
  onQuery: (params: OnQueryParams, callback: any) => any;
  data?: any[];
  total?: number;
  renderLabel?: (item: any) => string;
  loading?: boolean;
}

const AsyncSelect: React.FC<AsyncSelectProps> = ({
  pageSize = 10,
  disabled,
  value,
  error,
  multiple,
  placeholder,
  onQuery: propsLoadOptions,
  dropdownClassName,
  dropdownProps,
  labelKey,
  valueKey,
  onChange,
  className,
  data: propsData,
  total,
  renderLabel,
  loading: propsLoading,
}) => {
  const [filter, setFilter] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<any[]>(value);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<any[]>(propsData || []);
  const [loading, setLoading] = useState<boolean>(propsLoading || false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(!propsData);
  const [isLastPage, setIsLastPage] = useState<boolean>(total ? data.length >= total : false);
  const dropRef = useRef<any>(null);
  const debouncedValue = useDebounce<string>(filter);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loadOptions = useCallback(
    (
      { page: p, pageSize: pSize, filter: f }: any,
      callback: (options?: any) => void
      // eslint-disable-next-line consistent-return
    ) => {
      if (!propsLoadOptions) return callback();
      const loader: any = propsLoadOptions({ page: p, pageSize: pSize, filter: f }, callback);
      if (loader && typeof loader.then === "function") {
        loader.then(callback, () => callback());
      }
    },
    [propsLoadOptions]
  );

  const queryNextPage = (p: number, pSize: number, f: string, isSearch = false) => {
    setLoading(true);
    loadOptions({ page: p, pageSize: pSize, filter: f }, (options: HTTPResourceResponse<any[]>) => {
      if (isSearch) {
        setIsLastPage((options.payload || []).length >= (options.total || 0));
        setData(options.payload || []);
      } else {
        const dd = [...(data || []), ...(options.payload || [])];
        // remove duplicates
        const uniqueData = dd.filter((item, index) => !(dd.find((i) => i[valueKey] === item[valueKey]) === index));
        if (uniqueData.length >= (options.total || 0)) {
          setIsLastPage(true);
        }
        setData(uniqueData);
      }
      setLoading(false);
    });
    setPage(p);
  };

  useEffect(() => {
    if (shouldFetch) {
      queryNextPage(1, pageSize, filter, true);
    }
    if (!shouldFetch) {
      setShouldFetch(true);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (multiple) {
      setSelectedValues((value as any[]) || []);
    } else {
      setSelectedValues([value] || []);
    }
  }, [value]);

  useEffect(() => {
    setLoading(!!propsLoading);
  }, [propsLoading]);

  useEffect(() => {
    if (propsData) {
      setData(propsData);
      if (propsData.length >= (total || 0)) {
        setIsLastPage(true);
      }
    }
  }, [propsData, total]);

  const handleOptionClick = (item: any) => {
    const uniqueValues = [...selectedValues];
    if (multiple) {
      const found = selectedValues.find((selectedValue) => selectedValue.id === item.id);
      if (found) {
        uniqueValues.splice(uniqueValues.indexOf(found), 1);
        setSelectedValues(uniqueValues);
      } else {
        uniqueValues.push(item);
        setSelectedValues(uniqueValues);
      }
    }
    onChange(multiple ? uniqueValues : item);
    setFilter("");
    dropRef.current.closeDropdown();
  };

  const removeMultipleOption = (v: string | number) => {
    const valuesArray = [...selectedValues];
    valuesArray.splice(selectedValues.indexOf(v), 1);
    setSelectedValues(valuesArray);
    onChange(multiple ? valuesArray : undefined);
  };

  const renderValue = React.useMemo(() => {
    if (multiple) {
      if (!selectedValues.length) return <span className="ui-placeholder">{placeholder}</span>;
      return (
        <div className="ui-select-multi-wrapper">
          {value &&
            selectedValues.map((selectedValue: any) => {
              // const item = data.find((d: any) => d[valueKey] === selectedValue);
              return (
                <Chip
                  key={selectedValue[valueKey]}
                  size="medium"
                  onClose={(e) => {
                    e.stopPropagation();
                    removeMultipleOption(selectedValue);
                  }}
                >
                  {renderLabel ? renderLabel(selectedValue) : selectedValue[labelKey]}
                </Chip>
              );
            })}
        </div>
      );
    }
    if (value) {
      return <span>{renderLabel ? renderLabel(value) : value[labelKey]}</span>;
    }
    return <span className="ui-placeholder">{placeholder}</span>;
  }, [selectedValues, multiple, data, valueKey, labelKey]);

  const renderOptions = React.useMemo(() => {
    const items = data.map((item: any) => {
      const selected = multiple
        ? selectedValues.find((v) => v[valueKey] === item[valueKey])
        : item[valueKey] === value?.[valueKey];
      return (
        <Option
          tabIndex={0}
          key={item[valueKey]}
          value={item}
          selected={!!selected}
          onClick={() => handleOptionClick(item)}
        >
          {renderLabel ? renderLabel(item) : item[labelKey]}
        </Option>
      );
    });
    return items;
  }, [selectedValues, data, valueKey, labelKey]);

  return (
    <DropdownBase
      ref={dropRef as any}
      attachment="top center"
      targetAttachment="bottom center"
      offset="1px -0.5px"
      dropdownComponent={Card}
      dropdownComponentProps={{
        onScroll: (e: any) => {
          // check if we are at the bottom of the list
          if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight) {
            if (!isLastPage && !loading) {
              queryNextPage(page + 1, pageSize, filter);
            }
          }
        },
      }}
      dropdownComponentStyle={{
        maxHeight: 170,
        overflowY: "auto",
        borderRadius: 0,
      }}
      onOpen={() => {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 0);
      }}
      renderTrigger={(openDropdown, triggerRef, open) => (
        // eslint-disable-next-line
        <div
          className={classNames(
            "ui-select-trigger",
            {
              "ui-select-trigger-multiple": multiple,
              "ui-select-open": open,
              "ui-disabled": disabled,
              "ui-select-error": !!error,
            },
            className
          )}
          onClick={!disabled ? openDropdown : undefined}
          ref={triggerRef}
        >
          {renderValue}
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
      <InputSearch
        size="small"
        placeholder="Search..."
        className="w-100 my-5"
        value={filter}
        ref={searchInputRef}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      />
      <List>{renderOptions}</List>
      {loading && (
        <Typography p muted className="ui-flex center py-10">
          Loading...
        </Typography>
      )}
      {data.length === 0 && !loading && (
        <Typography p muted className="ui-flex center py-10">
          No data found
        </Typography>
      )}
    </DropdownBase>
  );
};

export { AsyncSelect, AsyncSelectProps, OnQueryParams };
