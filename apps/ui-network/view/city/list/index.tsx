import { useState, useContext, useEffect } from "react";
import {
  useTranslation,
  AppContext,
  Grid,
  Card,
  Skeleton,
  Row,
  Column,
  Typography,
  Button,
  InputSearch,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Pagination,
  NoResult,
  pushNotification,
  Dropdown,
  ActionButton,
  Icon,
} from "@butlerhospitality/ui-sdk";
import {
  CityList,
  PERMISSION,
  HubV2,
  getTotalPages,
} from "@butlerhospitality/shared";

import { useHistory, Link as RouterLink } from "react-router-dom";
import NoPermissions from "../../../component/NoPermissions";
import useDebounce from "../../../utils/hooks/useDebounce";
import { useFetchCities } from "../../../store/city";

export default function CityListView() {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const canCreateCity = can(PERMISSION.NETWORK.CAN_CREATE_CITY);
  const canGetCities = can(PERMISSION.NETWORK.CAN_GET_CITIES);
  const canUpdateCity = can(PERMISSION.NETWORK.CAN_UPDATE_CITY);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const debouncedValue = useDebounce<string>(searchInput);
  const { data, isLoading, isError } = useFetchCities({
    page,
    search: debouncedValue,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  if (!canGetCities) return <NoPermissions entity="Cities" />;

  if (isError) {
    pushNotification(t("Error fetching entity", { entity: "cities" }), {
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
                <Typography h2>{t("City List")}</Typography>
                {canCreateCity && (
                  <Button onClick={() => history.push("/network/city/create")}>
                    {t("Create New")}
                  </Button>
                )}
              </>
            }
          >
            <div className="network-toolbar mb-20">
              <div className="network-toolbar-actions ui-flex start v-center">
                <InputSearch
                  value={searchInput}
                  placeholder={t("Search")}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            {isLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("City Name")}</TableCell>
                    <TableCell as="th">{t("Time Zone")}</TableCell>
                    <TableCell as="th">{t("State")}</TableCell>
                    <TableCell as="th">{t("Hubs Associated")}</TableCell>
                    <TableCell as="th">{t("Hotels Associated")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.payload?.map((item: CityList) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link
                            size="medium"
                            component={RouterLink}
                            to={`/network/city/view/${item.id}`}
                          >
                            {item.name || "n/a"}
                          </Link>
                        </TableCell>
                        <TableCell>{item.time_zone || "n/a"}</TableCell>
                        <TableCell>{item.state || "n/a"}</TableCell>
                        <TableCell>{item?.hubs.length || 0}</TableCell>
                        <TableCell>
                          {item.hubs
                            .map((hub: HubV2) => hub.hotels?.length)
                            .reduce(
                              (previousValue, currentValue) =>
                                (previousValue || 0) + (currentValue || 0),
                              0
                            )}
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
                                  history.push(`/network/city/view/${item.id}`)
                                }
                                leftIcon={<Icon type="EyeOpen" size={18} />}
                              >
                                {t("View")}
                              </Button>
                              {canUpdateCity && (
                                <Button
                                  className="w-100"
                                  variant="ghost"
                                  muted
                                  onClick={() => {
                                    history.push(
                                      `/network/city/edit/${item.id}`
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
                    );
                  })}
                </TableBody>
              </Table>
            )}
            {(!data || (data.payload || []).length < 1) && !isLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(data?.total))}
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
