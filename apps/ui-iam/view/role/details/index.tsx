import { useContext, useState } from "react";
import {
  useApi,
  Grid,
  Skeleton,
  Card,
  Button,
  Column,
  DeleteResource,
  Dropdown,
  Icon,
  pushNotification,
  Row,
  Typography,
  AppContext,
  DeleteResourceMeta,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams } from "react-router-dom";
import { AppEnum, PERMISSION } from "@butlerhospitality/shared";
import GeneralInformation from "./general-information";
import { useFetchRole } from "../../../store/role";
import { useDeleteRole } from "../../../store/role/queries/use-delete-role";

export default function RoleDetails() {
  const iamServiceApi = useApi(AppEnum.IAM);
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [deleteResourceMeta, setDeleteResourceMeta] = useState<DeleteResourceMeta>();
  const canDeleteRole = can && can(PERMISSION.IAM.CAN_DELETE_ROLE);

  const { mutate: deleteRole } = useDeleteRole(params.id);

  const { data: role, isLoading: isRoleLoading, isError: isRoleError } = useFetchRole({ id: params.id });

  if (isRoleLoading) {
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

  if (isRoleError) {
    pushNotification(t("Error fetching", { entity: "role" }), {
      type: "error",
    });

    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <Typography h2>{role?.payload?.name}</Typography>
            {canDeleteRole && (
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
                        if (role?.payload?.id) {
                          setDeleteResourceMeta({
                            label: "role",
                            resource: "roles",
                            id: role?.payload?.id,
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
                  await deleteRole();
                  setDeleteResourceMeta(undefined);
                  history.push("/iam/roles/list");
                }}
                api={iamServiceApi}
                customDelete
              />
            )}
          </div>
        </Column>
      </Row>
      {role?.payload?.id && <GeneralInformation role={role.payload} />}
    </Grid>
  );
}
