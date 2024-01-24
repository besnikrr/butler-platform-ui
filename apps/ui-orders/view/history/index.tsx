import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonBase,
  Card,
  Column,
  DatePicker,
  FormControl,
  Grid,
  Input,
  Link,
  LookupField,
  NoResult,
  Option,
  Pagination,
  pushNotification,
  Row,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useApi,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

import "./index.scss";
import { AppEnum, getTotalPages } from "@butlerhospitality/shared";
import { useForm } from "react-hook-form";
import qs from "qs";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { toTitleCase } from "../../util";
import { useFetch } from "../../hooks/use-fetch";
import { ORDER_STATUS } from "../../util/constants";

enum FilterBasedOn {
  CREATED_DATE = "createdDate",
  CONFIRMATION_DATE = "confirmDate",
}

enum TimeRange {
  EMPTY = "",
  TODAY = "TODAY",
  LAST_SEVEN_DAYS = "LAST_SEVEN_DAYS",
  LAST_THIRTY_DAYS = "LAST_THIRTY_DAYS",
  CUSTOM_DATES = "CUSTOM_DATES",
}

type OrderFilters = {
  search: string;
  hubId: string;
  cityId: string;
  roomNumber: string;
  orderNumber: string;
  phoneNumber: string;
  filterBasedOn: string;
  startDate: string;
  endDate: string;
  timeRange: TimeRange;
  startTime: string;
  endTime: string;
  statuses: ORDER_STATUS[];
};

type QueryDate = {
  from?: string;
  to?: string;
};

type QueryParams = {
  search?: string;
  statuses?: string[];
  hubIds?: string[];
  cityIds?: string[];
  roomNumber?: string;
  orderNumber?: string;
  phoneNumber?: string;
  page?: number;
  createdDate?: QueryDate;
  confirmedDate?: QueryDate;
};

const orderFiltersInitialState = {
  hubId: "",
  status: [],
  roomNumber: "",
  orderNumber: "",
  startTime: "",
  endTime: "",
  phoneNumber: "",
  search: "",
  filterBasedOn: FilterBasedOn.CREATED_DATE,
  timeRange: TimeRange.TODAY,
};

type Order = {
  id: number;
  status: ORDER_STATUS;
  confirmedDate: string;
  grandTotal: number;
  number: number;
  date: string;
  client: {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
  };
  meta: {
    hotelName: string;
    roomNumber: string;
  };
};

type CreateDate = {
  date?: string;
  time?: string;
  subtractDays?: number;
};

const createDate = ({ date, time, subtractDays }: CreateDate) => {
  const dateInstance = new Date(date ? `${date}Z` : Date.now());
  if (time) {
    const [hours, minutes] = time.split(":");
    dateInstance.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  } else if (typeof subtractDays === "number") {
    dateInstance.setHours(0, 0, 0, 0);
  } else {
    dateInstance.setHours(23, 59, 59, 999);
  }
  if (subtractDays) {
    dateInstance.setDate(dateInstance.getDate() - subtractDays);
  }
  return dateInstance.toISOString();
};

function buildQueryDate(fields: OrderFilters): QueryDate {
  const params = {
    startDate: "",
    endDate: "",
    subtractDays: 0,
  };

  switch (fields.timeRange) {
    case TimeRange.TODAY:
      params.subtractDays = 0;
      break;
    case TimeRange.LAST_SEVEN_DAYS:
      params.subtractDays = 7;
      break;
    case TimeRange.LAST_THIRTY_DAYS:
      params.subtractDays = 30;
      break;
    case TimeRange.CUSTOM_DATES:
      params.subtractDays = 0;
      params.startDate = fields.startDate;
      params.endDate = fields.endDate;
      break;
    default:
      break;
  }

  return {
    from: createDate({
      date: params.startDate,
      time: fields.startTime,
      subtractDays: params.subtractDays,
    }),
    to: createDate({ date: params.endDate, time: fields.endTime }),
  };
}

