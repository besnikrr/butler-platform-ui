import { useCallback, useEffect, useState, useContext } from "react";
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
  Select,
  Option,
  useTranslation,
  LeavePageAlert,
  AppContext,
  pushNotification,
  ErrorMessage,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { PERMISSION, CityV2, createCityValidatorV2 } from "@butlerhospitality/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, Redirect } from "react-router-dom";
import { AxiosError } from "axios";
import { useCreateCity } from "../../../store/city";
import timezones from "../../../shared/timezones";
import states from "../../../shared/states";

export default function CityEditorView() {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CityV2>({
    resolver: yupResolver(createCityValidatorV2),
  });

  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const canCreateCity = can(PERMISSION.NETWORK.CAN_CREATE_CITY);
  const { mutateAsync: createCity, isError: isCreateCityError, isLoading: isCreateCityLoading } = useCreateCity();

  const renderTimeZones = useCallback((): any => {
    return timezones.map((timezone: string, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <Option value={timezone} key={`timezone-${index}`}>
        {timezone}
      </Option>
    ));
  }, []);

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      return setLeaveModal(true);
    }

    return history.push(url);
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: CityV2) => {
    setError("");
    const { deleted_at, oms_id, ...other } = data;
    try {
      await createCity(other);
      history.push(`/network/city/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderStates = (statesData: { [key: string]: string }): any => {
    return Object.keys(statesData).map((key: any) => (
      <Option value={key} key={key}>
        {statesData[key]} - {key}
      </Option>
    ));
  };

  if (!canCreateCity) {
    pushNotification(t("You have no permissions to create a city"), {
      type: "warning",
    });
    return <Redirect to="/network/city/list" />;
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
                <Typography h2>{t("Create New City")}</Typography>
              </div>
            }
            headerClassName="mb-0"
          >
            <div className="mt-30">
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-30">
                    <Typography h2>{t("City General Information")}</Typography>
                  </div>
                  <FormControl className="my-10" label={t("City Name*")}>
                    <Input placeholder={t("Enter city name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  <FormControl className="my-10" label={t("State")}>
                    <Select value="" selectProps={{ ...register("state") }}>
                      <Option value="" disabled hidden>
                        {t("Select state")}
                      </Option>
                      {renderStates(states)}
                    </Select>
                  </FormControl>
                  <FormControl className="my-10" label={t("city_timezone_title*")}>
                    <Select value="" selectProps={{ ...register("time_zone") }} error={errors?.time_zone?.message}>
                      <Option value="" disabled hidden>
                        {t("Select time zone")}
                      </Option>
                      {renderTimeZones()}
                    </Select>
                  </FormControl>
                  <Divider vertical={30} />
                  <div className="mb-30">{isCreateCityError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/network/city/list`);
                        }}
                      >
                        {t("Cancel")}
                      </Button>
                      <Button type="submit" variant="primary" className="text-medium" disabled={isCreateCityLoading}>
                        {t("Save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </div>
          </Card>
        </Column>
        <LeavePageAlert
          modal={leaveModal}
          setModal={setLeaveModal}
          onLeave={() => history.push(`/network/city/list`)}
        />
      </Row>
    </Grid>
  );
}
