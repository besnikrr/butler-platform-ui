import { useContext, useEffect, useState } from "react";
import {
  useApi,
  Grid,
  Button,
  Typography,
  Row,
  Column,
  Card,
  FormControl,
  Divider,
  Input,
  Skeleton,
  ErrorMessage,
  AppContext,
  pushNotification,
  useTranslation,
  LeavePageAlert,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, Label, HTTPResourceResponse, baseLabelValidator, PERMISSION } from "@butlerhospitality/shared";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Redirect, useHistory, useParams } from "react-router-dom";

const LabelManage = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HTTPResourceResponse<Label>>();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Label>({
    resolver: yupResolver(baseLabelValidator),
  });

  const canEditLabel = can(PERMISSION.MENU.CAN_UPDATE_LABEL);

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
      const result = await menuServiceApi.get<HTTPResourceResponse<Label>>(`/labels/${params.id}`);
      setData(result.data);

      // TODO: check if needed
      if (result.data) {
        reset({
          name: result.data.payload?.name,
        });
      }
      setLoading(false);
    };
    getData();
  }, [params.id]);

  const onSubmit = async (submitData: Label) => {
    setError("");
    try {
      setIsSubmitting(true);
      await menuServiceApi.put<HTTPResourceResponse<Label>>(`/labels/${params.id}`, submitData);
      history.push(`/menu/label/view/${params.id}`);
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canEditLabel) {
    pushNotification("You have no permissions to update label", {
      type: "warning",
    });
    return <Redirect to="/menu/label/list" />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "labelField"]} />
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
                onLeave={() => history.push(`/menu/label/list`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default LabelManage;
