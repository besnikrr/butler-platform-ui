/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Column,
  useApi,
  Divider,
  ErrorMessage,
  FormControl,
  Grid,
  Row,
  Typography,
  Modal,
  Skeleton,
  useTranslation,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  AppEnum,
  Category,
  CreateUpdateItemInput,
  Item,
  ItemRelations,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import DeleteResourceContent from "../../../component/DeleteResourceContent";
import { MultiSelect, Option } from "../../../component/multiselect";

interface SelectedSubcategoriesType {
  [key: string]: string[];
}

export default ({ item }: any): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categories, setCategories] = useState<HTTPResourceResponse<Category[]>>();
  const [closeModal, setCloseModal] = useState<boolean>();
  const [, setDeleteConfirmation] = useState<string>();
  const [itemRelations, setItemRelations] = useState<ItemRelations>();
  const [, setSelectedSubCategories] = useState<SelectedSubcategoriesType>({});
  const { register, handleSubmit, setValue } = useForm<CreateUpdateItemInput>();

  const modalContentText = {
    title: t("update_item_categories"),
    subtitle: t("change_category_of_item_confirm"),
    info: t("remove_category_affected_warning"),
  };

  const setDefaultSelected = () => {
    const subIds: any = {};
    item.categories.forEach(({ id, parent_category }: any) => {
      if (subIds[parent_category.id]) {
        subIds[`${parent_category.id}`].push(`${id}`);
      } else {
        subIds[`${parent_category.id}`] = [`${id}`];
      }
    });

    setSelectedSubCategories(subIds);
    setValue("categories", subIds);
  };

  useEffect(() => {
    const getCategoryData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Category[]>>("/categories?grouped=true");
      setCategories(result.data);
    };

    getCategoryData();
    setDefaultSelected();
  }, []);

  const updateItem = async ({ categories }: any, nonce?: string) => {
    setIsSubmitting(true);

    const data = {
      categories: Object.values(categories).reduce(
        (acc: number[], val: any) => [...acc, ...val.map((a: string) => +a)],
        []
      ),
      nonce,
    };

    if (data.categories.length === 0) {
      setCategoryError(t("subcategory_not_selected_error"));
      setIsSubmitting(false);
      return;
    }

    try {
      await menuServiceApi.put<HTTPResourceResponse<Item>>(`/products/type/categories/${item.id}`, data);
      pushNotification(t("Item updated successfully"), {
        type: "success",
      });
      history.push(`/menu/item/view/${item.id}`);
    } catch (e: any) {
      if (e.response.data) {
        setError(e.response.data.message);
      }
      if (e.response.data.result) {
        setItemRelations(e.response.data.result);
        setCloseModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    await updateItem(data);
  };

  const submitFromModal = async (data: any, nonce?: string) => {
    await updateItem(data, nonce);
  };

  if (!categories) {
    return (
      <Grid gutter={0}>
        <Skeleton parts={["header"]} className="pt-10" />
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField", "labelField", "labelField"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("update_item_subcategories")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {(categories?.payload || []).length > 0 ? (
                    (categories?.payload || []).map((category: Category, index: number) => (
                      <FormControl key={index} label={category.name}>
                        <MultiSelect
                          selectProps={register(`categories.[${category.id}]`)}
                          placeholder={t("select_subcategories")}
                          error={categoryError}
                        >
                          {(category.subcategories || []).map((subcategory: any) => (
                            <Option value={subcategory.id} key={subcategory.id}>
                              {subcategory.name}
                            </Option>
                          ))}
                        </MultiSelect>
                      </FormControl>
                    ))
                  ) : (
                    <Typography>{t("no_categories_found")}</Typography>
                  )}
                  {error && (
                    <div className="mt-20">
                      <ErrorMessage error={error} />
                    </div>
                  )}
                  <Divider vertical={30} />
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          history.push(`/menu/item/view/${item.id}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button data-testid="item-submit" variant="primary" type="submit" disabled={isSubmitting}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </Row>
          </Card>
        </Column>
        {itemRelations && !closeModal && (
          <Modal visible onClose={() => setCloseModal(true)} style={{ minWidth: 500 }}>
            <DeleteResourceContent
              title={modalContentText.title}
              contentText={modalContentText}
              isLoading={false}
              relations={itemRelations}
              deleteConfirmation={(event) => setDeleteConfirmation(event)}
              keys={["menus"]}
              onClose={() => setCloseModal(true)}
              onDelete={(nonce) => submitFromModal(nonce)}
            />
          </Modal>
        )}
      </Row>
    </Grid>
  );
};
