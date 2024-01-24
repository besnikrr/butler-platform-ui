import React, { useEffect, useState } from "react";
import { List, ListItem } from "@butlerhospitality/ui-sdk";
import { FilterColumnConfig, FiltersProps } from "./types";

interface FiltersSelectColumns extends FiltersProps {
  onSelect: (column: FilterColumnConfig) => void;
}

const FiltersSelectColumns: React.FC<FiltersSelectColumns> = (
  props
): JSX.Element => {
  const [localData, setLocalData] = useState<FilterColumnConfig[]>();
  useEffect(() => {
    setLocalData(props.columns);
  }, [props.columns]);

  return (
    <List>
      {localData?.map((column) => (
        <ListItem
          key={column.name}
          onClick={() => {
            props.onSelect(column);
          }}
        >
          {column.name}
        </ListItem>
      ))}
    </List>
  );
};

export default FiltersSelectColumns;
