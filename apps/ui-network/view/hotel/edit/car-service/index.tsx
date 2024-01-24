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

export default function CarService() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const { register, reset, handleSubmit } = useForm<{
    has_car_service_enabled: boolean;
  }>({
    defaultValues: {
      has_car_service_enabled: false,
    },
  });

  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<ResourceErrorResponse>();

  const editCarService = can(
    PERMISSION.NETWORK.CAN_UPDATE_HOTEL_INTEGRATION_CONFIGS_CAR_SERVICE
  );

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
      has_car_service_enabled: hotelData?.payload?.has_car_service_enabled,
    });
  }, [hotelData, reset]);

  const onSubmit = async (data: { has_car_service_enabled: boolean }) => {
    setError(undefined);
    try {
      const submitData = {
        ...data,
        name: hotelData?.payload?.name,
        hub_id: hotelData?.payload?.hub_id && +hotelData?.payload?.hub_id,
      };

      await updateHotel(submitData);
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: any) {
      setError(err);
    }
  };

  if (!editCarService) {
    pushNotification("You have no permissions to update the car service", {
      type: "warning",
    });

    return <Redirect to="/network/hotel/list" />;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={<Typography h2>{t("Car Service")}</Typography>}
          >
            <Row>
              <Column offset={3} size={6}>
                <Typography p muted>
                  {t("hotel_editor.car_service.description")}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">
                      <FormControl className="my-10">
                        <Toggle
                          data-testid="hotel-editor-shuttle-app-enabled"
                          label={t("hotel_editor.shuttle_app.enabled")}
                          {...register("has_car_service_enabled")}
                        />
                      </FormControl>
                    </div>
                    <Divider vertical={30} />
                    <div className="mb-30">
                      {isUpdateHotelError && (
                        <ErrorMessage
                          error={isErrorType(error) ? error.message : ""}
                        />
                      )}
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
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isUpdateHotelLoading}
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
