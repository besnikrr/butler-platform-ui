import { useEffect, useState } from "react";
import {
  Grid,
  Row,
  Card,
  Typography,
  useTranslation,
  Column,
  FormControl,
  Input,
  FormGroup,
  Divider,
  Button,
  LeavePageAlert,
  Textarea,
  Skeleton,
  ErrorMessage,
  Toggle,
  LookupField,
  useApi,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams } from "react-router-dom";
import {
  createHotelValidatorV2,
  HotelDetails,
  HubV2,
  User,
  AppEnum,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import PhoneNumberInput from "../../../../component/phone-number-input/phone-number-input";
import CsvFileLink from "../../../../component/csv-file-link";
import { useFetchHotel, useUpdateHotel } from "../../../../store/hotel";
import { useFetchHubs } from "../../../../store/hub";
import { useFetchUsers } from "../../../../store/user";
import NetworkTooltip from "../../../../component/network-tooltip";

export default function HotelEditorView() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const serviceApi = useApi(AppEnum.NETWORK);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
    clearErrors,
  } = useForm<HotelDetails>({
    resolver: yupResolver(createHotelValidatorV2),
  });

  const [error, setError] = useState<string>();
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [hubs, setHubs] = useState<HTTPResourceResponse<HubV2[]>>();
  const [users, setUsers] = useState<HTTPResourceResponse<User[]>>();

  const { data: hotelData, isLoading: isHotelLoading } = useFetchHotel({
    id: params.id,
  });

  const {
    mutateAsync: updateHotel,
    isLoading: isUpdateHotelLoading,
    isError: isUpdateHotelError,
  } = useUpdateHotel(params.id);

  const { data: hubData, isLoading: isHubsLoading } = useFetchHubs({
    filters: "statuses[0]=true",
  });
  const { data: userData, isLoading: isUsersLoading } = useFetchUsers({});

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (hotelData?.payload?.id && !isHubsLoading && !isUsersLoading) {
      setUsers({
        payload: _.uniqBy([...(userData?.payload || []), hotelData?.payload?.account_manager as User], "id"),
        total: userData?.total,
      });
      setHubs({
        payload: _.uniqBy([...(hubData?.payload || []), hotelData?.payload?.hub as HubV2], "id"),
        total: hubData?.total,
      });
    }

    reset({ ...hotelData?.payload, hub_id: `${hotelData?.payload?.hub?.id}` });
  }, [hubData, hotelData, userData, reset]);

  const renderUsers = () => {
    return (
      <FormControl className="my-10" label={t("Customer Success Manager*")}>
        <LookupField<User>
          value=""
          selectProps={register("account_manager_id")}
          error={errors.account_manager_id?.message}
          initData={users}
          placeholder={t("Select user")}
          onQuery={(queryParams) => {
            return serviceApi.get(`/users?page=${queryParams.page}&search=${queryParams.filter}`);
          }}
        />
      </FormControl>
    );
  };

  const renderHubs = () => {
    return (
      <FormControl className="my-10" label={`${t("hub")}*`}>
        <LookupField<HubV2>
          value=""
          selectProps={register("hub_id")}
          error={errors.hub_id?.message}
          initData={hubs}
          placeholder={t("Select hub")}
          onQuery={(queryParams) => {
            return serviceApi.get(`/hubs?statuses[0]=true&page=${queryParams.page}&name=${queryParams.filter}`);
          }}
        />
      </FormControl>
    );
  };

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      return setLeaveModal(true);
    }

    return history.push(url);
  };

  const onSubmit = async (data: HotelDetails) => {
    setError("");
    try {
      const {
        deleted_at,
        updated_at,
        created_at,
        id,
        oms_id,
        web_active,
        hub_id,
        hub,
        operating_hours,
        menu_id,
        account_manager,
        ...other
      } = data;
      const submitData = {
        ...other,
        room_count: +data.room_count,
        address_coordinates: `${data.address_coordinates.x}, ${data.address_coordinates.y}`,
        hub_id: data?.hub_id && +data?.hub_id,
        account_manager_id: data?.account_manager_id && +data.account_manager_id,
        reskin_config: data?.reskin_config && JSON.stringify(data.reskin_config),
        room_numbers:
          data?.room_numbers &&
          `[${data.room_numbers.map((item: string) => {
            return `"${item}"`;
          })}]`,
      };

      await updateHotel(submitData);
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  if (isHotelLoading) {
    return (
      <Grid gutter={0}>
        <Card page>
          <Skeleton
            parts={[
              "title",
              "divider",
              "text-2",
              "labelField-10",
              "divider",
              "text-2",
              "labelField-7",
              "divider",
              "labelField",
            ]}
          />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Grid>
          <Card
            className="network-content"
            page
            header={
              <div>
                <Typography h2>{t("Edit General Information")}</Typography>
              </div>
            }
            headerClassName="mb-0"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-30">
                <Column offset={3} size={6}>
                  <div className="mb-30">
                    <Typography h2>{t("Hotel General Information")}</Typography>
                  </div>
                  <FormControl className=" my-10" label={`${t("hotel_name")}*`}>
                    <Input placeholder={t("Enter hotel name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  <FormControl className=" my-10" label={`${t("hotel_formal_name")}*`}>
                    <Input
                      placeholder={t("Enter formal hotel name")}
                      {...register("formal_name")}
                      error={errors?.formal_name?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={`${t("address_town")}*`}>
                    <Input
                      placeholder={t("Enter address town")}
                      {...register("address_town")}
                      error={errors?.address_town?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={`${t("address_street")}*`}>
                    <Input
                      placeholder={t("Enter address street")}
                      {...register("address_street")}
                      error={errors?.address_street?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={`${t("address_number")}*`}>
                    <Input
                      placeholder={t("Enter address number")}
                      {...register("address_number")}
                      error={errors?.address_number?.message}
                    />
                  </FormControl>
                  <FormGroup>
                    <FormControl label={`${t("zip_code")}*`}>
                      <Input
                        placeholder={t("Enter Zip Code")}
                        {...register("address_zip_code")}
                        error={errors?.address_zip_code?.message}
                      />
                    </FormControl>
                  </FormGroup>
                  <FormControl className="my-10" label={t("Create_Room Number Count")}>
                    <Input
                      type="number"
                      min="0"
                      placeholder={t("Enter room number count")}
                      {...register("room_count")}
                      error={errors?.room_count?.message}
                    />
                  </FormControl>
                  <div className="mt-20 mb-20">
                    <FormControl className="my-10" label={t("Room numbers(CSV)")}>
                      <CsvFileLink {...register("room_numbers")} />
                      <Typography p muted className="mt-10">
                        {t("hotel_editor.csv_file_link.help_text")}
                      </Typography>
                    </FormControl>
                  </div>
                  <FormControl className="my-10" label={t("PMS Enabled")}>
                    <Toggle data-testid="hotel-editor-has-pms-enabled" {...register("has_pms_enabled")} />
                  </FormControl>
                  <div className="ui-flex v-center w-100">
                    <FormControl className="my-10 w-100" label={`${t("hotel_web_code")}*`}>
                      <Input
                        placeholder="Enter hotel web code"
                        {...register("web_code")}
                        error={errors?.web_code?.message}
                      />
                    </FormControl>
                    <NetworkTooltip label={t("hotel_web_code")} text={t("hotel_web_code_info")} />
                  </div>
                  <div className="ui-flex v-center w-100">
                    <FormControl className="my-10 w-100" label={`${t("hotel_code")}*`}>
                      <Input placeholder="Enter hotel code" {...register("code")} error={errors?.code?.message} />
                    </FormControl>
                    <NetworkTooltip label={t("hotel_code")} text={t("hotel_code_info")} />
                  </div>
                  <Divider vertical={30} />
                  <div className="pb-20">
                    <Typography h2>{t("Contact Information")}</Typography>
                  </div>
                  {users && renderUsers()}
                  <FormControl className=" my-10" label={`${t("contact_person")}*`}>
                    <Input
                      placeholder={t("Enter contact person")}
                      {...register("contact_person")}
                      error={errors?.contact_person?.message}
                    />
                  </FormControl>
                  <FormControl className="my-10" label={`${t("hotel_contact_number")}*`}>
                    <PhoneNumberInput
                      placeholder="Enter phone number"
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
                  <FormControl className="my-10" label={`${t("invoice_email_addresses")}*`}>
                    <Input
                      placeholder={t("Enter email address(es)")}
                      {...register("contact_email")}
                      error={errors?.contact_email?.message}
                    />
                    <Typography p muted className="pt-5">
                      {t("Add multiple emails with a comma")}
                    </Typography>
                  </FormControl>
                  <div className="ui-flex v-center w-100">
                    <FormControl className=" my-10 w-100" label={`${t("web_url_id")}*`}>
                      <Input
                        placeholder={t("Enter web url id")}
                        {...register("web_url_id")}
                        error={errors?.web_url_id?.message}
                      />
                    </FormControl>
                    <NetworkTooltip label={t("web_url_id")} text={t("web_url_id_info")} />
                  </div>
                  <FormControl className="my-10" label={t("delivery_instructions")}>
                    <Textarea
                      placeholder={t("Enter delivery instructions")}
                      {...register("delivery_instructions", {
                        required: false,
                      })}
                    />
                  </FormControl>
                  <FormGroup className="my-10">
                    <Column size={6}>
                      <FormControl label={`${t("Latitude")}*`}>
                        <Input
                          type="number"
                          step="any"
                          placeholder={t("Coordinates")}
                          {...register("address_coordinates.x")}
                          error={errors?.address_coordinates?.x?.message}
                        />
                      </FormControl>
                    </Column>
                    <Column size={6}>
                      <FormControl label={`${t("Longitude")}*`}>
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
                  <Divider vertical={30} />
                  <Typography h2 className="pb-20">
                    {t("Network Relationships")}
                  </Typography>
                  {hubs && renderHubs()}
                  <Divider vertical={30} />
                  <div className="mb-30">{isUpdateHotelError && <ErrorMessage error={error} />}</div>
                  <div className="form-bottom-action">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        onLeavePage(`/network/hotel/view/${params.id}`);
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button type="submit" variant="primary" disabled={isUpdateHotelLoading}>
                      {t("Save")}
                    </Button>
                  </div>
                </Column>
              </div>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/network/hotel/view/${params.id}`)}
              />
            </form>
          </Card>
        </Grid>
      </Row>
    </Grid>
  );
}
