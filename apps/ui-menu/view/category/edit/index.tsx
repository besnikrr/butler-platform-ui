import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Grid,
  Button,
  Typography,
  Row,
  Column,
  Card,
  Input,
  FormControl,
  Divider,
  useApi,
  FormGroup,
  Skeleton,
  ErrorMessage,
  AppContext,
  pushNotification,
  useTranslation,
  LeavePageAlert,
  DatePicker,
  LookupField,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  Category,
  HTTPResourceResponse,
  PERMISSION,
  UpdateCategoryInput,
  baseCategoryValidator,
} from "@butlerhospitality/shared";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { parseDateToISOString, parseDateToString } from "../../../util";

const CategoryManage = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<Category>();
  const [categories, setCategories] = useState<HTTPResourceResponse<Category[]>>();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [dateError, setDateError] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryInput>({
    resolver: yupResolver(baseCategoryValidator),
  });
  const canGetCategories = can(PERMISSION.MENU.CAN_GET_CATEGORIES);
  const canEditCategory = can(PERMISSION.MENU.CAN_UPDATE_CATEGORY);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const result = await menuServiceApi.get<HTTPResourceResponse<Category>>(`/categories/${params.id}`);
      setData(result.data.payload);

      if (result.data.payload?.parent_category_id) {
        const resultCategories = await menuServiceApi.get<HTTPResourceResponse<Category[]>>(
          `/categories?type[0]=category`
        );
        setCategories(resultCategories.data);
      }

      setLoading(false);
      reset({
        isSubcategory: !!result.data.payload?.parent_category_id,
        name: result.data.payload?.name,
        start_date: parseDateToISOString(result.data?.payload?.start_date),
        end_date: parseDateToISOString(result.data?.payload?.end_date),
        categoryId: result.data.payload?.parent_category_id as string,
      });
    };

    getData();
  }, [params.id]);

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

  const onSubmit = async (formData: UpdateCategoryInput) => {
    setError("");

    if (formData?.start_date && formData?.end_date) {
      if (Date.parse(formData.start_date) === Date.parse(formData.end_date)) {
        setDateError({
          start: "Start date can not be equal with end date!",
          end: "End date can not be equal with start date!",
        });
        return;
      }
      if (Date.parse(formData.start_date) > Date.parse(formData.end_date)) {
        setDateError({
          start: "Start date can not be after end date!",
          end: "End date can not be before start date!",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        start_date: parseDateToString(formData.start_date) || null,
        end_date: parseDateToString(formData.end_date) || null,
        ...(data?.parent_category_id && {
          parent_category_id: parseInt(formData.categoryId as string, 10),
        }),
      };

      await menuServiceApi.put<Category>(`/categories/${params.id}`, payload);
      pushNotification(t("Category updated successfully"), {
        type: "success",
      });
      history.push(`/menu/category/view/${params.id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEditCategory || (data?.parent_category_id && !canGetCategories)) {
    pushNotification("You have no permissions to update category", {
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
          <Card
            className="menu-content"
            page
            header={
              <div>
                <Typography h2>{data?.name}</Typography>
              </div>
            }
          >
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("category_name")}*`}>
                    <Input placeholder={t("enter_category_name")} {...register("name")} error={errors.name?.message} />
                  </FormControl>
                  <FormGroup className="mt-10">
                    <FormControl label={t("start_period")}>
                      <DatePicker
                        data-testid="input-start-time"
                        inputProps={{
                          ...register("start_date"),
                          error: dateError.start,
                          placeholder: t("Start Date"),
                        }}
                      />
                    </FormControl>
                    <FormControl label={t("end")}>
                      <DatePicker
                        data-testid="input-end-time"
                        inputProps={{
                          ...register("end_date"),
                          error: dateError.end,
                          placeholder: t("End Date"),
                        }}
                      />
                    </FormControl>
                  </FormGroup>
                  {data?.parent_category_id && (
                    <FormControl label={`${t("category")}*`} className="mt-10">
                      <LookupField<Category>
                        value=""
                        hasSearch
                        selectProps={register(`categoryId`)}
                        placeholder={t("please_select_category")}
                        error={errors.categoryId?.message}
                        initData={categories}
                        onQuery={(queryParams) =>
                          menuServiceApi.get(
                            `/categories?type[0]=category&page=${queryParams.page}&name=${queryParams.filter}`
                          )
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
                        onLeavePage(`/menu/category/view/${params.id}`);
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {t("save")}
                    </Button>
                  </div>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/menu/category/list`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default CategoryManage;
