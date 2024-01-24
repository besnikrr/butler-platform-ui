import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Row,
  Column,
  Card,
  Skeleton,
  pushNotification,
  Typography,
  Badge,
  AppContext,
} from "@butlerhospitality/ui-sdk";
import { useParams, Redirect } from "react-router-dom";
import { AppEnum, Item, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import { t } from "i18next";
import classNames from "classnames";
import GeneralInformation from "./general-information";
import CategoryInformation from "./category-information";
import ModifierInformation from "./modifier-information";
import LabelInformation from "./label-information";
import OutOfStockInformation from "./oos-information";
import ItemActions from "./item-actions";

const ItemsManage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { can } = useContext(AppContext);
  const menuServiceApi = useApi(AppEnum.MENU);
  const [data, setData] = useState<HTTPResourceResponse<Item>>();
  const [loading, setLoading] = useState(false);

  const getData = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await menuServiceApi.get<HTTPResourceResponse<Item>>(`/products/${id}`);
      setData(result.data);
      setLoading(false);
    } catch (error) {
      // TODO: Handle error
    }
  };
  useEffect(() => {
    getData();
  }, [id]);

  if (!can(PERMISSION.MENU.CAN_GET_ITEM)) {
    pushNotification("You have no permissions to view this item.", {
      type: "warning",
    });
    return <Redirect to="/menu/item/list" />;
  }

  const onStatusUpdate = () => {
    getData();
    pushNotification("Product status updated successfully", {
      type: "success",
    });
  };

  if (loading) {
    return (
      <Grid gutter={0} className="menu-container">
        <Row>
          <Column>
            <Card page>
              <Skeleton parts={["cardHeaderAction", "divider", "labelField"]} />
            </Card>
            <Card page>
              <Skeleton parts={["cardHeaderAction", "divider", "labelField"]} />
            </Card>
            <Card page>
              <Skeleton parts={["cardHeaderAction", "divider", "labelField"]} />
            </Card>
            <Card page>
              <Skeleton parts={["cardHeaderAction", "divider", "labelField"]} />
            </Card>
          </Column>
        </Row>
      </Grid>
    );
  }

  return (
    <Grid gutter={0} className="menu-container">
      <Row>
        <Column>
          <div className="w-100 ui-flex between v-center pl-30 pr-20 pt-10">
            <div className="ui-flex v-center">
              <Typography h2>{data?.payload?.name}</Typography>
              <Badge
                leftIcon="Circle"
                iconSize={5}
                size="small"
                className={classNames({ "menu-inactive-badge": !data?.payload?.is_active }, "ml-30")}
              >
                {data?.payload?.is_active ? t("Active") : t("Inactive")}
              </Badge>
            </div>
            <ItemActions item={data && data?.payload} onChange={onStatusUpdate} />
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          {data?.payload && <GeneralInformation item={data?.payload} />}
          {data?.payload && <OutOfStockInformation refetchItem={getData} item={data?.payload} />}
          {data?.payload && <CategoryInformation item={data?.payload} />}
          {data?.payload && <ModifierInformation item={data?.payload} />}
          {data?.payload && <LabelInformation item={data?.payload} />}
        </Column>
      </Row>
    </Grid>
  );
};

export default ItemsManage;
