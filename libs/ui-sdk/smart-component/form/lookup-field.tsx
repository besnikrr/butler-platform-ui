import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { SelectProps, Select, Option, Typography } from "../../component";
import { HTTPResourceResponse } from "../../../shared";
import { useDebounce } from "../../util";

interface OnQueryParams {
  page: number;
  pageSize: number;
  filter?: string;
}

interface LookupFieldProps<T> extends SelectProps {
  pageSize?: number;
  initData?: HTTPResourceResponse<T[]>;
  hasSearch?: boolean;
  valueKey?: string;
  textKey?: string;
  excludeIds?: number[] | string[];
  onQuery: (
    params: OnQueryParams
  ) => Promise<AxiosResponse<HTTPResourceResponse<T[]>>>;
}

const LookupField = <T,>({
  pageSize = 10,
  onQuery,
  initData,
  hasSearch = true,
  children,
  valueKey = "id",
  textKey = "name",
  ...props
}: LookupFieldProps<T>) => {
  const [data, setData] = useState<any>(initData?.payload || []);
  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(!initData);

  const debouncedValue = useDebounce<string>(filter);

  const queryNextPage = async (p: number, pSize: number, f: string) => {
    try {
      setLoading(true);
      const result = await onQuery({ page: p, pageSize: pSize, filter: f });
      const nextData = result?.data?.payload;

      if (nextData && Array.isArray(nextData)) {
        if (nextData.length < pSize) {
          setIsLastPage(true);
        }

        if (p === 1) {
          setData(nextData);
        } else {
          setData(
            data.concat(
              // TODO: find a better way to do this
              nextData.filter(
                (d: any) =>
                  !data.find((dd: any) => dd[valueKey] === d[valueKey])
              )
            )
          );
        }

        setPage(p);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      setIsLastPage(false);
      queryNextPage(1, pageSize, filter);
    }
    if (!shouldFetch) {
      setShouldFetch(true);
    }
  }, [debouncedValue]);

  return (
    <Select
      filter={filter}
      infiniteScroll
      onReachEnd={() => {
        if (
          (initData?.payload?.length || 0) < (initData?.total || 0) &&
          !isLastPage &&
          !loading
        ) {
          queryNextPage(page + 1, pageSize, filter);
        }
      }}
      onSearch={
        hasSearch && !props.multiple ? (q: string) => setFilter(q) : undefined
      }
      {...props}
    >
      {props.placeholder && (
        <Option value="" key="placeholder" disabled hidden>
          {props.placeholder}
        </Option>
      )}
      {data
        ?.filter((item: any) => {
          if (props.excludeIds?.length) {
            return [...(props?.excludeIds || [])]?.indexOf(item.id) === -1;
          }
          return item;
        })
        .map((item: any) => {
          if (!item) {
            return null;
          }

          return (
            <Option key={item[valueKey]} value={item[valueKey]}>
              {item[textKey]}
            </Option>
          );
        })}
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
    </Select>
  );
};

export { LookupField, OnQueryParams };
