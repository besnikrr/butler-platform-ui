import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Column,
  Row,
  Typography,
  Toggle,
  Button,
  FormControl,
  ErrorMessage,
  useTranslation,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { HubV2, ResourceErrorResponse } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { useFetchHub, useUpdateHub } from "../../../store/hub";
import { isErrorType } from "../../../utils";

export default function NextMvSettings() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<HubV2>();
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<ResourceErrorResponse>();
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
      has_nextmv_enabled: hubData?.payload?.has_nextmv_enabled,
    });
  }, [hubData, reset]);

  const onSubmit = async (data: HubV2) => {
    try {
      await updateHub({
        name: data?.name,
        tax_rate: data?.tax_rate,
        has_nextmv_enabled: data?.has_nextmv_enabled,
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
            header={<Typography h2>{t("Next Move")}</Typography>}
          >
            <Row>
              <Column offset={3} size={6}>
                <Typography p muted>
                  {t("hub_editor.nextmv.description")}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">
                      <FormControl className="my-10">
                        <Toggle
                          data-testid="next-mv-toggle"
                          label={t("hub_editor.next_move_app.enabled")}
                          {...register("has_nextmv_enabled")}
                        />
                      </FormControl>
                    </div>
                    <Divider vertical={30} />
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
}
