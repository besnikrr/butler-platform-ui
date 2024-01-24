import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  ErrorMessage,
  pushNotification,
  AppContext,
  useTranslation,
  LeavePageAlert,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, Label, ResourceResponse, baseLabelValidator, PERMISSION } from "@butlerhospitality/shared";

const LabelCreate = (): JSX.Element => {
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
    watch,
  } = useForm<Label>({
    resolver: yupResolver(baseLabelValidator),
  });

  const canCreateLabel = can(PERMISSION.MENU.CAN_CREATE_LABEL);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const onSubmit = async (data: Label) => {
    setError("");
    try {
      setIsSubmitting(true);
      await menuServiceApi.post<ResourceResponse<Label>>(`/labels`, data);
      history.push("/menu/label/list");
    } catch (e: any) {
      setError(e.response.data.message);
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

  if (!canCreateLabel) {
    pushNotification("You have no permissions to create label", {
      type: "warning",
    });
    return <Redirect to="/menu/label/list" />;
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("create_label")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("label_name")}*`}>
                    <Input placeholder={t("enter_label_name")} {...register("name")} error={errors.name?.message} />
                  </FormControl>
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
                          onLeavePage("/menu/label/list");
                        }}
                        type="button"
                        variant="ghost"
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push("/menu/label/list")}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default LabelCreate;
