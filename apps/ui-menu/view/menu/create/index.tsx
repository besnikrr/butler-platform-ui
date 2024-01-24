import React, { useContext, useEffect, useReducer, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import {
  Grid,
  Row,
  Column,
  Card,
  Typography,
  Divider,
  Button,
  useApi,
  ErrorMessage,
  Input,
  Skeleton,
  AppContext,
  pushNotification,
  LeavePageAlert,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, PERMISSION, HTTPResourceResponse } from "@butlerhospitality/shared";
import { AxiosError } from "axios";
import { submitDataMapper } from "../common/util";
import { CategoryCollapsible } from "../common/category-collapsible";
import menuReducer from "../common/menu-reducer";

const MenuEditorView = (): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const [menuState, dispatchMenuAction] = useReducer(menuReducer, {
    addedItems: {},
    itemsToSelect: {},
    categories: {},
    loading: true,
    error: null,
  });
  const { can } = useContext(AppContext);

  const history = useHistory();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const canCreateMenu = can(PERMISSION.MENU.CAN_CREATE_MENU);

  const onLeavePage = (url: string) => {
    if (name) {
      setLeaveModal(true);
    } else {
      history.push(url);
    }
  };

  useEffect(() => {
    const getSubcategoryData = async (): Promise<void> => {
      try {
        const result = await menuServiceApi.get<HTTPResourceResponse<any>>("/products?categorized=true");
        dispatchMenuAction({
          type: "set-menu",
          payload: {
            addedItems: {},
            categories: result.data.payload,
            loading: false,
          },
        });
      } catch (err: any) {
        dispatchMenuAction({
          type: "set-menu",
          payload: { error: err.message, loading: false },
        });
      }
    };
    getSubcategoryData();
  }, []);

  const updateItems = (payload: any) => {
    dispatchMenuAction({ type: "add-update-item", payload });
  };

  const removeItem = (payload: any) => {
    dispatchMenuAction({ type: "remove-item", payload });
  };

  const addItem = (payload: any) => {
    dispatchMenuAction({ type: "add-item", payload });
  };

  const reorderSubcategory = (payload: any) => {
    dispatchMenuAction({ type: "reorder-subcategory", payload });
  };

  const create = async () => {
    try {
      const data = submitDataMapper(menuState);
      if (name === "") {
        throw new Error(t("enter_menu_name_error"));
      }

      if (data.length === 0) {
        throw new Error(t("add_item_of_subcagegory_error"));
      }
      setIsSubmitting(true);
      await menuServiceApi.post("", {
        name,
        products: data,
      });
      pushNotification(t("Menu created successfully"), {
        type: "success",
      });
      history.push("/menu/menu/list");
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canCreateMenu) {
    pushNotification("You have no permissions to create menu.", {
      type: "warning",
    });
    return <Redirect to="/menu/menu/list" />;
  }
  if (menuState.loading) {
    return (
      <Grid gutter={0}>
        <Card>
          <Skeleton parts={["cardHeaderAction", "divider", "field", "block"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("create_new_menu")}</Typography>}>
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
                  <Button variant="ghost" onClick={() => onLeavePage(`/menu/menu/list`)}>
                    {t("cancel")}
                  </Button>
                  <Button variant="primary" className="ml-10" disabled={isSubmitting} onClick={create}>
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
      </Row>
    </Grid>
  );
};

export default MenuEditorView;
