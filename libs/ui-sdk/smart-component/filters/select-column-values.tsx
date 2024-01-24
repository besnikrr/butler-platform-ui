import React, { useEffect, useState } from "react";
import { List, ListItem, Checkbox, Input } from "@butlerhospitality/ui-sdk";
import produce from "immer";
import { FiltersProps, FilterState, FilterValue } from "./types";

interface FiltersSelectColumnValues extends FiltersProps {
  onSelect: (queryParamName: string, item: any) => void;
  filterOnRemove: (queryParamName: string, item: any) => any;
  filterState: FilterState;
}

const FiltersSelectColumnValues: React.FC<FiltersSelectColumnValues> = (
  props
): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<FilterValue[]>();
  const [localData, setLocalData] = useState<FilterValue[]>();
  const column = props.columns.find(
    (col) => col.name === props.filterState.lastFilterSelected
  );
  const selected =
    column &&
    props.filterState.selectedValues[column.queryParamName] &&
    props.filterState.selectedValues[column.queryParamName].map((item) =>
      item.replace(/\|([^&]*)&?/g, "")
    );

  useEffect(() => {
    setIsLoading(true);
    if (column?.data.constructor === Array) {
      setIsLoading(false);
      return setData(column.data);
    }
    if (column?.data && typeof column?.data === "function") {
      const fetchFilterValues = async () => {
        try {
          const executor = column.data as () => Promise<FilterValue[]>;
          const filterValues = await executor();
          setData(filterValues);
        } catch (e) {
        } finally {
          setIsLoading(false);
        }
      };
      fetchFilterValues();
    }
  }, []);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    if (column?.data.constructor === Array) {
      setData(column?.data);
    }
  }, [column?.data]);

  const filterByInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const nextLocalData = produce(localData, (draft) => {
      if (draft && data) {
        return data.filter(
          (filterValue: FilterValue) =>
            filterValue.label.toLowerCase().indexOf(value?.toLowerCase()) > -1
        );
      }
      return [];
    });
    setLocalData(nextLocalData);
  };

  return (
    <>
      <Input
        className="w-100"
        style={{ marginBottom: 10 }}
        placeholder="Filter by..."
        onChange={column?.customFilterOnChange || filterByInputOnChange}
      />
      <List>
        {isLoading && <span>loading...</span>}
        {localData?.map((dataItem: FilterValue) => (
          <ListItem
            key={dataItem.queryParamValue}
            onClick={() => {
              column?.queryParamName
                ? selected?.includes(dataItem.queryParamValue)
                  ? props.filterOnRemove(
                      column.queryParamName,
                      `${dataItem.queryParamValue}|${dataItem.label}`
                    )
                  : props.onSelect(column?.queryParamName, dataItem)
                : null;
            }}
          >
            <Checkbox
              label={dataItem.label}
              defaultChecked={selected?.includes(`${dataItem.queryParamValue}`)}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default FiltersSelectColumnValues;
