import React, { useContext, useEffect, useReducer, useState } from "react";
import { useHistory, useParams, Redirect } from "react-router-dom";
import {
  Button,
  Card,
  Column,
  useApi,
  Divider,
  ErrorMessage,
  Grid,
  Input,
  Row,
  Typography,
  Skeleton,
  Modal,
  pushNotification,
  AppContext,
  useTranslation,
  LeavePageAlert,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosError } from "axios";
import { CategoryCollapsible } from "../common/category-collapsible";
import menuReducer from "../common/menu-reducer";
import { mutateMapSortOrder, submitDataMapper } from "../common/util";
import PriceMultiplier from "../price-multiplier";

interface MenuEditProps {
  className?: string;
}

const MenuEdit: React.FC<MenuEditProps> = () => {
  const [menuState, dispatchMenuAction] = useReducer(menuReducer, {
    addedItems: {},
    itemsToSelect: {},
    categories: {},
    loading: true,
    error: null,
  });
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const { id }: any = useParams();
  const history = useHistory();
  const [error, setError] = useState<string>("");
  const [closePriceMultiplier, setClosePriceMultiplier] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [published_at, setPublishedAt] = useState();
  const canUpdateMenu = can(PERMISSION.MENU.CAN_UPDATE_MENU);

  useEffect(() => {
    const getCategoryData = async (): Promise<void> => {
      try {
        const result = await menuServiceApi.get<HTTPResourceResponse<any>>(`/${id}?formatted=true`);
        const rwresult = await menuServiceApi.get<HTTPResourceResponse<any>>("/products?categorized=true");
        const { categories } = result.data.payload;
        const rwCategories = rwresult.data.payload;
        const data: any = { ...categories };
        mutateMapSortOrder(data, rwCategories);
        setName(result.data.payload.name);
        setPublishedAt(result.data.payload.published_at);
        dispatchMenuAction({
          type: "set-menu",
          payload: {
            menu: data,
            addedItems: categories,
            categories: rwCategories,
            loading: false,
          },
        });
      } catch (e: any) {
        dispatchMenuAction({
          type: "set-menu",
          payload: { error: e.message, loading: false },
        });
      }
    };
    getCategoryData();
  }, [id]);

  const updateItems = (payload: any) => {
    dispatchMenuAction({ type: "add-update-item", payload });
  };

  const removeItem = (payload: any) => {
    dispatchMenuAction({ type: "remove-item", payload });
  };

  const addItem = (payload: any) => {
    dispatchMenuAction({ type: "add-item", payload });
  };

  const save = async () => {
    try {
      setError("");
      const data = submitDataMapper(menuState);
      if (name === "") {
        throw new Error(t("enter_menu_name_error"));
      }
      if (data.length === 0) {
        throw new Error(t("add_item_of_subcagegory_error"));
      }
      setIsSubmitting(true);
      await menuServiceApi.put(`/${id}`, {
        products: data,
        name,
        published_at,
      });

      pushNotification(t("Menu updated successfully"), {
        type: "success",
      });
      history.push(`/menu/menu/view/${id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reorderSubcategory = (payload: any) => {
    dispatchMenuAction({ type: "reorder-subcategory", payload });
  };

  const onLeavePage = (url: string) => {
    if (name) {
      setLeaveModal(true);
    } else {
      history.push(url);
    }
  };

  if (!canUpdateMenu) {
    pushNotification("You have no permissions to edit menu.", {
      type: "warning",
    });
    return <Redirect to="/menu/menu/list" />;
  }

  if (menuState.loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["title", "divider", "field", "title", "block"]} />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("edit_menu")}</Typography>}>
            <Row gutterY={0}>
              <Column size={6} className="pt-10">
                <div className="ui-flex v-center">
                  <Typography>{t("menu_name")}*</Typography>
                  <Input
                    className="ml-10"
                    style={{ width: 300 }}
                    placeholder={t("menu_name")}
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                </div>
              </Column>
            </Row>
            <Row>
              <Column size={6}>
                <Typography h2 className="my-10">
                  {t("menu_items")}
                </Typography>
              </Column>
              <Column size={6} className="ui-flex end v-center">
                <Button onClick={() => setClosePriceMultiplier(false)} variant="ghost">
                  {t("price_multiplier")}
                </Button>
              </Column>
            </Row>
            <Row cols={1}>
              <Column>
                {(Object.keys(menuState.categories) || []).map((key: string) => {
                  return (
                    <CategoryCollapsible
                      key={key}
                      className="menu-category-collapsible"
                      categoryId={key}
                      menuState={menuState}
                      updateItems={updateItems}
                      removeItem={removeItem}
                      addItem={addItem}
                      reorderSubcategory={reorderSubcategory}
                      itemEdit
                    />
                  );
                })}
                {error && (
                  <div className="mt-20">
                    <ErrorMessage error={error} />
                  </div>
                )}
                <Divider vertical={30} />
              </Column>
              <Column className="mt-0">
                <div className="ui-flex end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLeavePage(`/menu/menu/list`);
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button variant="primary" disabled={isSubmitting} className="ml-10" onClick={save}>
                    {t("save")}
                  </Button>
                </div>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/menu/menu/list`)}
              />
            </Row>
          </Card>
        </Column>
        {!closePriceMultiplier && (
          <Modal visible onClose={() => setClosePriceMultiplier(true)} style={{ minWidth: 500 }}>
            <PriceMultiplier closeModal={() => setClosePriceMultiplier(true)} menuState={menuState} />
          </Modal>
        )}
      </Row>
    </Grid>
  );
};

export default MenuEdit;
