import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Row,
  Column,
  Card,
  Input,
  Typography,
  FormControl,
  Divider,
  useApi,
  Checkbox,
  ErrorMessage,
  Select,
  Option,
  AppContext,
  pushNotification,
  useTranslation,
  LeavePageAlert,
  LookupField,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import {
  AppEnum,
  Item,
  HTTPResourceResponse,
  Category,
  Modifier,
  CreateUpdateItemInput,
  generalInformationValidator,
  PERMISSION,
  Label,
} from "@butlerhospitality/shared";
import { Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import InputFile from "../../../component/InputFile";

export default (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUpdateItemInput>({
    resolver: yupResolver(generalInformationValidator),
    defaultValues: {
      image: undefined,
    },
  });
  const [categories, setCategories] = useState<HTTPResourceResponse<Category[]>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [modifiers, setModifiers] = useState<HTTPResourceResponse<Modifier[]>>();
  const [labels, setLabels] = useState<HTTPResourceResponse<Label[]>>();
  const [presignedUrl, setPresignedUrl] = useState<null | any>(null);
  const canCreateItem = can(PERMISSION.MENU.CAN_CREATE_ITEM);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  useEffect(() => {
    // TODO: promise.all requests
    const getPresignedUrl = async (): Promise<void> => {
      const presignedUrlRes = await menuServiceApi.get("/products/upload/presign-url");
      setPresignedUrl(presignedUrlRes.data);
    };
    const getCategoryData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Category[]>>("/categories?grouped=true");
      setCategories(result.data);
    };

    const getModifiers = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Modifier[]>>("/modifiers");
      setModifiers(result.data);
    };

    const getLabels = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Label[]>>("/labels");
      setLabels(result.data);
    };

    if (canCreateItem) {
      getCategoryData();
      getModifiers();
      getLabels();
      getPresignedUrl();
    }
  }, []);

  const renderItemCategoryOptions = () => {
    return (categories?.payload || []).map((category: Category, index: number) => (
      <FormControl key={index} label={category.name}>
        <Select
          multiple
          selectProps={register(`categories.[${category.id}]`)}
          placeholder={t("select_subcategories")}
          error={categoryError}
        >
          {(category.subcategories || []).map((subcategory: any) => (
            <Option value={subcategory.id} key={subcategory.id}>
              {subcategory.name}
            </Option>
          ))}
        </Select>
      </FormControl>
    ));
  };

  const renderModifiers = () => (
    <FormControl label="Modifiers">
      <LookupField
        multiple
        selectProps={{
          ...register(`modifiers`),
        }}
        placeholder="Select Modifiers"
        initData={modifiers}
        onQuery={(params) => {
          return menuServiceApi.get<HTTPResourceResponse<Modifier[]>>(
            `/modifiers?page=${params.page}&name=${params.filter}`
          );
        }}
      />
    </FormControl>
  );

  const renderLabels = () => (
    <FormControl label="Labels">
      <LookupField
        multiple
        selectProps={{
          ...register(`labels`),
        }}
        placeholder="Select Labels"
        initData={labels}
        onQuery={(params) => {
          return menuServiceApi.get<HTTPResourceResponse<Label[]>>(`/labels?page=${params.page}&name=${params.filter}`);
        }}
      />
    </FormControl>
  );

  const onSubmit = async (data: CreateUpdateItemInput) => {
    const categoriesRes = (data.categories as any)
      .reduce((acc: any, curr: any) => acc.concat(curr), [])
      .map((id: string) => Number(id))
      .filter((id: number) => id);

    if (!categoriesRes.length) {
      setCategoryError(t("subcategory_not_selected_error"));
      setIsSubmitting(false);
      return;
    }

    setError("");
    try {
      setIsSubmitting(true);
      await axios.put(presignedUrl.url, data.image);
      const submitData = {
        ...data,
        categories: categoriesRes,
        modifiers: data.modifiers.map((item) => Number(item)) as any,
        image: presignedUrl.imagekey,
        labels: data.labels.map((item) => Number(item)) as any,
      };

      const saveResponse = await menuServiceApi.post<HTTPResourceResponse<Item>>("/products", submitData);
      pushNotification(t("Item created successfully"), {
        type: "success",
      });
      history.push(`/menu/item/view/${saveResponse.data.payload?.id}`);
    } catch (err: any) {
      setError(t("could_not_create_item"));
      // TODO log error
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      setLeaveModal(true);
    } else {
      history.push(url);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  if (!canCreateItem) {
    pushNotification("You have no permissions to create item.", {
      type: "warning",
    });
    return <Redirect to="/menu/item/list" />;
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("create_new_item")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Typography h2 className="mb-20">
                    {t("general_information")}
                  </Typography>
                  <FormControl label={`${t("item_name")}*`}>
                    <Input
                      data-testid="input-item-name"
                      placeholder={t("enter_item_name")}
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </FormControl>
                  <FormControl label={`${t("item_price")}*`}>
                    <Input
                      data-testid="input-item-price"
                      type="number"
                      step=".01"
                      placeholder="0.00"
                      prefixNode="$"
                      {...register("price")}
                      error={errors.price?.message}
                    />
                  </FormControl>
                  <FormControl label={t("item_description")}>
                    <Input
                      data-testid="input-item-description"
                      placeholder={t("enter_item_description")}
                      {...register("description")}
                      error={errors.description?.message}
                    />
                  </FormControl>
                  <FormControl>
                    <Checkbox
                      data-testid="input-needs_cutlery"
                      {...register("needs_cutlery")}
                      label={t("needs_cutlery")}
                    />
                  </FormControl>
                  <FormControl label="">
                    <Checkbox data-testid="input-guest_view" {...register("guest_view")} label={t("guest_view")} />
                  </FormControl>
                  <FormControl>
                    <Checkbox data-testid="input-raw_food" {...register("raw_food")} label={t("raw_food")} />
                  </FormControl>
                  <FormControl label={`${t("image")}*`}>
                    <InputFile
                      data-testid="input-item-imagefile"
                      {...register("image")}
                      error={errors.image?.message}
                    />
                  </FormControl>
                  <Divider />
                  <Typography h2 className="mb-20">
                    {t("categories")}
                  </Typography>
                  {categories && categories.payload && categories.payload.length > 0 ? (
                    renderItemCategoryOptions()
                  ) : (
                    <Typography>{t("no_categories_found")}</Typography>
                  )}
                  <Divider />
                  <Typography h2 className="mb-10">
                    {t("modifiers")}
                  </Typography>
                  {modifiers && modifiers.payload && modifiers.payload.length > 0 ? (
                    renderModifiers()
                  ) : (
                    <Typography muted>{t("no_modifiers_found")}</Typography>
                  )}
                  <Divider />
                  <Typography h2 className="mb-10">
                    {t("labels")}
                  </Typography>
                  {labels && labels.payload && labels.payload.length > 0 ? (
                    renderLabels()
                  ) : (
                    <Typography muted>{t("no_labels_found")}</Typography>
                  )}
                  <Divider vertical={30} />
                  {error && (
                    <div className="my-20">
                      <ErrorMessage error={error} />
                    </div>
                  )}
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onLeavePage(`/menu/item/list`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button data-testid="item-submit" type="submit" variant="primary" disabled={isSubmitting}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/menu/item/list`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};
