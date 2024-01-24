import {
  Button,
  Card,
  Column,
  ErrorMessage,
  FormControl,
  Grid,
  Row,
  Toggle,
  Typography,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useEffect, useState } from "react";
import { HubV2, ResourceErrorResponse } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useFetchHub, useUpdateHub } from "../../../store/hub";
import { isErrorType } from "../../../utils";

const EditExpeditorSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [error, setError] = useState<ResourceErrorResponse>();
  const { register, reset, handleSubmit } = useForm<HubV2>({});
  const { data: hubData } = useFetchHub({
    id: params.id,
  });
  const {
    mutateAsync: updateHub,
    isLoading: isUpdateHubLoading,
    isError: isUpdateHubError,
  } = useUpdateHub(params.id);

  useEffect(() => {
    reset({
      ...hubData?.payload,
      has_expeditor_app_enabled: hubData?.payload?.has_expeditor_app_enabled,
    });
  }, [hubData, reset]);

  const onSubmit = async (data: HubV2) => {
    try {
      await updateHub({
        name: data?.name,
        tax_rate: data?.tax_rate,
        has_expeditor_app_enabled: data?.has_expeditor_app_enabled,
        color: hubData?.payload?.color,
      });
      history.push(`/network/hub/view/${params.id}`);
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={<Typography h2>{t("Expeditor")}</Typography>}
          >
            <Row>
              <Column offset={3} size={6}>
                <Typography p muted>
                  {t("hub_editor.expeditor-enabled.description")}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">
                      <FormControl className="my-10">
                        <Toggle
                          data-testid="next-mv-toggle"
                          label={t("hub_editor.expeditor_enabled_app.enabled")}
                          {...register("has_expeditor_app_enabled")}
                        />
                      </FormControl>
                    </div>
                    <div className="mb-30">
                      {isUpdateHubError && (
                        <ErrorMessage
                          error={isErrorType(error) ? error.message : ""}
                        />
                      )}
                    </div>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          history.push(`/network/hub/view/${params.id}`);
                        }}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isUpdateHubLoading}
                      >
                        {t("Save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};

export default EditExpeditorSettings;
