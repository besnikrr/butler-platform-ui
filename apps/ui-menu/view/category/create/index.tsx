import { useContext, useState, useEffect } from "react";
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
  FormGroup,
  ErrorMessage,
  AppContext,
  pushNotification,
  useTranslation,
  LeavePageAlert,
  Radio,
  Skeleton,
  DatePicker,
  LookupField,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppEnum,
  Category,
  CreateCategoryInput,
  baseCategoryValidator,
  PERMISSION,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import { AxiosError } from "axios";
import { parseDateToString } from "../../../util";

const CategoryEditorView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<HTTPResourceResponse<Category[]>>();
  const [loading, setLoading] = useState(true);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isSubcategory, setIsSubcategory] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [dateError, setDateError] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateCategoryInput>({
    resolver: yupResolver(baseCategoryValidator),
    defaultValues: {
      isSubcategory: false,
    },
  });
  const canGetCategories = can(PERMISSION.MENU.CAN_GET_CATEGORIES);
  const canCreateCategories = can(PERMISSION.MENU.CAN_CREATE_CATEGORY);

  const onSubmit = async (data: CreateCategoryInput) => {
    setError("");
    if (data?.start_date && data?.end_date) {
      if (Date.parse(data.start_date) === Date.parse(data.end_date)) {
        setDateError({
          start: "Start date can not be equal with end date!",
          end: "End date can not be equal with start date!",
        });
        return;
      }
      if (Date.parse(data.start_date) > Date.parse(data.end_date)) {
        setDateError({
          start: "Start date can not be after end date!",
          end: "End date can not be before start date!",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      let payloadData = {};
      if (isSubcategory) {
        payloadData = {
          name: data.name,
          start_date: parseDateToString(data.start_date) || null,
          end_date: parseDateToString(data.end_date) || null,
          parent_category_id: parseInt(data.categoryId as string, 10),
        };
      } else {
        payloadData = {
          name: data.name,
          start_date: parseDateToString(data.start_date) || null,
          end_date: parseDateToString(data.end_date) || null,
        };
      }

      await menuServiceApi.post<Category>("/categories", payloadData);
      pushNotification(t("Category created successfully"), {
        type: "success",
      });
      history.push(`/menu/category/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
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

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Category[]>>(`/categories?type[0]=category`);
      setCategories(result.data);
      setLoading(false);
    };
    if (canGetCategories) {
      getData();
    } else {
      setLoading(false);
    }
  }, []);

  const toggleCategoryType = (e: any) => {
    const categoryType = e.target.value === "subcategory";
    setValue("isSubcategory", categoryType);
    setIsSubcategory(categoryType);
  };

  if (!canCreateCategories) {
    pushNotification("You have no permissions to create category", {
      type: "warning",
    });
    return <Redirect to="/menu/category/list" />;
  }

  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField", "labelField"]} />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("create_new_category")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("category_name")}*`} className="mt-20">
                    <Input
                      data-testid="input-category-name"
                      placeholder={t("enter_category_name")}
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </FormControl>
                  <FormGroup className="mt-10">
                    <FormControl label={t("Start Date")}>
                      <DatePicker
                        data-testid="input-start-time"
                        inputProps={{
                          ...register("start_date"),
                          placeholder: t("Start Date"),
                          error: dateError.start,
                        }}
                      />
                    </FormControl>
                    <FormControl label={t("End")}>
                      <DatePicker
                        data-testid="input-end-time"
                        inputProps={{
                          ...register("end_date"),
                          placeholder: t("End Date"),
                          error: dateError.end,
                        }}
                      />
                    </FormControl>
                  </FormGroup>
                  <Row>
                    <Column size={3}>
                      <FormGroup className="mt-10 mb-20">
                        <FormControl label={t("category")} className="mt-10 col-3">
                          <Radio
                            data-testid="radio-is-subcategory"
                            value="category"
                            name="category_type"
                            checked={!isSubcategory}
                            onChange={toggleCategoryType}
                          />
                        </FormControl>
                        {canGetCategories && (
                          <FormControl label={t("subcategory")} className="mt-10 subcategory-label">
                            <Radio
                              data-testid="radio-is-subcategory"
                              value="subcategory"
                              name="category_type"
                              checked={isSubcategory}
                              onChange={toggleCategoryType}
                            />
                          </FormControl>
                        )}
                      </FormGroup>
                    </Column>
                  </Row>
                  {isSubcategory && (
                    <FormControl label={`${t("category")}*`}>
                      <LookupField<Category>
                        value=""
                        hasSearch
                        selectProps={register(`categoryId`)}
                        placeholder={t("please_select_category")}
                        error={errors.categoryId?.message}
                        initData={categories}
                        onQuery={(params) =>
                          menuServiceApi.get(`/categories?type[0]=category&page=${params.page}&name=${params.filter}`)
                        }
                      />
                    </FormControl>
                  )}
                  {error && (
                    <div className="mt-20">
                      <ErrorMessage error={error} />
                    </div>
                  )}
                  <Divider vertical={30} />
                  <div className="form-bottom-action">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onLeavePage(`/menu/category/list`);
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button data-testid="category-submit" type="submit" variant="primary" disabled={isSubmitting}>
                      {t("save")}
                    </Button>
                  </div>
                </form>
              </Column>
            </Row>
          </Card>
        </Column>
        <LeavePageAlert
          modal={leaveModal}
          setModal={setLeaveModal}
          onLeave={() => history.push(`/menu/category/list`)}
        />
      </Row>
    </Grid>
  );
};

export default CategoryEditorView;
