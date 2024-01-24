import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Typography,
  Link,
  Row,
  Column,
  Card,
  ButtonBase,
  Skeleton,
  AppContext,
  pushNotification,
  useTranslation,
  DeleteResourceMeta,
  Button,
  Dropdown,
  Icon,
  GoToOMSLink,
  Chip,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams, Redirect } from "react-router-dom";
import {
  AppEnum,
  Category,
  HTTPResourceResponse,
  PERMISSION,
} from "@butlerhospitality/shared";
import DeleteResource from "./delete-resource";

const CategoryView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Category>();
  const [loading, setLoading] = useState(true);
  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();
  const canGetCategory = can(PERMISSION.MENU.CAN_GET_CATEGORY);
  const canUpdateCategory = can(PERMISSION.MENU.CAN_UPDATE_CATEGORY);
  const canDeleteCategory = can(PERMISSION.MENU.CAN_DELETE_CATEGORY);

  useEffect(() => {
    if (!canGetCategory) {
      pushNotification("You have no permissions to view category", {
        type: "warning",
      });
      return;
    }

    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Category>>(
        `/categories/${params.id}`
      );
      setData(result.data.payload);
      setLoading(false);
    };
    getData();
  }, [params.id]);

  if (!canGetCategory) {
    return <Redirect to="/menu/category/list" />;
  }

  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton
            parts={["cardHeaderAction", "divider", "text", "text", "text"]}
          />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <Typography h2>{data?.name}</Typography>
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
                  {canDeleteCategory && (
                    <Button
                      className="w-100"
                      variant="danger-ghost"
                      muted
                      onClick={() => {
                        setDeleteResourceMeta({
                          resource: "category",
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
                {canUpdateCategory && (
                  <Link
                    component={ButtonBase}
                    onClick={() =>
                      history.push(`/menu/category/manage/${data?.id}`)
                    }
                  >
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
                      {t("category_name")}
                    </Typography>
                    <Typography>{data?.name}</Typography>
                  </div>
                  {data?.oms_id && (
                    <GoToOMSLink
                      path={`/inventory/categories/${data?.oms_id}`}
                    />
                  )}
                </div>
              </Column>
              {data?.parent_category_id ? (
                <>
                  <Column>
                    <Typography className="mb-5" size="small" p muted>
                      {t("category")}
                    </Typography>
                    <Typography>{data?.parent_category?.name}</Typography>
                  </Column>
                  {(data?.start_date || data?.end_date) && (
                    <>
                      <Column>
                        <Typography className="mb-5" size="small" p muted>
                          {t("start_period")}
                        </Typography>
                        <Typography>{data?.start_date}</Typography>
                      </Column>
                      <Column>
                        <Typography className="mb-5" size="small" p muted>
                          {t("end_period")}
                        </Typography>
                        <Typography>{data?.end_date}</Typography>
                      </Column>
                    </>
                  )}
                </>
              ) : (
                <>
                  {(data?.start_date || data?.end_date) && (
                    <>
                      <Column>
                        <Typography className="mb-5" size="small" p muted>
                          {t("start_period")}
                        </Typography>
                        <Typography>{data?.start_date}</Typography>
                      </Column>
                      <Column>
                        <Typography className="mb-5" size="small" p muted>
                          {t("end_period")}
                        </Typography>
                        <Typography>{data?.end_date}</Typography>
                      </Column>
                    </>
                  )}
                  <Column>
                    <Typography className="mb-5" size="small" p muted>
                      {t("subcategories")}
                    </Typography>
                    <div className="ui-flex wrap">
                      {data?.subcategories?.map((subcategory) => (
                        <>
                          <Chip className="mr-5 mb-5" key={subcategory.id}>
                            {subcategory.name}
                          </Chip>
                        </>
                      ))}
                    </div>
                  </Column>
                </>
              )}
            </Row>
          </Card>
        </Column>
      </Row>
      {deleteResourceMeta && (
        <DeleteResource
          meta={deleteResourceMeta}
          onClose={() => setDeleteResourceMeta(undefined)}
          onDelete={() => {
            pushNotification("Category deleted successfully", {
              type: "success",
            });
            history.push("/menu/category/list");
          }}
        />
      )}
    </Grid>
  );
};

export default CategoryView;