function buildQuery(fields: OrderFilters): QueryParams {
  const query = {} as QueryParams;
  Object.keys(fields).forEach((key) => {
    const field = fields[key as keyof OrderFilters];
    if (!field || field.length === 0) {
      return;
    }

    switch (key) {
      case "search":
      case "roomNumber":
      case "orderNumber":
      case "phoneNumber":
        query[key] = fields[key];
        break;
      case "hubId":
        query.hubIds = [fields[key]];
        break;
      case "statuses":
        query.statuses = fields[key];
        break;
      case "filterBasedOn":
        if (fields.filterBasedOn === "createdDate" || fields.filterBasedOn === "confirmedDate") {
          query[fields.filterBasedOn] = buildQueryDate(fields);
        }
        break;
      default:
        break;
    }
  });
  return query;
}

const omitEmptyValues = (values: OrderFilters): OrderFilters => {
  const filteredValues = {} as OrderFilters;
  Object.keys(values).forEach((key) => {
    const typedKey = key as keyof OrderFilters;
    if (typedKey === "statuses") {
      if (!values.statuses.length) return;
      filteredValues.statuses = values.statuses;
    } else if (typedKey === "timeRange") {
      if (!values.timeRange.length) return;
      filteredValues.timeRange = values.timeRange;
    } else if (values[typedKey].length) {
      filteredValues[typedKey] = values[typedKey];
    }
  });
  return filteredValues;
};

