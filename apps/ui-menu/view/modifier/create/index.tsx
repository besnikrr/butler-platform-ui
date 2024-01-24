import { useContext, useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

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
  Icon,
  pushNotification,
  AppContext,
  FormGroup,
  useTranslation,
  LeavePageAlert,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  Modifier,
  ResourceResponse,
  UpdateModifierInput,
  baseModifierValidator,
  PERMISSION,
} from "@butlerhospitality/shared";

const ModifiersEditorView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<UpdateModifierInput>({
    resolver: yupResolver(baseModifierValidator),
    defaultValues: {
      options: [
        {
          name: "",
          price: undefined,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  const canCreateModifier = can(PERMISSION.MENU.CAN_CREATE_MODIFIER);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const onSubmit = async (data: UpdateModifierInput) => {
    setError("");
    try {
      setIsSubmitting(true);
      await menuServiceApi.post<ResourceResponse<Modifier>>(`/modifiers`, data);
      pushNotification(t("Modifier created successfully"), {
        type: "success",
      });
      history.push("/menu/modifier/list");
    } catch (e: any) {
      setError(e.message);
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

  if (!canCreateModifier) {
    pushNotification("You have no permissions to create modifier", {
      type: "warning",
    });
    return <Redirect to="/menu/modifier/list" />;
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("create_modifier")}</Typography>}>
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
                    <div className="mb-20" key={item.id}>
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
                    data-testid="add-option-btn"
                    size="small"
                    variant="ghost"
                    onClick={() => append({ name: "", price: undefined })}
                    leftIcon={<Icon type="Plus" size={14} />}
                  >
                    {t("add_option")}
                  </Button>
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
                onLeave={() => history.push("/menu/modifier/list")}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default ModifiersEditorView;
