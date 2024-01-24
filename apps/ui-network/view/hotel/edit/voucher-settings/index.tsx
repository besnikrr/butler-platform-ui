import { useEffect, useState, useContext } from "react";
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
  AppContext,
  pushNotification,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { ResourceErrorResponse, PERMISSION } from "@butlerhospitality/shared";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { useFetchHotel, useUpdateHotel } from "../../../../store/hotel";
import { isErrorType } from "../../../../utils";
import NetworkTooltip from "../../../../component/network-tooltip";

export default function VoucherSettings() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const { register, reset, handleSubmit } = useForm<{
    has_vouchers_enabled?: boolean;
  }>({
    defaultValues: {},
  });

  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<ResourceErrorResponse>();
  const editPayments = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL_PAYMENTS);

  const { data: hotelData } = useFetchHotel({
    id: params.id,
  });
  const {
    mutateAsync: updateHotel,
    isLoading: isUpdateHotelLoading,
    isError: isUpdateHotelError,
  } = useUpdateHotel(params.id);

  useEffect(() => {
    reset({
      has_vouchers_enabled: hotelData?.payload?.has_vouchers_enabled,
    });
  }, [hotelData, reset]);

  const onSubmit = async (data: { has_vouchers_enabled?: boolean }) => {
    setError(undefined);
    const submitData = {
      ...data,
      name: hotelData?.payload?.name,
      hub_id: hotelData?.payload?.hub_id && +hotelData?.payload?.hub_id,
    };

    try {
      await updateHotel(submitData);
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: any) {
      setError(err.response.data.error);
    }
  };

  if (!editPayments) {
    pushNotification("You have no permissions to update the payments", {
      type: "warning",
    });
    return <Redirect to="/network/hotel/list" />;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="network-content" page header={<Typography h2>{t("Vouchers")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">
                      <Typography p muted className="py-10">
                        {t("hotel_editor.vouchers_app.description")}
                      </Typography>
                      <div className="ui-flex v-center w-100">
                        <FormControl className="my-10" label={t("Has Vouchers Enabled")}>
                          <Toggle
                            data-testid="hotel-editor-has_vouchers_enabled"
                            {...register("has_vouchers_enabled")}
                            disabled={!hotelData?.payload?.allow_payment_credit_card}
                          />
                        </FormControl>
                        {!hotelData?.payload?.allow_payment_credit_card && (
                          <NetworkTooltip label={t("Vouchers")} text={t("hotel_editor.vouchers.can_not_update")} />
                        )}
                      </div>
                    </div>
                    <Divider vertical={30} />
                    <div className="mb-30">
                      {isUpdateHotelError && <ErrorMessage error={isErrorType(error) ? error.message : ""} />}
                    </div>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          history.push(`/network/hotel/view/${params.id}`);
                        }}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isUpdateHotelLoading}>
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
