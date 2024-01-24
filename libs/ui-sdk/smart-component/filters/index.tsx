import React, { useEffect, useState } from "react";
import produce from "immer";
import _ from "lodash";
import qs from "qs";
import { Dropdown } from "../../component/dropdown";
import { Button } from "../../component/button";
import { Chip } from "../../component/chip";
import { Icon } from "../../component/icon";

import {
  FILTER_STEP,
  FilterColumnConfig,
  FiltersProps,
  FilterState,
} from "./types";

import FiltersSelectColumns from "./select-columns";
import FiltersSelectColumnValues from "./select-column-values";
import "./index.scss";

const initState = {
  selectedColumns: {},
  lastFilterSelected: "",
  selectedValues: {},
};

const Filters: React.FC<FiltersProps> = (props): JSX.Element => {
  const [filterState, setFilterState] = useState<FilterState>(initState);
  const [filterStep, setFilterStep] = useState(FILTER_STEP.NONE);
  const dropdownRef = React.useRef<any>(null);

  const filtersSelectColumnsOnSelect = (column: FilterColumnConfig) => {
    const nextFilterState = produce(filterState, (draft) => {
      if (draft) {
        draft.selectedColumns[column.name] = column;
        draft.lastFilterSelected = column.name;
      }
    });
    setFilterState(nextFilterState);
    setFilterStep(FILTER_STEP.SELECT_COLUMN_VALUES);
  };

  const filtersSelectColumnValuesOnSelect = (
    queryParamName: string,
    item: any
  ) => {
    const selectedValues = {
      ...filterState.selectedValues,
      [queryParamName]: _.union(filterState?.selectedValues[queryParamName], [
        `${item.queryParamValue}|${item.label}`,
      ]),
    };

    const queryString = qs.stringify(selectedValues);
    dropdownRef.current.closeDropdown();
    props.onChange(queryString);
  };

  const filterOnRemove = (queryParamName: string, value: string): void => {
    const selectedValues = {
      ...filterState.selectedValues,
      [queryParamName]: filterState?.selectedValues[queryParamName].filter(
        (param) => param !== value
      ),
    };
    const queryString = qs.stringify(selectedValues);
    props.onChange(queryString);
  };

  useEffect(() => {
    const filtersString = props.filtersString.replace("?", "");
    const parsedFilters = qs.parse(filtersString);
    const nextFilterState = produce(filterState, (draft) => {
      if (draft) {
        draft.selectedValues = parsedFilters as any;
      }
    });
    setFilterState(nextFilterState);
    setFilterStep(FILTER_STEP.NONE);
    dropdownRef.current.closeDropdown();
  }, [props.filtersString]);

  return (
    <>
      <div className="ui-filter-wrapper">
        {Object.keys(filterState.selectedValues)
          .filter((key) => key !== "search")
          .map((key) =>
            filterState.selectedValues[key].map((filterValue) => (
              <Chip onClose={() => filterOnRemove(key, filterValue)}>
                {filterValue.split("|")[1]}
              </Chip>
            ))
          )}
      </div>
      <Dropdown
        // @ts-ignore
        ref={dropdownRef}
        onClose={props.onClose}
        renderTrigger={(openDropdown, triggerRef) => {
          return Object.keys(filterState.selectedValues).length === 0 ? (
            <Button
              variant="ghost"
              ref={triggerRef}
              onClick={() => {
                openDropdown();
                setFilterStep(FILTER_STEP.SELECT_COLUMNS);
              }}
              leftIcon={<Icon type="FiltersHorizontal" size={20} />}
            >
              Filter
            </Button>
          ) : (
            <Button
              className="mx-5"
              size="small"
              variant="ghost"
              ref={triggerRef}
              onClick={() => {
                openDropdown();
                setFilterStep(FILTER_STEP.SELECT_COLUMNS);
              }}
            >
              <Icon type="Plus" size={20} />
            </Button>
          );
        }}
        hasArrow
        placement={
          Object.keys(filterState.selectedValues).length === 0
            ? "left"
            : "center"
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 160,
          }}
        >
          {filterStep === FILTER_STEP.SELECT_COLUMNS && (
            <FiltersSelectColumns
              onSelect={filtersSelectColumnsOnSelect}
              {...props}
            />
          )}
          {filterStep === FILTER_STEP.SELECT_COLUMN_VALUES && (
            <FiltersSelectColumnValues
              onSelect={filtersSelectColumnValuesOnSelect}
              filterOnRemove={filterOnRemove}
              {...props}
              filterState={filterState}
            />
          )}
        </div>
      </Dropdown>
    </>
  );
};

export { Filters };
