/* eslint-disable no-param-reassign */
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Row,
  Column,
  Card,
  Typography,
  FormControl,
  ErrorMessage,
  Toggle,
  useApi,
  useTranslation,
  Textarea,
  Checkbox,
  pushNotification,
  AppContext,
  Link,
  Skeleton,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import {
  AppEnum,
  ResourceErrorResponse,
  HTTPResourceResponse,
  PERMISSION,
  HotelDetails,
  UpdateMenuConfigs,
  MealPeriod,
} from "@butlerhospitality/shared";
import { Link as RouterLink, useHistory, useParams, Redirect } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import produce from "immer";
import { useQueryClient } from "react-query";
import { hotelKeys } from "../../../../store/hotel/query-keys";
import OperatingHours from "../../../../component/operating-hours/operating-hours";
import PhoneNumberInput from "../../../../component/phone-number-input/phone-number-input";
import { getDefaultOperatingHours } from "../utils";

function IntegrationConfigsMenuAppEdit(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  const { can } = useContext(AppContext);
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const networkServiceApi = useApi(AppEnum.NETWORK);
  const menuServiceApi = useApi(AppEnum.MENU);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ResourceErrorResponse>();
  const [hotelData, setHotelData] = useState<HotelDetails>();
  const editMenuApp = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL_MENU);
  const [menu, setMenu] = useState<any>();
  const [operatingHours, setOperatingHours] = useState<any>(
    getDefaultOperatingHours([MealPeriod.Breakfast, MealPeriod.Lunch_Dinner, MealPeriod.Convenience])
  );
  const {
    register,
    reset,
    getValues,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelDetails>({
    resolver: yupResolver(UpdateMenuConfigs),
  });

  const getData = async (): Promise<void> => {
    const hotelResponse = await networkServiceApi.get<HTTPResourceResponse<HotelDetails>>(`/hotels/${params.id}`);
    const hotel = hotelResponse.data.payload;
    const operationHours = hotel?.operating_hours ? hotel?.operating_hours : [];
    setOperatingHours(operationHours!!);
    setHotelData(hotel);
    reset({
      web_active: hotel?.web_active,
      web_url_id: hotel?.web_url_id,
      web_code: hotel?.web_code,
      allow_scheduled_orders: hotel?.allow_scheduled_orders,
      web_phone: hotel?.web_phone,
      delivery_instructions: hotel?.delivery_instructions,
    });

    const result = await menuServiceApi.get<HTTPResourceResponse<any>>(`?hotelIds[0]=${params.id}`);

    const item = result.data.payload[0];
    setMenu(item);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async (data: any) => {
    setError(undefined);
    try {
      setIsSubmitting(true);
      await networkServiceApi.patch<HTTPResourceResponse<HotelDetails>>(`/hotels/${params.id}/`, {
        ...data,
        code: hotelData?.code,
        hub_id: hotelData?.hub?.id,
        operating_hours: operatingHours,
      });
      queryClient.invalidateQueries(hotelKeys.all);
      pushNotification(t("Hotel updated successfully"), {
        type: "success",
      });
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: any) {
      pushNotification(t("Hotel update failed"), {
        type: "error",
      });
      setError(err.response.data.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editMenuApp) {
    pushNotification("You have no permissions to update the menu", {
      type: "warning",
    });
    return <Redirect to="/network/hotel/list" />;
  }

  if (loading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["title", "divider", "text-2", "labelField-10"]} />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="network-content" page header={<Typography h2>{t("Edit Menu")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <Typography p muted className="py-10">
                  {t("hotel_editor.menu.description")}
                </Typography>
                {menu?.name && (
                  <FormControl className="my-10" label="Menu ">
                    <Link size="medium" component={RouterLink} to={`/menu/menu/view/${menu?.id}`}>
                      {menu?.name}
                    </Link>
                  </FormControl>
                )}
                <Typography p muted className="py-10">
                  {t("hotel_editor.menu_app.web_active")}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <FormControl className="my-10">
                      <Toggle
                        data-testid="hotel-editor-menu-app-enabled"
                        label={t("Make Hotel Visible to Guest View")}
                        {...register("web_active")}
                      />
                    </FormControl>
                    <FormControl className="my-10" label="Web Phone*">
                      <PhoneNumberInput
                        placeholder={t("Web Phone")}
                        initialValue={getValues("web_phone")}
                        onChange={(value: any) => {
                          setValue("web_phone", value);
                          if (errors?.web_phone?.message) {
                            clearErrors("web_phone");
                          }
                        }}
                        error={errors?.web_phone?.message}
                      />
                    </FormControl>
                    <div className="ui-flex column">
                      <FormControl className="my-10">
                        <Typography p muted className="py-10">
                          {t("hotel_editor.menu_app_scheduled orders.description")}
                        </Typography>
                        <Toggle
                          data-testid="hotel-editor-menu-app-scheduled-orders-enabled"
                          label={t("Allow scheduled orders")}
                          {...register("allow_scheduled_orders")}
                        />
                      </FormControl>
                      <FormControl className="my-10" label="Delivery Instruction">
                        <Textarea
                          data-testid="hotel-editor-menu-app-delivery-instructions"
                          placeholder={t("Delivery Instructions")}
                          {...register("delivery_instructions", {
                            required: false,
                          })}
                        />
                      </FormControl>
                    </div>
                    {operatingHours.length > 0 && (
                      <Typography h2 className="pb-20 pt-30" key="operating-hours-title">
                        {t("Operating Hours")}
                      </Typography>
                    )}
                    {Object.keys(operatingHours).map((item) => {
                      return (
                        <Row key={item}>
                          <div className="is-available-wrapper mb-10">
                            <Checkbox
                              label={item.replace("Lunch_Dinner", item === "Lunch_Dinner" ? "Lunch & Dinner" : " ")}
                              checked={operatingHours[item].isAvailable}
                              onChange={(e: any) => {
                                const newState = produce(operatingHours, (draft: any) => {
                                  draft[item] = {
                                    ...operatingHours[item],
                                    isAvailable: e.target.checked,
                                  };
                                });
                                setOperatingHours({ ...newState });
                              }}
                            />
                          </div>
                          <OperatingHours
                            category={item}
                            operatingHours={operatingHours[item]}
                            setOperatingHours={(category: string, day: string, value: any) => {
                              const newState = produce(operatingHours, (draft: any) => {
                                draft[category][day] = {
                                  ...operatingHours[category][day],
                                  ...value,
                                };
                              });
                              setOperatingHours({ ...newState });
                            }}
                          />
                        </Row>
                      );
                    })}
                  </Row>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          history.push(`/network/hotel/view/${params.id}`);
                        }}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {t("Save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <Row>
                <FormControl className="my-10">{error && <ErrorMessage error={error?.displayMessage} />}</FormControl>
              </Row>
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
}

export default IntegrationConfigsMenuAppEdit;
