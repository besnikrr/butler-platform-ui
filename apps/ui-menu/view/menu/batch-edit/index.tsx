import React, { useContext, useEffect, useReducer, useState } from "react";
import qs from "qs";
import { Redirect, useHistory } from "react-router-dom";
import {
  Card,
  Column,
  useApi,
  Grid,
  Row,
  Typography,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Filters,
  InputSearch,
  FilterColumnConfig,
  AppContext,
  pushNotification,
  FilterValue,
  Divider,
  ErrorMessage,
  useTranslation,
  Pagination,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  Hotel,
  HTTPResourceResponse,
  MenuEntity,
  PERMISSION,
  getTotalPages,
} from "@butlerhospitality/shared";
import { CategoryCollapsible } from "../common/category-collapsible";
import useDebounce from "../../../util/useDebounce";
import menuReducer from "../common/menu-reducer";
import { submitDataMapper } from "../common/util";
import NoResult from "../../../component/NoResult";

import "../style.scss";

const MenusManageView = (): JSX.Element => {
  const [menuState, dispatchMenuAction] = useReducer(menuReducer, {
    addedItems: {},
    itemsToSelect: {},
    categories: {},
    loading: true,
    error: null,
  });
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "hotel",
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
  const [menus, setMenus] = useState<HTTPResourceResponse<MenuEntity[]>>();
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [filtersStr, setFiltersStr] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedValue = useDebounce<string>(searchInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const canBatchEditMenus = can(PERMISSION.MENU.CAN_BATCH_EDIT_MENU);

  const filterOnChange = (queryString: string) => {
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  useEffect(() => {
    setFiltersStr(history.location.search);
  }, []);

  const getData = async (p: number): Promise<void> => {
    const filtersParsed = qs.parse(
      history.location.search.replace("?", "").replace(/\|([^&]*)&?/g, "&")
    );

    const queryString = decodeURIComponent(qs.stringify(filtersParsed)).replace(
      /\|([^&]*)&?/g,
      "&"
    );

    const result = await menuServiceApi.get<HTTPResourceResponse<MenuEntity[]>>(
      debouncedValue
        ? `?name=${debouncedValue}&${queryString}&page=${p}`
        : `/?page=${p}&${queryString}`
    );
    setMenus(result.data);
    setLoading(false);
    setPage(p);
  };

  useEffect(() => {
    getData(1);
  }, [filtersStr, debouncedValue]);

  const handleMenuClick = (menuId: string | undefined) => {
    if (!menuId) return;

    if (!selectedMenus.includes(menuId)) {
      return setSelectedMenus([...selectedMenus, menuId]);
    }

    return setSelectedMenus(
      (selectedMenus || []).filter((item) => item !== menuId)
    );
  };

  useEffect(() => {
    const getSubcategoryData = async (): Promise<void> => {
      try {
        const result = await menuServiceApi.get<HTTPResourceResponse<any>>(
          "/products?categorized=true"
        );
        dispatchMenuAction({
          type: "set-menu",
          payload: {
            addedItems: {},
            categories: result.data.payload,
            loading: false,
          },
        });
      } catch (error: any) {
        dispatchMenuAction({
          type: "set-menu",
          payload: { error: error.message, loading: false },
        });
      }
    };
    getSubcategoryData();
  }, []);

  const updateItems = (payload: any) => {
    dispatchMenuAction({ type: "add-update-item", payload });
  };

  const removeItem = (payload: any) => {
    dispatchMenuAction({ type: "remove-item", payload });
  };

  const addItem = (payload: any) => {
    dispatchMenuAction({ type: "add-item", payload });
  };

  const reorderSubcategory = (payload: any) => {
    dispatchMenuAction({ type: "reorder-subcategory", payload });
  };

  const save = async () => {
    try {
      setIsSubmitting(true);
      const data = submitDataMapper(menuState);
      if (selectedMenus.length === 0) {
        throw new Error("Please add at least one menu");
      }
      if (data.length === 0) {
        throw new Error("Please add at least one item of a subcategory");
      }
      const dataObject = {
        products: data,
        menu_ids: selectedMenus,
      };
      await menuServiceApi.post<HTTPResourceResponse<any>>(
        `/batch-edit`,
        dataObject
      );
      history.push(`/menu/menu/list`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canBatchEditMenus) {
    pushNotification("You have no permissions to batch edit menus.", {
      type: "warning",
    });
    return <Redirect to="/menu/menu/list" />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Skeleton parts={["header"]} className="pt-10" />
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "block"]} />
        </Card>
        <Card className="mt-20" page>
          <Skeleton parts={["filterTable-2"]} />
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
                <Typography h2>{t("batch_edit_menus")}</Typography>
              </>
            }
          >
            <div className="menu-toolbar mb-10">
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
                  <TableCell as="th" style={{ width: 50 }} />
                  <TableCell as="th">{t("menu")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus?.payload?.map((item: MenuEntity) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        key={item.id}
                        onChange={() => {
                          handleMenuClick(item.id);
                        }}
                        checked={selectedMenus.includes(item.id || "")}
                      />
                    </TableCell>
                    <TableCell>{item?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!menus?.payload || menus?.payload?.length < 1) && !loading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(menus?.total))}
                current={page}
                onPageChange={getData}
              />
            )}
          </Card>
        </Column>
      </Row>
      <Row>
        <Column>
          <Card
            className="menu-content"
            page
            header={<Typography h2>{t("items")}</Typography>}
          >
            <Row cols={1}>
              <Column>
                {(Object.keys(menuState.categories) || []).map(
                  (key: string) => {
                    return (
                      <CategoryCollapsible
                        key={key}
                        className="menu-category-collapsible"
                        categoryId={key}
                        menuState={menuState}
                        updateItems={updateItems}
                        removeItem={removeItem}
                        addItem={addItem}
                        reorderSubcategory={reorderSubcategory}
                        itemEdit={false}
                      />
                    );
                  }
                )}
                {error && (
                  <div className="mt-20">
                    <ErrorMessage error={error} />
                  </div>
                )}
                <Divider vertical={30} />
              </Column>
              <Column className="mt-0">
                <div className="ui-flex end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      history.push("/menu/menu/list");
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button variant="primary" className="ml-10" onClick={save}>
                    {t("save")}
                  </Button>
                </div>
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default MenusManageView;
