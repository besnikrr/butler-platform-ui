import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Button,
  Icon,
  Typography,
  Row,
  Column,
  Card,
  FormControl,
  Divider,
  Input,
  Checkbox,
  Skeleton,
  ErrorMessage,
  FormGroup,
  AppContext,
  pushNotification,
  useTranslation,
  LeavePageAlert,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  UpdateModifierInput,
  Modifier,
  HTTPResourceResponse,
  baseModifierValidator,
  PERMISSION,
} from "@butlerhospitality/shared";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Redirect, useHistory, useParams } from "react-router-dom";

const ModifierManage = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HTTPResourceResponse<Modifier>>();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<UpdateModifierInput>({
    resolver: yupResolver(baseModifierValidator),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const canEditModifier = can(PERMISSION.MENU.CAN_UPDATE_MODIFIER);

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
      const result = await menuServiceApi.get<HTTPResourceResponse<Modifier>>(`/modifiers/${params.id}`);
      setData(result.data);

      if (result.data) {
        reset({
          name: result.data.payload?.name,
          options: result.data.payload?.options,
          multiselect: result.data.payload?.multiselect,
        });
      }
      setLoading(false);
    };
    getData();
  }, [params.id]);

  const onSubmit = async (submitData: UpdateModifierInput) => {
    setError("");
    try {
      setIsSubmitting(true);
      await menuServiceApi.put<HTTPResourceResponse<Modifier>>(`/modifiers/${params.id}`, submitData);
      pushNotification(t("Modifier updated successfully"), {
        type: "success",
      });
      history.push(`/menu/modifier/view/${params.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEditModifier) {
    pushNotification("You have no permissions to update modifier", {
      type: "warning",
    });
    return <Redirect to="/menu/modifier/list" />;
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
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{data?.payload?.name}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("modifier_name")}*`}>
                    <Input
                      data-testid="input-modifier-name"
                      placeholder={t("enter_modifier_name")}
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </FormControl>
                  <FormControl className="my-20">
                    <Checkbox
                      data-testid="checkbox-modifier-multiselect"
                      {...register("multiselect")}
                      label={t("multiselect")}
                    />
                  </FormControl>
                  {(fields || []).map((item, index) => (
                    <div className="mb-20" key={index}>
                      <div className="mb-10 ui-flex v-center between">
                        <Typography>
                          {t("option")} {index + 1}
                        </Typography>
                        {fields.length !== 1 && (
                          <Button variant="danger-ghost" size="small" onClick={() => remove(index)} iconOnly>
                            <Icon type="Delete" size={18} />
                          </Button>
                        )}
                      </div>
                      <FormGroup key={item.id}>
                        <FormControl label={`${t("name")}*`}>
                          <Input
                            data-testid="modifier-option-name"
                            placeholder={t("enter_option_name")}
                            {...register(`options.${index}.name`)}
                            error={errors.options?.[index]?.name?.message}
                          />
                        </FormControl>
                        <FormControl label={`${t("price")}*`}>
                          <Input
                            data-testid="modifier-option-price"
                            placeholder="0.00"
                            prefixNode="$"
                            step=".01"
                            {...register(`options.${index}.price`)}
                            error={errors.options?.[index]?.price?.message}
                          />
                        </FormControl>
                      </FormGroup>
                    </div>
                  ))}
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => append({ name: "", price: undefined })}
                    leftIcon={<Icon type="Plus" size={14} />}
                  >
                    {t("add_option")}
                  </Button>
                  {errors.options && !Array.isArray(errors.options) && (
                    <ErrorMessage className="mt-20" error={(errors.options as any).message} />
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
                        onClick={() => {
                          onLeavePage("/menu/modifier/list");
                        }}
                        type="button"
                        variant="ghost"
                      >
                        {t("cancel")}
                      </Button>
                      <Button data-testid="modifier-create-btn" type="submit" variant="primary" disabled={isSubmitting}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/menu/modifier/list`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default ModifierManage;
