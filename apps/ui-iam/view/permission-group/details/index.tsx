import { useContext } from "react";
import {
  useApi,
  Grid,
  Card,
  Skeleton,
  ButtonBase,
  Column,
  Link,
  Row,
  Typography,
  useTranslation,
  AppContext,
  Chip,
  Button,
  DeleteResource,
  Dropdown,
  Icon,
  pushNotification,
  useDeleteResource,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams } from "react-router-dom";
import { AppEnum, PERMISSION } from "@butlerhospitality/shared";
import { useFetchPermissionGroup } from "../../../store/permission-group";
import { useDeletePermissionGroup } from "../../../store/permission-group/queries/use-delete-permission-group";

export default function PermissionGroupDetails() {
  const iamServiceApi = useApi(AppEnum.IAM);
  const { t } = useTranslation();
  const history = useHistory();
  const { can } = useContext(AppContext);
  const params = useParams<{ id: string }>();
  const { deleteResourceMeta, setDeleteResourceMeta } = useDeleteResource();
  const canEditPermissionGroup = can && can(PERMISSION.IAM.CAN_GET_SINGLE_PERMISSION_GROUP);
  const canDeletePermissionGroup = can && can(PERMISSION.IAM.CAN_DELETE_PERMISSION_GROUP);

  const { mutate: deletePermissionGroup } = useDeletePermissionGroup(params.id);

  const {
    data: permissionGroup,
    isLoading: isPermissionGroupLoading,
    isError: isPermissionGroupError,
  } = useFetchPermissionGroup({ id: params.id });

  if (isPermissionGroupLoading) {
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

  if (isPermissionGroupError) {
    pushNotification(t("Error fetching", { entity: "permission group" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <Typography h2>{permissionGroup?.payload?.name}</Typography>
            {canDeletePermissionGroup && (
              <Dropdown
                renderTrigger={(openDropdown, triggerRef) => (
                  <Button size="small" variant="ghost" ref={triggerRef} onClick={openDropdown} iconOnly>
                    <Icon type="MoreHorizontal01" size={18} />
                  </Button>
                )}
                hasArrow
                placement="right"
              >
                <div className="ui-flex column network-action-dropdown">
                  <div>
                    <Button
                      className="w-100"
                      variant="danger-ghost"
                      muted
                      onClick={() => {
                        if (permissionGroup?.payload?.id) {
                          setDeleteResourceMeta({
                            label: "permission group",
                            resource: "permissiongroups",
                            id: permissionGroup.payload.id,
                          });
                        }
                      }}
                    >
                      <Icon type="Delete" size={20} className="mr-10" />
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </Dropdown>
            )}
            {deleteResourceMeta && (
              <DeleteResource
                meta={deleteResourceMeta}
                onClose={() => {
                  setDeleteResourceMeta(undefined);
                }}
                onDelete={async () => {
                  await deletePermissionGroup();
                  setDeleteResourceMeta(undefined);
                  history.push("/iam/permission-groups/list");
                }}
                api={iamServiceApi}
                customDelete
              />
            )}
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <Card
            className="iam-content"
            page
            header={
              <>
                <Typography h2>{t("General Information")}</Typography>
                {canEditPermissionGroup && (
                  <Link
                    component={ButtonBase}
                    onClick={() => history.push(`/iam/permission-groups/edit/${permissionGroup?.payload?.id}`)}
                  >
                    {t("edit")}
                  </Link>
                )}
              </>
            }
          >
            <Row>
              <div className="ui-flex column">
                <Typography size="small" muted className="pb-10">
                  {t("name")}
                </Typography>
                <Typography>{permissionGroup?.payload?.name}</Typography>
              </div>
            </Row>
            {permissionGroup?.payload && (permissionGroup?.payload.permissions || []).length > 0 && (
              <Row>
                <div className="ui-flex column">
                  <Typography size="small" muted className="pb-10">
                    {t("permission_groups")}
                  </Typography>
                  <div className="ui-flex wrap">
                    {permissionGroup?.payload.permissions?.map((permission: any) => {
                      return (
                        <Chip className="mr-5 mb-5" key={permission.id}>
                          {permission.name}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </Row>
            )}
          </Card>
        </Column>
      </Row>
    </Grid>
  );
}
