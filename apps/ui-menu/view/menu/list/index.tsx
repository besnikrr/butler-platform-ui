import { useContext, useEffect, useState } from "react";
import {
  Card,
  Column,
  useApi,
  Grid,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ActionButton,
  Dropdown,
  Button,
  Typography,
  Filters,
  FilterColumnConfig,
  FilterValue,
  InputSearch,
  Skeleton,
  Badge,
  Icon,
  Link,
  AppContext,
  useTranslation,
  Pagination,
  globalDateFormat,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import {
  AppEnum,
  HTTPResourceResponse,
  MenuEntity,
  Hotel,
  PERMISSION,
} from "@butlerhospitality/shared";
import classNames from "classnames";
import qs from "qs";
import useDebounce from "../../../util/useDebounce";
import NoResult from "../../../component/NoResult";
import NoPermissions from "../../../component/NoPermissions";
import { getTotalPages } from "../../../util";

const MenusListView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "Hotel",
      queryParamName: "hotelIds",
      data: async (): Promise<FilterValue[]> => {
        const hotels = await menuServiceApi.get<HTTPResourceResponse<Hotel[]>>(
          "/external/relation/hotels"
        );

        const filterValues: FilterValue[] = [];

        hotels?.data?.payload?.forEach((item) => {
          filterValues.push({
            label: item.name,
            queryParamValue: `${item.id || ""}`,
          });
        });
        return filterValues;
      },
    },
  ];
  const history = useHistory();
  const [data, setData] = useState<HTTPResourceResponse<MenuEntity[]>>();
  const [filtersStr, setFiltersStr] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const debouncedValue = useDebounce<string>(searchInput);
  const canGetMenus = can(PERMISSION.MENU.CAN_GET_MENUS);
  const canCreateMenu = can(PERMISSION.MENU.CAN_CREATE_MENU);
  const canUpdateMenu = can(PERMISSION.MENU.CAN_UPDATE_MENU);
  const canDeleteMenu = can(PERMISSION.MENU.CAN_DELETE_MENU);
  const canGetSingleMenu = can(PERMISSION.MENU.CAN_GET_SINGLE_MENU);
  const canDuplicateMenu = can(PERMISSION.MENU.CAN_DUPLICATE_MENU);

  const filterOnChange = (queryString: string) => {
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  useEffect(() => {
    if (canGetMenus) setFiltersStr(history.location.search);
  }, []);

  const getData = async (p: number): Promise<void> => {
    const filtersParsed = qs.parse(
      history.location.search.replace("?", "").replace(/\|([^&]*)&?/g, "&")
    );

    const queryString = decodeURIComponent(qs.stringify(filtersParsed)).replace(
      /\|([^&]*)&?/g,
      "&"
    );
    const url = debouncedValue
      ? `?name=${debouncedValue}&${queryString}`
      : `${queryString ? "/?" : "?"}${queryString}`;
    const result = await menuServiceApi.get<HTTPResourceResponse<MenuEntity[]>>(
      `${url}page=${p}`
    );
    setData(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    getData(1);
  }, [filtersStr, debouncedValue]);

  const handleDuplicateMenu = async (id: string) => {
    try {
      const result = await menuServiceApi.post<HTTPResourceResponse<any>>(
        `/duplicate/${id}`
      );
      history.push(`/menu/menu/view/${result.data.payload.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!canGetMenus) return <NoPermissions entity="Menus" />;
  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "filterTable-2"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="menu-content"
            page
            header={
              <>
                <Typography h2>{t("menu_list")}</Typography>
                <div className="ui-flex v-center">
                  {canUpdateMenu && (
                    <Button
                      variant="ghost"
                      onClick={() => history.push("/menu/menu/batch-edit")}
                      className="mr-10"
                    >
                      {t("batch_edit")}
                    </Button>
                  )}
                  {canCreateMenu && (
                    <Button onClick={() => history.push("/menu/menu/editor")}>
                      {t("create")}
                    </Button>
                  )}
                </div>
              </>
            }
          >
            <div className="menu-toolbar">
              <div className="menu-toolbar-actions ui-flex start v-center">
                <Filters
                  columns={filtersColumnConfigs}
                  onChange={filterOnChange}
                  filtersString={filtersStr}
                />
                <InputSearch
                  value={searchInput}
                  placeholder={t("search")}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th">{t("name")}</TableCell>
                  <TableCell as="th">{t("date_created")}</TableCell>
                  <TableCell as="th">{t("status")}</TableCell>
                  <TableCell as="th">{t("assigned_hotels")}</TableCell>
                  <TableCell as="th">{t("last_published")}</TableCell>
                  <TableCell as="th" style={{ width: 50 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.payload || []).map((item: MenuEntity) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {canGetSingleMenu ? (
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/menu/menu/view/${item.id}`}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {item.created_at && globalDateFormat(item.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        leftIcon="Circle"
                        iconSize={5}
                        size="small"
                        className={classNames({
                          "menu-inactive-badge": item.status !== "ACTIVE",
                        })}
                      >
                        {item.status === "ACTIVE" ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.hotels?.length}</TableCell>
                    <TableCell>
                      {item.published_at
                        ? globalDateFormat(item.published_at, true)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {(canDeleteMenu || canDuplicateMenu) && (
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
                                history.push(`/menu/menu/view/${item.id}`)
                              }
                              leftIcon={<Icon type="EyeOpen" size={18} />}
                            >
                              {t("view")}
                            </Button>
                            {canUpdateMenu && (
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() => {
                                  history.push(`/menu/menu/manage/${item.id}`);
                                }}
                                leftIcon={<Icon type="Pen01" size={18} />}
                              >
                                {t("edit")}
                              </Button>
                            )}
                            {canDuplicateMenu && (
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() =>
                                  handleDuplicateMenu(item.id || "")
                                }
                                leftIcon={
                                  <Icon type="CrossedArrows" size={18} />
                                }
                              >
                                {t("duplicate")}
                              </Button>
                            )}
                          </div>
                        </Dropdown>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!data?.payload || data?.payload?.length < 1) && !loading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(data?.total))}
                current={page}
                onPageChange={getData}
              />
            )}
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default MenusListView;
