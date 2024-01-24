import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Column,
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
  InputSearch,
  useApi,
  Skeleton,
  Icon,
  Link,
  AppContext,
  useTranslation,
  Pagination,
  Filters,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import qs from "qs";
import { AppEnum, Category, PERMISSION, HTTPResourceResponse, getTotalPages } from "@butlerhospitality/shared";
import useDebounce from "../../../util/useDebounce";
import NoResult from "../../../component/NoResult";
import NoPermissions from "../../../component/NoPermissions";
import { formatStringDate } from "../../../util";

const CategoryListView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [data, setData] = useState<HTTPResourceResponse<Category[]>>();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const debouncedValue = useDebounce<string>(searchInput);
  const canGetCategories = can(PERMISSION.MENU.CAN_GET_CATEGORIES);
  const canCreateCategory = can(PERMISSION.MENU.CAN_CREATE_CATEGORY);
  const canUpdateCategory = can(PERMISSION.MENU.CAN_UPDATE_CATEGORY);

  const getData = async (p: number): Promise<void> => {
    const filtersParsed = qs.parse(history.location.search.replace("?", "").replace(/\|([^&]*)&?/g, "&"));
    const queryString = decodeURIComponent(qs.stringify(filtersParsed)).replace(/\|([^&]*)&?/g, "&");
    const result = await menuServiceApi.get<HTTPResourceResponse<Category[]>>(
      debouncedValue
        ? `/categories?${queryString}name=${debouncedValue}&page=${p}&paginate`
        : `/categories?${queryString}page=${p}&paginate`
    );
    setData(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    if (canGetCategories) {
      getData(1);
    }
  }, [filtersStr, debouncedValue]);

  const filterOnChange = (queryString: string) => {
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  if (!canGetCategories) return <NoPermissions entity="Categories" />;
  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "filterTable"]} />
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
                <Typography h2>{t("category_list")}</Typography>
                {canCreateCategory && (
                  <Button onClick={() => history.push("/menu/category/editor")}>{t("create")}</Button>
                )}
              </>
            }
          >
            <div className="menu-toolbar">
              <div className="menu-toolbar-actions ui-flex start v-center">
                <Filters
                  columns={[
                    {
                      name: "Type",
                      queryParamName: "type",
                      data: [
                        {
                          label: "Category",
                          queryParamValue: "category",
                        },
                        {
                          label: "Subcategory",
                          queryParamValue: "subcategory",
                        },
                      ],
                    },
                  ]}
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
                  <TableCell as="th">{t("is_subcategory")}</TableCell>
                  <TableCell as="th">{t("start_period")}</TableCell>
                  <TableCell as="th">{t("end_period")}</TableCell>
                  <TableCell as="th" style={{ width: 50 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.payload?.map((item: Category) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link size="medium" component={RouterLink} to={`/menu/category/view/${item.id}`}>
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>{item.parent_category_id ? "Yes" : "No"}</TableCell>
                    <TableCell>{formatStringDate(item.start_date)}</TableCell>
                    <TableCell>{formatStringDate(item.end_date)}</TableCell>
                    <TableCell>
                      <Dropdown
                        renderTrigger={(openDropdown, triggerRef) => (
                          <ActionButton onClick={openDropdown} ref={triggerRef}>
                            <Icon type="MoreHorizontal01" size={18} />
                          </ActionButton>
                        )}
                        hasArrow
                        placement="right"
                      >
                        <div className="ui-flex column" style={{ width: 160 }}>
                          <Button
                            className="w-100"
                            variant="ghost"
                            muted
                            onClick={() => history.push(`/menu/category/view/${item.id}`)}
                            leftIcon={<Icon type="EyeOpen" size={18} />}
                          >
                            {t("view")}
                          </Button>
                          {canUpdateCategory && (
                            <Button
                              className="w-100"
                              variant="ghost"
                              muted
                              onClick={() => {
                                history.push(`/menu/category/manage/${item.id}`);
                              }}
                              leftIcon={<Icon type="Pen01" size={18} />}
                            >
                              {t("edit")}
                            </Button>
                          )}
                        </div>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!data || (data.payload || []).length < 1) && !loading ? (
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

export default CategoryListView;
