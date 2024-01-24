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
  Image,
  InputSearch,
  Skeleton,
  Icon,
  Link,
  Modal,
  useNonInitialEffect,
  AppContext,
  useTranslation,
  Pagination,
  Badge,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import {
  AppEnum,
  Item,
  ItemList,
  PERMISSION,
  HTTPResourceResponse,
  getTotalPages,
} from "@butlerhospitality/shared";
import classNames from "classnames";
import useDebounce from "../../../util/useDebounce";
import NoResult from "../../../component/NoResult";
import ItemOOS from "../out-of-stock";
import NoPermissions from "../../../component/NoPermissions";

const ItemsListView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [data, setData] = useState<HTTPResourceResponse<Item[]>>();
  const [itemOOS, setItemOOSMeta] = useState<any>();
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedValue = useDebounce<string>(searchInput);
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const canGetItems = can(PERMISSION.MENU.CAN_GET_ITEMS);
  const canCreateItem = can(PERMISSION.MENU.CAN_CREATE_ITEM);
  const canUpdateItem = can(PERMISSION.MENU.CAN_UPDATE_ITEM);
  const canViewItem = can(PERMISSION.MENU.CAN_GET_ITEM);

  const getData = async (p: number): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<ItemList[]>>(
      debouncedValue
        ? `/products?name=${debouncedValue}&page=${p}`
        : `/products?page=${p}`
    );
    setData(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    if (canGetItems) getData(1);
  }, []);

  useNonInitialEffect(() => {
    getData(1);
  }, [debouncedValue]);

  if (!canGetItems) return <NoPermissions entity="Items" />;
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
                <Typography h2>{t("items_list")}</Typography>
                {canCreateItem && (
                  <Button
                    onClick={(): void => history.push("/menu/item/create")}
                  >
                    {t("create")}
                  </Button>
                )}
              </>
            }
          >
            <div className="menu-toolbar">
              <div className="menu-toolbar-actions ui-flex start v-center">
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
                  <TableCell as="th" style={{ width: 60 }}>
                    {t("image")}
                  </TableCell>
                  <TableCell as="th">{t("name")}</TableCell>
                  <TableCell as="th">{t("price")}</TableCell>
                  <TableCell as="th">{t("description")}</TableCell>
                  <TableCell as="th">{t("Status")}</TableCell>
                  <TableCell as="th" style={{ width: 50 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.payload?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        className="ui-flex w-100"
                        component={RouterLink}
                        to={`/menu/item/view/${item.id}`}
                      >
                        <Image
                          src={`${item?.image_base_url}/image/400x400/${item.image}`}
                          alt={item.name}
                          width={40}
                          height={40}
                        />
                      </Link>
                    </TableCell>
                    <TableCell>
                      {canViewItem ? (
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/menu/item/view/${item.id}`}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>${Number(item.price)?.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.description?.length >= 80
                        ? `${item.description?.substring(0, 80)}...`
                        : item.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        leftIcon="Circle"
                        iconSize={5}
                        size="small"
                        className={classNames({
                          "menu-inactive-badge": !item?.is_active,
                        })}
                      >
                        {item?.is_active ? t("Active") : t("Inactive")}
                      </Badge>
                    </TableCell>
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
                              history.push(`/menu/item/view/${item.id}`)
                            }
                            leftIcon={<Icon type="EyeOpen" size={18} />}
                          >
                            {t("view")}
                          </Button>
                          {canUpdateItem && (
                            <Button
                              className="w-100"
                              variant="ghost"
                              muted
                              onClick={() => {
                                history.push(
                                  `/menu/item/manage/general-information/${item.id}`
                                );
                              }}
                              leftIcon={<Icon type="Pen01" size={18} />}
                            >
                              {t("edit")}
                            </Button>
                          )}
                          <Button
                            className="w-100"
                            variant="ghost"
                            muted
                            onClick={() => {
                              if (item.id) {
                                setItemOOSMeta({
                                  resource: "item",
                                  id: item.id,
                                  name: item.name,
                                });
                                setModalVisible(true);
                              }
                            }}
                          >
                            86 Item
                          </Button>
                        </div>
                      </Dropdown>
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
        {itemOOS && (
          <Modal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            style={{ minWidth: 780 }}
          >
            <ItemOOS meta={itemOOS} onClose={() => setModalVisible(false)} />
          </Modal>
        )}
      </Row>
    </Grid>
  );
};

export default ItemsListView;
