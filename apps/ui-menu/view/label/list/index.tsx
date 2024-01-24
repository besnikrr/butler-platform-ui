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
  InputSearch,
  Skeleton,
  Icon,
  Link,
  AppContext,
  useNonInitialEffect,
  useTranslation,
  Pagination,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { AppEnum, Label, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import useDebounce from "../../../util/useDebounce";
import NoResult from "../../../component/NoResult";
import NoPermissions from "../../../component/NoPermissions";
import { getTotalPages } from "../../../util";

const LabelsListView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [data, setData] = useState<HTTPResourceResponse<Label[]>>();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedValue = useDebounce<string>(searchInput);
  const canGetLabels = can(PERMISSION.MENU.CAN_GET_LABELS);
  const canCreateLabel = can(PERMISSION.MENU.CAN_CREATE_LABEL);
  const canUpdateLabel = can(PERMISSION.MENU.CAN_UPDATE_LABEL);

  const getData = async (p: number): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<Label[]>>(
      debouncedValue ? `/labels?name=${debouncedValue}&page=${p}` : `/labels?page=${p}`
    );
    setData(result?.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    if (canGetLabels) {
      getData(1);
    }
  }, []);

  useNonInitialEffect(() => {
    getData(1);
  }, [debouncedValue]);

  if (!canGetLabels) return <NoPermissions entity="Labels" />;
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
                <Typography h2>{t("labels_list")}</Typography>
                {canCreateLabel && (
                  <Button onClick={(): void => history.push("/menu/label/editor")}>{t("create")}</Button>
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
                  <TableCell as="th">{t("name")}</TableCell>
                  <TableCell as="th" style={{ width: 50 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.payload || []).map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link size="medium" component={RouterLink} to={`/menu/label/view/${item.id}`}>
                        {item.name}
                      </Link>
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
                        <div className="ui-flex column" style={{ width: 160 }}>
                          <Button
                            className="w-100"
                            variant="ghost"
                            muted
                            onClick={() => history.push(`/menu/label/view/${item.id}`)}
                            leftIcon={<Icon type="EyeOpen" size={18} />}
                          >
                            {t("view")}
                          </Button>
                          {canUpdateLabel && (
                            <Button
                              className="w-100"
                              variant="ghost"
                              muted
                              onClick={() => {
                                history.push(`/menu/label/manage/${item.id}`);
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

export default LabelsListView;
