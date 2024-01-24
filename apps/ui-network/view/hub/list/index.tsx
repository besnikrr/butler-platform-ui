import { useContext, useEffect, useState } from "react";
import {
  useTranslation,
  Grid,
  Row,
  AppContext,
  Column,
  Card,
  Typography,
  Button,
  InputSearch,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  NoResult,
  Badge,
  Pagination,
  Filters,
  FilterColumnConfig,
  FilterValue,
  Dropdown,
  ActionButton,
  Icon,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { PERMISSION, HubV2, getTotalPages } from "@butlerhospitality/shared";
import classNames from "classnames";
import NoPermissions from "../../../component/NoPermissions";
import useDebounce from "../../../utils/hooks/useDebounce";
import { formatTaxRate } from "../../../utils/index";
import AddressRenderer from "../../../component/address";
import { useFetchHubs } from "../../../store/hub";
import { useFetchCities } from "../../../store/city";

export default function HubListView() {
  const { t } = useTranslation();
  const history = useHistory();
  const { can } = useContext(AppContext);
  const canCreateHub = can(PERMISSION.NETWORK.CAN_CREATE_HUB);
  const canGetHubs = can(PERMISSION.NETWORK.CAN_GET_HUBS);
  const canUpdateHub = can(PERMISSION.NETWORK.CAN_UPDATE_HUB);

  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const [searchInput, setSearchInput] = useState<string>("");
  const [cityFilterSearch, setCityFilterSearch] = useState<string>("");
  const [cityFilterData, setCityFilterData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchInput);
  const debouncedCityFilter = useDebounce<string>(cityFilterSearch);

  const {
    data: hubData,
    isLoading: hubsLoading,
    isError: hubsError,
  } = useFetchHubs({
    page,
    search: debouncedValue,
    filters: filtersStr,
  });

  const { data: citiesData, refetch: refetchCities } = useFetchCities({
    search: debouncedCityFilter,
  });

  useEffect(() => {
    const filterValues: FilterValue[] = [];
    citiesData?.payload?.forEach((item) => {
      filterValues.push({
        label: item.name,
        queryParamValue: `${item.id || ""}`,
      });
    });

    setCityFilterData(filterValues);
  }, [citiesData]);

  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "City",
      queryParamName: "city_ids",
      data: cityFilterData,
      customFilterOnChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setCityFilterSearch(event?.target?.value);
      },
    },
    {
      name: "Status",
      queryParamName: "statuses",
      data: [
        {
          label: "Active",
          queryParamValue: "true",
        },
        {
          label: "Inactive",
          queryParamValue: "false",
        },
      ],
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  const filterOnChange = (queryString: string) => {
    setPage(1);
    setFiltersStr(queryString);
    setCityFilterSearch("");
    refetchCities();
    history.push(`?${queryString}`);
  };

  const countActiveHotels = (item: HubV2) => {
    let count = 0;
    item.hotels?.forEach((hotel) => {
      if (hotel.active) {
        count += 1;
      }
    });
    return count;
  };

  if (!canGetHubs) return <NoPermissions entity="Hubs" />;

  if (hubsError) {
    pushNotification(t("Error fetching entity", { entity: "hubs" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={
              <>
                <Typography h2>{t("Hub List")}</Typography>
                {canCreateHub && (
                  <Button onClick={() => history.push("/network/hub/create")}>
                    {t("Create New")}
                  </Button>
                )}
              </>
            }
          >
            <div className="network-toolbar mb-20">
              <div className="network-toolbar-actions ui-flex start v-center">
                <Filters
                  columns={filtersColumnConfigs}
                  onChange={filterOnChange}
                  filtersString={filtersStr}
                  onClose={() => {
                    setCityFilterSearch("");
                    refetchCities();
                  }}
                />
                <div className="ml-5">
                  <InputSearch
                    value={searchInput}
                    placeholder={t("Search...")}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {hubsLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("Hub Name")}</TableCell>
                    <TableCell as="th">{t("Contact Number")}</TableCell>
                    <TableCell as="th">{t("Email")}</TableCell>
                    <TableCell as="th">{t("Address")}</TableCell>
                    <TableCell as="th">{t("Tax Rate")}</TableCell>
                    <TableCell as="th">{t("Hotels Associated")}</TableCell>
                    <TableCell as="th">{t("Status")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(hubData?.payload || []).map((item: HubV2) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/network/hub/view/${item.id}`}
                        >
                          {item.name || "n/a"}
                        </Link>
                      </TableCell>
                      <TableCell>{item.contact_phone || "n/a"}</TableCell>
                      <TableCell>{item.contact_email || "n/a"}</TableCell>
                      <TableCell>
                        <AddressRenderer
                          address_town={item?.address_town}
                          address_street={item?.address_street}
                          address_number={item?.address_number}
                          address_zip_code={item?.address_zip_code}
                        />
                      </TableCell>
                      <TableCell>{formatTaxRate(item?.tax_rate)}</TableCell>
                      <TableCell>{countActiveHotels(item)}</TableCell>
                      <TableCell>
                        <Badge
                          leftIcon="Circle"
                          iconSize={5}
                          size="small"
                          className={classNames({
                            "network-inactive-badge": !item.active,
                          })}
                        >
                          {item?.active ? "Active" : "Inactive"}{" "}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dropdown
                          renderTrigger={(openDropdown, triggerRef) => (
                            <ActionButton
                              onClick={openDropdown}
                              ref={triggerRef}
                            >
                              <Icon type="MoreHorizontal01" size={18} />
                            </ActionButton>
                          )}
                          hasArrow
                          placement="right"
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: 160,
                            }}
                          >
                            <Button
                              className="w-100"
                              variant="ghost"
                              muted
                              onClick={() =>
                                history.push(`/network/hub/view/${item.id}`)
                              }
                              leftIcon={<Icon type="EyeOpen" size={18} />}
                            >
                              {t("View")}
                            </Button>
                            {canUpdateHub && (
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() => {
                                  history.push(`/network/hub/edit/${item.id}`);
                                }}
                                leftIcon={<Icon type="Pen01" size={18} />}
                              >
                                {t("Edit")}
                              </Button>
                            )}
                          </div>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {(!hubData || (hubData.payload || []).length < 1) &&
            !hubsLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(hubData?.total))}
                current={page}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </Card>
        </Column>
      </Row>
    </Grid>
  );
}
