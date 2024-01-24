import { useContext, useEffect, useState } from "react";
import { AppEnum, Item, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AppContext, Card, Grid, pushNotification, Skeleton, useApi, useTranslation } from "@butlerhospitality/ui-sdk";
import { Redirect, useParams } from "react-router-dom";
import EditCategories from "./categories";
import EditGeneralInformation from "./general-information";
import EditModifiers from "./modifiers";
import EditLabels from "./labels";

export enum EditType {
  CATEGORY = "category",
  GENERAL_INFORMATION = "general-information",
  MODIFIER = "modifier",
  LABEL = "label",
}

export default (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const params = useParams<{ id: string; type: EditType }>();
  const [data, setData] = useState<HTTPResourceResponse<Item>>();
  const [loading, setLoading] = useState(true);

  const renderByEditType = (editType: EditType, item: Item) => {
    switch (editType) {
      case EditType.GENERAL_INFORMATION:
        return <EditGeneralInformation item={item} />;
      case EditType.CATEGORY:
        return <EditCategories item={item} />;
      case EditType.MODIFIER:
        return <EditModifiers item={item} />;
      case EditType.LABEL:
        return <EditLabels item={item} />;
      default:
        return <>{t("not_found")}</>;
    }
  };

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Item>>(`/products/${params.id}`);
      setData(result.data);
      setLoading(false);
    };
    getData();
  }, [params.id]);

  const editView = (): JSX.Element => {
    return data?.payload ? renderByEditType(params.type, data?.payload) : <></>;
  };

  if (!can(PERMISSION.MENU.CAN_GET_ITEM)) {
    pushNotification("You have no permissions to view this item.", {
      type: "warning",
    });
    return <Redirect to="/menu/item/list" />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField", "labelField", "labelField"]} />
        </Card>
      </Grid>
    );
  }
  return editView();
};
