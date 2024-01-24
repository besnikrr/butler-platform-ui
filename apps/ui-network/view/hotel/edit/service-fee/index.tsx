import { useContext, useEffect, useState } from "react";
import {
  AppContext,
  Button,
  Card,
  Column,
  ErrorMessage,
  FormControl,
  Grid,
  isErrorType,
  pushNotification,
  Row,
  Select,
  Option,
  Typography,
  useTranslation,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { Redirect, useHistory, useParams } from "react-router-dom";
import {
  FeeType,
  HotelDetails,
  PERMISSION,
  ResourceErrorResponse,
  serviceFeeValidator,
} from "@butlerhospitality/shared";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFetchHotel, useUpdateHotel } from "../../../../store/hotel";

import "./index.scss";

const defaultValues = {
  service_fee: [
    {
      fee_values: [
        {
          order: 1,
          order_range: {
            from: 0.01,
          },
        },
        {
          order: 2,
        },
        {
          order: 3,
        },
        {
          order: 4,
        },
        {
          order: 5,
          order_range: {
            to: null,
          },
        },
      ],
    },
  ],
};

export default function ServiceFee() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const [serviceFeeType, setServiceFeeType] = useState<FeeType>(FeeType.DISABLED);

  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<ResourceErrorResponse>();
  const canUpdateMenu = can(PERMISSION.NETWORK.CAN_UPDATE_HOTEL_INTEGRATION_CONFIGS_ACTIVITIES);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<HotelDetails>({
    resolver: serviceFeeType !== FeeType.DISABLED ? yupResolver(serviceFeeValidator) : undefined,
    defaultValues,
  });

  const { data: hotelData, isLoading: isHotelLoading } = useFetchHotel({
    id: params.id,
  });

  useEffect(() => {
    if (hotelData?.payload?.service_fee?.length) {
      setServiceFeeType(hotelData?.payload?.service_fee?.[0].fee_type);
      reset({
        service_fee: hotelData?.payload?.service_fee,
      });
    }
  }, [hotelData, reset]);

  const {
    mutateAsync: updateHotel,
    isLoading: isUpdateHotelLoading,
    isError: isUpdateHotelError,
  } = useUpdateHotel(params.id);

  const onSubmit = async (data: HotelDetails) => {
    setError(undefined);

    try {
      const submitData = {
        name: hotelData?.payload?.name,
        hub_id: hotelData?.payload?.hub_id && Number(hotelData?.payload?.hub_id),
        service_fee: data?.service_fee?.[0]?.fee_type !== FeeType.DISABLED ? data?.service_fee : [],
      };
      await updateHotel(submitData);
      history.push(`/network/hotel/view/${params.id}`);
    } catch (err: any) {
      setError(err);
    }
  };

  if (!canUpdateMenu) {
    pushNotification("You have no permissions to update the menu", {
      type: "warning",
    });
    return <Redirect to="/network/hotel/list" />;
  }

  const handleOnConfigChange = (e: any, index: number) => {
    setValue(`service_fee.${index}.fee_type`, e.currentTarget.value);
    setServiceFeeType(e.currentTarget.value);
  };

  const renderServiceFeeOptions: any = () => {
    return Object.keys(FeeType).map((item: string) => <Option value={item}>{item}</Option>);
  };

  const setNextFieldValue = (value: string, index: number, nestedIndex: number) => {
    setValue(`service_fee.${index}.fee_values.${nestedIndex + 1}.order_range.from`, (Number(value) || 0) + 0.01);
  };

  const renderServiceFeeView = () => {
    return (
      <>
        {(getValues("service_fee") || []).map((serviceFee: any, index) => (
          <>
            <Grid>
              <Row>
                <Column offset={2} size={8}>
                  <FormControl label={`${t("fee_type")}`} className="my-10 type-wrapper">
                    <Select
                      value={serviceFeeType}
                      selectProps={{
                        onChange: (e) => {
                          handleOnConfigChange(e, index);
                        },
                      }}
                      error={errors?.service_fee?.[index]?.fee_type?.message}
                    >
                      {renderServiceFeeOptions()}
                    </Select>
                  </FormControl>
                </Column>
              </Row>
              {serviceFeeType !== FeeType.DISABLED && (
                <Row>
                  <Column offset={2} size={8}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell as="th">{t("fee_amount")}</TableCell>
                          <TableCell as="th" className="ui-flex center">
                            {t("order_range")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(serviceFee.fee_values || []).map((item: any, nestedIndex: number) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <FormControl className="my-10">
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...register(`service_fee.${index}.fee_values.${nestedIndex}.fee_amount`, {
                                    setValueAs: (v) => Number(v),
                                  })}
                                  error={errors?.service_fee?.[index]?.fee_values?.[nestedIndex]?.fee_amount?.message}
                                />
                              </FormControl>
                              {serviceFeeType === FeeType.FIXED_PRICE && <Typography className="ml-10">$</Typography>}
                              {serviceFeeType === FeeType.PERCENTAGE && <Typography className="ml-10">%</Typography>}
                            </TableCell>
                            <TableCell className="service-fee-table-cell">
                              <FormControl className="my-10 mx-10">
                                <Input
                                  type="number"
                                  step="0.01"
                                  disabled={nestedIndex !== 0}
                                  error={
                                    errors?.service_fee?.[index]?.fee_values?.[nestedIndex]?.order_range?.from?.message
                                  }
                                  {...register(`service_fee.${index}.fee_values.${nestedIndex}.order_range.from`)}
                                />
                              </FormControl>
                              {nestedIndex !== 4 && (
                                <>
                                  <Typography>{t("to")}</Typography>
                                  <FormControl className="my-10 mx-10">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...register(`service_fee.${index}.fee_values.${nestedIndex}.order_range.to`, {
                                        setValueAs: (v) => Number(v),
                                      })}
                                      onChange={(e) => {
                                        setNextFieldValue(e.currentTarget.value, index, nestedIndex);
                                      }}
                                      error={
                                        errors?.service_fee?.[index]?.fee_values?.[nestedIndex]?.order_range?.to
                                          ?.message
                                      }
                                    />
                                  </FormControl>
                                </>
                              )}
                              {nestedIndex === 4 && <Typography>{t("and_higher")}</Typography>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Column>
                </Row>
              )}
            </Grid>
            <Divider />
          </>
        ))}
      </>
    );
  };

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="network-content" page header={<Typography h2>{t("service_fee")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <div className="ui-flex column">{!isHotelLoading && renderServiceFeeView()}</div>
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
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isUpdateHotelLoading}>
                        {t("save")}
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
