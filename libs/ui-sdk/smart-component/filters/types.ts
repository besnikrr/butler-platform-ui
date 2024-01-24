export enum FILTER_STEP {
  NONE,
  SELECT_COLUMNS,
  SELECT_COLUMN_VALUES,
}

export interface FilterValue {
  label: string;
  queryParamValue: string;
}

export interface FilterColumnConfig {
  name: string;
  queryParamName: string;
  data: FilterValue[] | (() => Promise<FilterValue[]>);
  customFilterOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FiltersProps {
  columns: FilterColumnConfig[];
  onChange: (queryString: string) => void;
  filtersString: string;
  onClose?: () => void;
}

export interface FilterState {
  selectedColumns: any;
  selectedValues: { [key: string]: string[] };
  lastFilterSelected: string;
}
