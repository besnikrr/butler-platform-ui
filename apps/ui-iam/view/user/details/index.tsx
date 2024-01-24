import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Card,
  Skeleton,
  Row,
  Column,
  Typography,
  AppContext,
  Button,
  Divider,
  Dropdown,
  Icon,
  Modal,
  pushNotification,
  useTranslation,
  DeleteResourceMeta,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams } from "react-router-dom";
import { AppEnum, PERMISSION } from "@butlerhospitality/shared";
import GeneralInformation from "./general-information";
import { useFetchUser } from "../../../store/user";
import DeleteResource from "./delete-resource";

export default function UserDetails() {
  const iamServiceApi = useApi(AppEnum.IAM);
  const { can, tenant } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();
  const [showCantDeleteModal, setShowCantDeleteModal] = useState(false);

  const canDeleteUser = can && can(PERMISSION.IAM.CAN_DELETE_USER);
  const canPatchUser = can && can(PERMISSION.IAM.CAN_UPDATE_USER);

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useFetchUser({ id: params.id });

  useEffect(() => {
    setShowCantDeleteModal((deleteResourceMeta && !true) || false);
  }, [deleteResourceMeta]);

  const initResetPasswordRequest = async () => {
    const resetPasswordRequest = await iamServiceApi.post(
      "/users/init/reset/password",
      {
        clientId: tenant.cognito.clientId,
        email: user?.payload?.email,
        poolId: tenant.cognito.poolId,
      }
    );
    if (resetPasswordRequest.data) {
      pushNotification(
        t(`Password reset request sent to ${user?.payload?.email}`),
        {
          type: "success",
        }
      );
    }
  };

  if (isUserLoading) {
    return (
      <Grid gutter={0}>
        <Skeleton className="ml-10" parts={["header"]} />
        <Card>
          <Skeleton parts={["title"]} />
          <Skeleton parts={["title"]} />
          <Skeleton parts={["title"]} />
        </Card>
      </Grid>
    );
  }

  if (isUserError) {
    pushNotification(t("Error fetching", { entity: "user" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <Typography h2>{user?.payload?.name}</Typography>
            <Dropdown
              renderTrigger={(openDropdown, triggerRef) => (
                <Button
                  size="small"
                  variant="ghost"
                  ref={triggerRef}
                  onClick={openDropdown}
                  iconOnly
                >
                  <Icon type="MoreHorizontal01" size={18} />
                </Button>
              )}
              hasArrow
              placement="right"
            >
              <div className="ui-flex column network-action-dropdown">
                <div>
                  {canPatchUser && (
                    <Button
                      className="w-100"
                      variant="ghost"
                      muted
                      onClick={() => initResetPasswordRequest()}
                    >
                      <Icon type="Pen02" size={20} className="mr-10" />
                      {t("reset_password")}
                    </Button>
                  )}
                  {canDeleteUser && (
                    <Button
                      className="w-100"
                      variant="danger-ghost"
                      muted
                      onClick={() => {
                        setDeleteResourceMeta({
                          resource: "user",
                          id: params.id,
                        });
                      }}
                    >
                      <Icon type="Delete" size={20} className="mr-10" />
                      {t("delete")}
                    </Button>
                  )}
                </div>
              </div>
            </Dropdown>
            {deleteResourceMeta && (
              <DeleteResource
                meta={deleteResourceMeta}
                onClose={() => setDeleteResourceMeta(undefined)}
                onDelete={async () => {
                  setDeleteResourceMeta(undefined);
                  history.push("/iam/users/list");
                }}
              />
            )}
            {showCantDeleteModal && (
              <Modal
                visible={showCantDeleteModal}
                onClose={() => {
                  setShowCantDeleteModal(false);
                }}
                style={{ width: 360 }}
              >
                <div>
                  <Typography h2 className="ui-link-danger">
                    {t("error")}
                  </Typography>
                  <Divider />
                  <Typography size="large">
                    {t("delete_associated_user")}
                  </Typography>
                  <div className="ui-flex end mt-30">
                    <Button
                      size="large"
                      variant="ghost"
                      onClick={() => {
                        setShowCantDeleteModal(false);
                      }}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </Column>
      </Row>
      {user?.payload?.id && <GeneralInformation user={user?.payload} />}
    </Grid>
  );
}
