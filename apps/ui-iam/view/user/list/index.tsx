import { useContext, useState, useEffect } from "react";
import {
  Grid,
  AppContext,
  useTranslation,
  Button,
  Card,
  Column,
  Row,
  Skeleton,
  Typography,
  NoResult,
  Pagination,
  ActionButton,
  Dropdown,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  pushNotification,
  useDebounce,
  InputSearch,
} from "@butlerhospitality/ui-sdk";
import { PERMISSION, User, getTotalPages } from "@butlerhospitality/shared";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useFetchUsers } from "../../../store/user";

export default function UsersList() {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedValue = useDebounce<string>(searchInput);

  const canCreateUser = can && can(PERMISSION.IAM.CAN_CREATE_USER);
  const canDeleteUser = can && can(PERMISSION.IAM.CAN_DELETE_USER);

  const {
    data: userData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useFetchUsers({ page, search: debouncedValue });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  if (isUsersError) {
    pushNotification(t("Error fetching entity", { entity: "users" }), {
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
                <Typography h2>{t("user_list")}</Typography>
                {canCreateUser && (
                  <Button
                    onClick={(): void => history.push("/iam/users/create")}
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
            {isUsersLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("Full Name")}</TableCell>
                    <TableCell as="th">{t("Email")}</TableCell>
                    <TableCell as="th">{t("Phone Number")}</TableCell>
                    <TableCell as="th" style={{ width: 50 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData?.payload?.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Link
                          size="medium"
                          component={RouterLink}
                          to={`/iam/users/details/${user.id}`}
                        >
                          {user.name}
                        </Link>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>
                        {canDeleteUser && (
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
                                  history.push(`/iam/users/details/${user.id}`)
                                }
                                leftIcon={<Icon type="EyeOpen" size={18} />}
                              >
                                {t("View")}
                              </Button>
                              <Button
                                className="w-100"
                                variant="ghost"
                                muted
                                onClick={() =>
                                  history.push(`/iam/users/edit/${user.id}`)
                                }
                                leftIcon={<Icon type="Pen01" size={18} />}
                              >
                                {t("Edit")}
                              </Button>
                            </div>
                          </Dropdown>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {(!userData || (userData.payload || []).length < 1) &&
            !isUsersLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(userData?.total))}
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
