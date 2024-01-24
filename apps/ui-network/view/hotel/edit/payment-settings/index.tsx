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
import { PERMISSION } from "@butlerhospitality/shared";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { useFetchHotel, useUpdateHotel } from "../../../../store/hotel";

function PaymentSettings() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);

  const { register, reset, handleSubmit } = useForm<{
    allow_payment_credit_card?: boolean;
    allow_payment_room_charge?: boolean;
    is_tax_exempt?: boolean;
  }>();

  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<string>("");
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
      allow_payment_credit_card: hotelData?.payload?.allow_payment_credit_card,
      allow_payment_room_charge: hotelData?.payload?.allow_payment_room_charge,
      is_tax_exempt: hotelData?.payload?.is_tax_exempt,
    });
  }, [hotelData, reset]);

  const onSubmit = async (data: {
    allow_payment_credit_card?: boolean;
    allow_payment_room_charge?: boolean;
    is_tax_exempt?: boolean;
  }) => {
    if (!(data?.allow_payment_credit_card || data?.allow_payment_room_charge)) {
      setError(t("payment_type_required"));
      return;
    }

    setError("");
    const submitData = {
      ...data,
      name: hotelData?.payload?.name,
      hub_id: hotelData?.payload?.hub_id && +hotelData?.payload?.hub_id,
    };

    try {
      await updateHotel(submitData);
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: any) {
      setError(err);
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
          <Card className="network-content" page header={<Typography h2>{t("Payment Preferences")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">
                      <Typography p muted className="py-10">
                        {t("payment_type")}
                      </Typography>
                      <FormControl className="my-10" label={t("Payments with credit card")}>
                        <Toggle
                          data-testid="hotel-editor-payment-credit-card-enabled"
                          {...register("allow_payment_credit_card")}
                        />
                      </FormControl>
                      <FormControl className="my-10" label={t("Charge to room")}>
                        <Toggle
                          data-testid="hotel-editor-payment-room-charge-enabled"
                          {...register("allow_payment_room_charge")}
                        />
                      </FormControl>
                      <Typography p muted className="py-10">
                        {t("payment_configuration")}
                      </Typography>
                      <FormControl className="my-10" label={t("Tax Exempt")}>
                        <Toggle data-testid="hotel-editor-is-tax-exempt-enabled" {...register("is_tax_exempt")} />
                      </FormControl>
                    </div>
                    <Divider vertical={30} />
                    <div className="mb-30">{(isUpdateHotelError || error) && <ErrorMessage error={error} />}</div>

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

export default PaymentSettings;
