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
  useDebounce,
  InputSearch,
} from "@butlerhospitality/ui-sdk";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { PERMISSION, Role, getTotalPages } from "@butlerhospitality/shared";
import { useFetchRoles } from "../../../store/role";
import NoPermissions from "../../../component/NoPermissions";

export default function RoleList() {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const canCreateRole = can && can(PERMISSION.IAM.CAN_CREATE_ROLE);
  const canEditRole = can && can(PERMISSION.IAM.CAN_UPDATE_ROLE);
  const canGetRoles = can && can(PERMISSION.IAM.CAN_LIST_ROLES);

  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedValue = useDebounce<string>(searchInput);

  if (!canGetRoles) return <NoPermissions entity="Roles" />;

  const {
    data: roles,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useFetchRoles({ page, search: debouncedValue });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  if (isRolesError) {
    pushNotification(t("Error fetching entity", { entity: "roles" }), {
      type: "error",
    });

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
                <Typography h2>{t("role_list")}</Typography>
                {canCreateRole && (
                  <Button
                    onClick={(): void => history.push("/iam/roles/create")}
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
            {isRolesLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("Name")}</TableCell>
                    <TableCell as="th">{t("Description")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles?.payload?.map((role: Role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/iam/roles/details/${role.id}`}
                        >
                          {role.name}
                        </Link>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
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
                                history.push(`/iam/roles/details/${role.id}`)
                              }
                              leftIcon={<Icon type="EyeOpen" size={18} />}
                            >
                              {t("View")}
                            </Button>
                            {canEditRole && (
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() =>
                                  history.push(`/iam/roles/edit/${role.id}`)
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
                  ))}
                </TableBody>
              </Table>
            )}
            {(!roles || (roles.payload || []).length < 1) && !isRolesLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(roles?.total))}
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
