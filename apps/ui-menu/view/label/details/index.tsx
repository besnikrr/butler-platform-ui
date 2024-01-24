import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Typography,
  Link,
  Row,
  Column,
  Card,
  Skeleton,
  AppContext,
  pushNotification,
  ButtonBase,
  useTranslation,
  Button,
  Dropdown,
  Icon,
  DeleteResourceMeta,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { AppEnum, Label, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import DeleteResource from "./delete-resource";

const LabelDetails = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<HTTPResourceResponse<Label>>();
  const [loading, setLoading] = useState(true);
  const [deleteResourceMeta, setDeleteResourceMeta] = useState<DeleteResourceMeta>();
  const canGetLabel = can(PERMISSION.MENU.CAN_GET_LABEL);
  const canUpdateLabel = can(PERMISSION.MENU.CAN_UPDATE_LABEL);
  const canDeleteLabel = can(PERMISSION.MENU.CAN_DELETE_LABEL);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Label>>(`/labels/${params.id}`);
      setData(result.data);
      setLoading(false);
    };
    getData();
  }, [params.id]);

  if (!canGetLabel) {
    pushNotification("You have no permissions to view label", {
      type: "warning",
    });
    return <Redirect to="/menu/label/list" />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "text", "text", "text"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <Typography h2>{data?.payload?.name}</Typography>
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
                  {canDeleteLabel && (
                    <Button
                      className="w-100"
                      variant="danger-ghost"
                      muted
                      onClick={() => {
                        setDeleteResourceMeta({
                          resource: "label",
                          id: params.id,
                        });
                      }}
                    >
                      <Icon type="Delete" size={20} className="mr-10" />
                      {t("Delete")}
                    </Button>
                  )}
                </div>
              </div>
            </Dropdown>
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <Card
            className="menu-content"
            page
            header={
              <>
                <Typography h2>{t("General Information")}</Typography>
                {canUpdateLabel && (
                  <Link component={ButtonBase} onClick={() => history.push(`/menu/label/manage/${data?.payload?.id}`)}>
                    {t("edit")}
                  </Link>
                )}
              </>
            }
          >
            <Row cols={1}>
              <Column className="mt-10">
                <div className="ui-flex between v-start">
                  <div>
                    <Typography className="mb-5" size="small" p muted>
                      {t("name")}
                    </Typography>
                    <Typography>{data?.payload?.name}</Typography>
                  </div>
                </div>
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
      {deleteResourceMeta && (
        <DeleteResource
          meta={deleteResourceMeta}
          onClose={() => setDeleteResourceMeta(undefined)}
          onDelete={() => {
            setDeleteResourceMeta(undefined);
            pushNotification("Label deleted successfully", {
              type: "success",
            });
            history.push("/menu/label/list");
          }}
        />
      )}
    </Grid>
  );
};

export default LabelDetails;
