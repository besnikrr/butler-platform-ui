import { useState, useContext, useEffect } from "react";
import {
  FilterColumnConfig,
  FilterValue,
  Badge,
  useTranslation,
  Grid,
  AppContext,
  Typography,
  Column,
  Row,
  Card,
  Button,
  InputSearch,
  Link,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  NoResult,
  Pagination,
  Filters,
  Dropdown,
  ActionButton,
  Icon,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  HotelList,
  PERMISSION,
  getTotalPages,
} from "@butlerhospitality/shared";

import { useHistory, Link as RouterLink } from "react-router-dom";
import classNames from "classnames";
import NoPermissions from "../../../component/NoPermissions";
import useDebounce from "../../../utils/hooks/useDebounce";
import { useFetchHotels } from "../../../store/hotel";
import { useFetchHubs } from "../../../store/hub";
import AddressRenderer from "../../../component/address";

export default function HotelListView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();

  const canCreateHotel = can(PERMISSION.NETWORK.CAN_CREATE_HOTEL);
  const canGetHotels = can(PERMISSION.NETWORK.CAN_GET_HOTELS);
  const canUpdateHotel = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL);

  const [searchInput, setSearchInput] = useState<string>("");
  const [hubFilterSearch, setHubFilterSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const [hubFilterData, setHubFilterData] = useState<any[]>([]);

  const debouncedValue = useDebounce<string>(searchInput);
  const debouncedHubFilter = useDebounce<string>(hubFilterSearch);

  const {
    data: hotelData,
    isLoading: hotelsLoading,
    isError: hotelsError,
  } = useFetchHotels({
    page,
    search: debouncedValue,
    filters: filtersStr,
  });

  const { data: hubData, refetch: refetchHubs } = useFetchHubs({
    search: debouncedHubFilter,
    filters: "statuses[0]=true",
  });

  useEffect(() => {
    const filterValues: FilterValue[] = [];
    hubData?.payload?.forEach((item) => {
      filterValues.push({
        label: item.name,
        queryParamValue: `${item.id || ""}`,
      });
    });

    setHubFilterData(filterValues);
  }, [hubData]);

  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "Hub",
      queryParamName: "hub_ids",
      customFilterOnChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setHubFilterSearch(event?.target?.value);
      },
      data: hubFilterData,
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
    setHubFilterSearch("");
    refetchHubs();
    history.push(`?${queryString}`);
  };

  if (!canGetHotels) return <NoPermissions entity="Hotels" />;

  if (hotelsError) {
    pushNotification(t("Error fetching entity", { entity: "hotels" }), {
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
                <Typography h2>{t("Hotel List")}</Typography>
                {canCreateHotel && (
                  <Button onClick={() => history.push("/network/hotel/create")}>
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
                    setHubFilterSearch("");
                    refetchHubs();
                  }}
                />
                <div className="ml-5">
                  <InputSearch
                    value={searchInput}
                    placeholder={t("Search")}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            {hotelsLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("Hotel Name")}</TableCell>
                    <TableCell as="th">{t("Contact Number")}</TableCell>
                    <TableCell as="th">{t("Contact Person")}</TableCell>
                    <TableCell as="th">{t("Address")}</TableCell>
                    <TableCell as="th">{t("Hub")}</TableCell>
                    <TableCell as="th">{t("Status")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotelData?.payload?.map((item: HotelList) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/network/hotel/view/${item.id}`}
                        >
                          {item.name || "n/a"}
                        </Link>
                      </TableCell>
                      <TableCell>{item.web_phone || "n/a"}</TableCell>
                      <TableCell>{item.contact_person || "n/a"}</TableCell>
                      <TableCell>
                        <AddressRenderer
                          address_town={item?.address_town}
                          address_street={item?.address_street}
                          address_number={item?.address_number}
                          address_zip_code={item?.address_zip_code}
                        />
                      </TableCell>

                      <TableCell>{item?.hub?.name || "n/a"}</TableCell>
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
                                history.push(`/network/hotel/view/${item.id}`)
                              }
                              leftIcon={<Icon type="EyeOpen" size={18} />}
                            >
                              {t("View")}
                            </Button>
                            {canUpdateHotel && (
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() => {
                                  history.push(
                                    `/network/hotel/edit/general-information/${item.id}`
                                  );
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
            {(!hotelData || (hotelData.payload || []).length < 1) &&
            !hotelsLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(hotelData?.total))}
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
