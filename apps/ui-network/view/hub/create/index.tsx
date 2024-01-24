import { useContext, useEffect, useState } from "react";
import { HubV2, PERMISSION, CityV2, createHubValidatorV2, AppEnum } from "@butlerhospitality/shared";
import {
  AppContext,
  Card,
  Column,
  FormControl,
  FormGroup,
  Grid,
  Input,
  pushNotification,
  Row,
  Typography,
  Divider,
  Button,
  LeavePageAlert,
  Skeleton,
  ErrorMessage,
  LookupField,
  useApi,
  InputColor,
} from "@butlerhospitality/ui-sdk";
import { useTranslation } from "react-i18next";
import { Redirect, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import PhoneNumberInput from "../../../component/phone-number-input/phone-number-input";
import { useFetchCities } from "../../../store/city";
import { useCreateHub } from "../../../store/hub";

export default function HubEditorView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const canCreateHub = can(PERMISSION.NETWORK.CAN_CREATE_HUB);
  const serviceApi = useApi(AppEnum.NETWORK);

  const [error, setError] = useState<string>("");
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm<HubV2>({
    resolver: yupResolver(createHubValidatorV2),
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { mutateAsync: createHub, isError: isCreateHubError, isLoading: isCreateHubLoading } = useCreateHub();

  const { data: citiesData, isLoading: isLoadingCities } = useFetchCities({});

  const onSubmit = async (data: HubV2) => {
    setError("");

    const { hotels, oms_id, city, ...other } = data;

    const parsedData = {
      ...other,
      address_coordinates: `${data.address_coordinates.x}, ${data.address_coordinates.y}`,
      tax_rate: Number(data.tax_rate),
      city_id: Number(data.city_id),
    };

    try {
      await createHub(parsedData);

      history.push(`/network/hub/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      setLeaveModal(true);
    }
    return history.push(url);
  };

  const renderCities = () => {
    return (
      <FormControl label={t("City*")}>
        <LookupField<CityV2>
          value=""
          selectProps={register("city_id")}
          error={errors.city_id?.message}
          initData={citiesData}
          placeholder={t("Pick your city")}
          onQuery={(queryParams) => {
            return serviceApi.get(`/cities?page=${queryParams.page}&name=${queryParams.filter}`);
          }}
        />
      </FormControl>
    );
  };

  if (!canCreateHub) {
    pushNotification("You have no permissions to create a hub", {
      type: "warning",
    });
    return <Redirect to="/network/hub/list" />;
  }

  if (isLoadingCities) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton parts={["title", "divider", "text-2", "labelField-7", "divider", "text-2", "labelField"]} />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={
              <div>
                <Typography h2>{t("Create New Hub")}</Typography>
              </div>
            }
            headerClassName="mb-0"
          >
            <div className="mt-30">
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-30">
                    <Typography h2>{t("Hub General Information")}</Typography>
                    <Typography p muted className="pt-10">
                      {t("hub_editor.description")}
                    </Typography>
                  </div>
                  <FormControl className="my-10" label={t("Hub Name*")}>
                    <Input placeholder={t("Enter hub name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  <FormControl className="my-10" label={t("Contact Email*")}>
                    <Input
                      type="email"
                      placeholder={t("Enter contact email")}
                      {...register("contact_email")}
                      error={errors?.contact_email?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={t("Contact Number*")}>
                    <PhoneNumberInput
                      placeholder="Enter contact number"
                      initialValue={getValues("contact_phone")}
                      onChange={(value: any) => {
                        setValue("contact_phone", value);
                        if (errors?.contact_phone?.message) {
                          clearErrors("contact_phone");
                        }
                      }}
                      error={errors?.contact_phone?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={t("Address Town*")}>
                    <Input
                      placeholder={t("Enter address town")}
                      {...register("address_town")}
                      error={errors.address_town?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={t("Address Street*")}>
                    <Input
                      placeholder={t("Enter address street")}
                      {...register("address_street")}
                      error={errors.address_street?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={t("Address Number*")}>
                    <Input
                      placeholder={t("Enter address number")}
                      {...register("address_number")}
                      error={errors.address_number?.message}
                    />
                  </FormControl>
                  <FormGroup className="my-10">
                    <Column size={6}>{citiesData && renderCities()}</Column>
                    <Column size={6}>
                      <FormControl label={t("ZIP Code*")}>
                        <Input
                          type="number"
                          placeholder={t("Enter ZIP Code")}
                          {...register("address_zip_code")}
                          error={errors?.address_zip_code?.message}
                        />
                      </FormControl>
                    </Column>
                  </FormGroup>
                  <FormGroup className="my-10">
                    <Column size={6}>
                      <FormControl label={t("Latitude*")}>
                        <Input
                          type="number"
                          step="any"
                          placeholder={t("Coordinates")}
                          width="50%"
                          {...register("address_coordinates.x")}
                          error={errors?.address_coordinates?.x?.message}
                        />
                      </FormControl>
                    </Column>
                    <Column size={6}>
                      <FormControl label={t("Longitude*")}>
                        <Input
                          type="number"
                          step="any"
                          placeholder={t("Coordinates")}
                          {...register("address_coordinates.y")}
                          error={errors?.address_coordinates?.y?.message}
                        />
                      </FormControl>
                    </Column>
                  </FormGroup>
                  <FormGroup className="">
                    <Column size={6}>
                      <FormControl className="" label={`${t("Hub Color")}*`}>
                        <InputColor placeholder={t("Color")} {...register("color")} error={errors?.color?.message} />
                      </FormControl>
                    </Column>
                  </FormGroup>
                  <Divider vertical={30} />
                  <div className="mb-30">
                    <Typography h2>{t("Tax Rate")}</Typography>
                    <Typography p muted className="pt-10">
                      {t("hub_editor.tax_rate_helper_text")}
                    </Typography>
                  </div>
                  <FormControl className="my-10" label="Tax %*">
                    <Input
                      type="number"
                      step="0.000001"
                      min="0"
                      max="100"
                      placeholder={t("Enter Tax %")}
                      {...register("tax_rate")}
                      error={errors.tax_rate?.message}
                    />
                  </FormControl>
                  <Divider vertical={30} />
                  <div className="mb-30">{isCreateHubError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/network/hub/list/`);
                        }}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button type="submit" variant="primary" className="text-medium" disabled={isCreateHubLoading}>
                        {t("Save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </div>
          </Card>
        </Column>
        <LeavePageAlert modal={leaveModal} setModal={setLeaveModal} onLeave={() => history.push(`/network/hub/list`)} />
      </Row>
    </Grid>
  );
}
