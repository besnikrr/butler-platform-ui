import { useContext, useState, useEffect } from "react";
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
  Button,
  Typography,
  AppContext,
  useTranslation,
  Skeleton,
  ActionButton,
  Dropdown,
  Icon,
  Link,
  NoResult,
  Pagination,
  pushNotification,
  InputSearch,
  useDebounce,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import {
  PERMISSION,
  PermissionGroup,
  getTotalPages,
} from "@butlerhospitality/shared";
import NoPermissions from "../../../component/NoPermissions";
import { useFetchPermissionGroups } from "../../../store/permission-group";

export default function PermissionGroupsList() {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedValue = useDebounce<string>(searchInput);

  const canCreatePermissionGroup =
    can && can(PERMISSION.IAM.CAN_CREATE_PERMISSION_GROUP);
  const canListPermissionGroups =
    can && can(PERMISSION.IAM.CAN_LIST_PERMISSION_GROUPS);
  const canEditPermissionGroup =
    can && can(PERMISSION.IAM.CAN_UPDATE_PERMISSION_GROUP);

  if (!canListPermissionGroups)
    return <NoPermissions entity="Permission Group" />;

  const {
    data: permissionGroups,
    isLoading: isPermissionGroupsLoading,
    isError: isPermissionGroupsError,
  } = useFetchPermissionGroups({ page, search: debouncedValue });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  if (isPermissionGroupsError) {
    pushNotification(
      t("Error fetching entity", { entity: "permission group" }),
      {
        type: "error",
      }
    );

    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="iam-content"
            page
            header={
              <>
                <Typography h2>{t("permission_groups_list")}</Typography>
                {canCreatePermissionGroup && (
                  <Button
                    onClick={(): void =>
                      history.push("/iam/permission-groups/create")
                    }
                  >
                    {t("create")}
                  </Button>
                )}
              </>
            }
          >
            <div className="network-toolbar mb-20">
              <div className="network-toolbar-actions ui-flex start v-center">
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
            {isPermissionGroupsLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("Name")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionGroups?.payload?.map(
                    (permissionGroup: PermissionGroup) => (
                      <TableRow key={permissionGroup.id}>
                        <TableCell>
                          <Link
                            size="medium"
                            component={RouterLink}
                            to={`/iam/permission-groups/details/${permissionGroup.id}`}
                          >
                            {permissionGroup.name}
                          </Link>
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
                                  history.push(
                                    `/iam/permission-groups/details/${permissionGroup.id}`
                                  )
                                }
                                leftIcon={<Icon type="EyeOpen" size={18} />}
                              >
                                {t("View")}
                              </Button>
                              {canEditPermissionGroup && (
                                <Button
                                  className="w-100"
                                  variant="ghost"
                                  muted
                                  onClick={() =>
                                    history.push(
                                      `/iam/permission-groups/edit/${permissionGroup.id}`
                                    )
                                  }
                                  leftIcon={<Icon type="Pen01" size={18} />}
                                >
                                  {t("Edit")}
                                </Button>
                              )}
                            </div>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
            {(!permissionGroups ||
              (permissionGroups.payload || []).length < 1) &&
            !isPermissionGroupsLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(permissionGroups?.total))}
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