export const History = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const networkApi = useApi(AppEnum.NETWORK);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<QueryParams | null>(null);
  const { register, reset, getValues, setValue, handleSubmit, watch } = useForm<OrderFilters>({
    defaultValues: { ...orderFiltersInitialState, statuses: [] },
  });
  const orders = useFetch(AppEnum.ORDER)<Order[], QueryParams>({
    query: filters ? { ...filters, page } : { page },
  });
  const timeRange = watch("timeRange");

  const mapQueryToFilter = (query: string): void => {
    const parsedQuery = qs.parse(query.slice(1)) as OrderFilters;
    Object.keys(parsedQuery).forEach((key) => {
      const typedKey = key as keyof OrderFilters;
      setValue(typedKey, parsedQuery[typedKey]);
    });
  };

  const onSubmit = (formFields?: OrderFilters): void => {
    setPage(1);
    const query = buildQuery(getValues());
    const hasFilters = Object.keys(query).length > 0;
    setFilters(!hasFilters ? null : query);
    history.push({ search: qs.stringify(omitEmptyValues(getValues())) });
    if (!hasFilters && formFields) {
      pushNotification(t("Please select filters"), { type: "info" });
    }
  };

  const resetFilters = (): void => {
    reset({ ...orderFiltersInitialState, statuses: [] });
    history.push({ search: "" });
    onSubmit();
  };

  useEffect(() => {
    mapQueryToFilter(location.search);
    onSubmit();
  }, [location.search]);

  return (
    <Grid gutter={0} className="orders-app-container">
      <Row gutter={10}>
        <Column size={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="orders-app-history-filters pl-10">
              <div className="ui-flex v-center between pt-10">
                <Typography h2>{t("order_history")}</Typography>
                <Link size="small" component={ButtonBase} onClick={() => history.push(`/orders/`)}>
                  {t("Back")}
                </Link>
              </div>
              <div className="my-20">
                <Link component={ButtonBase} size="small" onClick={resetFilters}>
                  {t("clear_all_filters")}
                </Link>
              </div>
              <Row className="mb-10 mt-0 pr-0">
                <FormControl vertical label={t("search")} className="mt-10">
                  <Input type="text" {...register("search")} />
                </FormControl>
              </Row>
              <Row className="orders-app-history-filters-form">
                <FormControl vertical label={t("pick_a_location")}>
                  <LookupField
                    value={getValues().hubId}
                    selectProps={register("hubId")}
                    placeholder={t("pick_a_location")}
                    onQuery={(queryParams) => {
                      return networkApi.get(`/hubs?page=${queryParams.page}&name=${queryParams.filter}`);
                    }}
                  />
                </FormControl>
                <Row cols={2} className="mb-0 mt-0 pr-0" gutter={10}>
                  <Column>
                    <FormControl vertical label={t("order_no")}>
                      <Input type="number" {...register("orderNumber")} />
                    </FormControl>
                  </Column>
                  <Column>
                    <FormControl vertical label={t("room_no")}>
                      <Input {...register("roomNumber")} />
                    </FormControl>
                  </Column>
                </Row>
                <FormControl vertical label={t("phone_number")} className="mt-10">
                  <Input type="tel" {...register("phoneNumber")} />
                </FormControl>
                <FormControl vertical label={t("filter_based_on")}>
                  <Select selectProps={register("filterBasedOn")} key="filterBasedOn">
                    <Option value="">{t("pick_a_filter")}</Option>
                    <Option value="createdDate">{t("created_date")}</Option>
                    <Option value="confirmedDate">{t("confirmation_date")}</Option>
                  </Select>
                </FormControl>
                <FormControl vertical label={t("time_range")}>
                  <Select selectProps={register("timeRange")} key="timeRange">
                    <Option value={TimeRange.EMPTY}>{t("pick_time_range")}</Option>
                    <Option value={TimeRange.TODAY}>{t("Today")}</Option>
                    <Option value={TimeRange.LAST_SEVEN_DAYS}>{t("last_7_days")}</Option>
                    <Option value={TimeRange.LAST_THIRTY_DAYS}>{t("last_30_days")}</Option>
                    <Option value={TimeRange.CUSTOM_DATES}>Custom Dates</Option>
                  </Select>
                </FormControl>
                {timeRange === TimeRange.CUSTOM_DATES && (
                  <Row cols={2} className="mt-0" gutter={10}>
                    <Column>
                      <FormControl vertical label={t("start_date")}>
                        <DatePicker
                          data-testid="input-start-time"
                          inputProps={{
                            ...register("startDate"),
                            placeholder: t("start_date"),
                          }}
                        />
                      </FormControl>
                    </Column>
                    <Column>
                      <FormControl vertical label={t("end_date")}>
                        <DatePicker
                          data-testid="input-end-time"
                          inputProps={{
                            ...register("endDate"),
                            placeholder: t("end_date"),
                          }}
                        />
                      </FormControl>
                    </Column>
                  </Row>
                )}
                <Row cols={2} className="mt-0 pr-0" gutter={10}>
                  <Column>
                    <FormControl vertical label={t("set_hours")}>
                      <Input type="time" {...register("startTime")} />
                    </FormControl>
                  </Column>
                  <Column>
                    <FormControl vertical label={t("set_hours")}>
                      <Input type="time" {...register("endTime")} />
                    </FormControl>
                  </Column>
                </Row>
                <FormControl vertical label={t("order_status")}>
                  <Select selectProps={register("statuses")} multiple>
                    {Object.values(ORDER_STATUS).map((value, index) => {
                      return (
                        <Option value={value} key={index}>
                          {value}
                        </Option>
                      );
                    })}
                  </Select>
                </FormControl>
                <div className="ui-flex v-center end">
                  <Button type="submit">{t("apply_filters")}</Button>
                </div>
              </Row>
            </div>
          </form>
        </Column>
        <Column>
          <Card size="small" className="orders-app-column reset">
            <Typography size="large" bold className="ui-block mb-10">
              {t("results")}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">{t("order_no")}</TableCell>
                  <TableCell as="th">{t("client_name")}</TableCell>
                  <TableCell as="th">{t("room_no")}</TableCell>
                  <TableCell as="th">{t("hotel")}</TableCell>
                  <TableCell as="th">{t("value")}</TableCell>
                  <TableCell as="th">{t("date")}</TableCell>
                  <TableCell as="th">{t("status")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.data?.payload?.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link size="medium" component={RouterLink} to={`/orders/edit/${item.id}`}>
                          {`#${item.number}`}
                        </Link>
                      </TableCell>
                      <TableCell>{item.client?.name}</TableCell>
                      <TableCell>{item.meta.roomNumber}</TableCell>
                      <TableCell>{item.meta.hotelName}</TableCell>
                      <TableCell>{`$${item.grandTotal.toFixed(2)}`}</TableCell>
                      <TableCell>{item.date.split("T")[0]}</TableCell>
                      <TableCell>{toTitleCase(item.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {!orders.data?.payload?.length && !orders.isLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(orders.data?.total))}
                current={page}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};
