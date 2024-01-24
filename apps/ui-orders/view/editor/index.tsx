import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonBase,
  Card,
  Checkbox,
  Column,
  FormControl,
  Grid,
  Input,
  Link,
  pushNotification,
  Radio,
  Row,
  Select,
  Option,
  Textarea,
  Typography,
  useApi,
  DatePicker,
  Icon,
  useTranslation,
  Skeleton,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, Code, HotelV2, HTTPResourceResponse, HubV2, VoucherType } from "@butlerhospitality/shared";
import { add, isAfter, isSameDay, isSameMinute } from "date-fns";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { StringSchema } from "yup";
import qs from "qs";
import { useOrderContext } from "./store/order-context";
import { ADD_UPDATE_SPECIAL_ITEM, ADD_VOUCHER, REMOVE_TIP, SET_EDIT_ORDER_DATA, SET_MENU } from "./store/constants";
import { ItemTabs } from "./tabs";
import Discount from "./discount";
import {
  CityHubQueryParams,
  CompensationTypes,
  FormattedMenu,
  Order,
  PaymentType,
  Schedule,
  schedules,
} from "../../util/constants";
import OrderTip from "./tip";
import PhoneNumberInput from "../../component/phone-number-input/phone-number-input";
import { calculate, IOrderCalculationOutput, PriceMeasurementType } from "../../service/calculation";
import { Payment } from "../../component/payment/payment";
import { AsyncSelect, OnQueryParams } from "../../component/async-select";
import { getDayNameFromIndex, removeDayAbbreviations } from "../../util/date";
import ConfirmModal from "../../component/confirm-modal";
import { useFetch } from "../../hooks/use-fetch";

import "./index.scss";
import { AddCustomItem } from "./add-custom";
import { ItemsTable } from "./items-table";

interface Hotel extends HotelV2 {
  hub: HubV2;
}

const menuHoursMapper: { [key: string]: string } = {
  Breakfast: "Breakfast",
  // TODO: revisit, sync with oms
  "Lunch & Dinner": "Lunch_Dinner",
  Convenience: "Convenience",
};

const CreateOrder: React.FC = () => {
  const { t } = useTranslation();
  const { dispatch, state } = useOrderContext();
  const history = useHistory();
  // get order id from url params if in edit mode
  const { id: orderId } = useParams<{ id: string }>();
  const isEditMode = !!orderId;
  const menuService = useApi(AppEnum.MENU);
  const voucherService = useApi(AppEnum.VOUCHER);
  const orderService = useApi(AppEnum.ORDER);
  const networkService = useApi(AppEnum.NETWORK);
  const [tipChecked, setTipChecked] = useState<boolean>(false);
  const [voucherCode, setVoucherCode] = useState<string>("");
  // const [hubs, setHubs] = useState<HTTPResourceResponse<HubV2[]>>();
  const [hotels, setHotels] = useState<HTTPResourceResponse<Hotel[]>>();
  const [selectedHub, setSelectedHub] = useState<HubV2 | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [timeZoneTime, setTimeZoneTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [hotelChangeModal, setHotelChangeModal] = useState<{
    open: boolean;
    hotel: Hotel | null;
  }>({
    open: false,
    hotel: null,
  });
  // if in edit mode
  const [orderData, setOrderData] = useState<Order | null>(null);
  const { data: hubs, isLoading: hubsLoading } = useFetch(AppEnum.NETWORK)<HubV2[], CityHubQueryParams>({
    path: "/hubs",
    query: { paginated: false, statuses: ["true"] },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    // TODO: move validation to another file
    resolver: yupResolver(
      yup.object().shape({
        phone_number: yup
          .string()
          .isValidPhoneNumberCheck(t("phone_number_invalid"))
          .required(t("phone_number_required")),
        guest_name: yup.string().required(t("guest_name_required")),
        room_number: yup.string().required(t("room_number_required")),
        delivery_date: yup.string(),
        delivery_time: yup.string().when("delivery_date", (date: string): StringSchema => {
          if (date) {
            return yup.string().required(t("delivery_time_required"));
          }
          return yup.string();
        }),
      })
    ),
    defaultValues: {
      order_type: "ROOM_SERVICE",
    },
  });
  const paymentType = watch("payment_type");
  const deliveryDate = watch("delivery_date");
  const deliveryTime = watch("delivery_time");
  const phoneNumber = watch("phone_number");

  const orderCalculations: IOrderCalculationOutput = React.useMemo(() => {
    try {
      const calculations = calculate({
        items: state.items as any,
        paymentType,
        tip: state.tip,
        customItems: Object.values(state.customItems) ?? [],
        discount: state.discount
          ? {
              type: state.discount.type,
              value: state.discount.amount,
              valueUsed: state.discount.valueUsed,
            }
          : undefined,
        isTaxExempt: selectedHotel?.is_tax_exempt,
        taxRate: selectedHotel?.hub.tax_rate,
        vouchers: state.vouchers.map((v) => ({
          id: v.id,
          type: v.program.type,
          value: v.program.amount,
          valueUsed: v.amount_used,
          amountType: v.program.amount_type,
          payer: v.program.payer,
          payerPercentage: v.program.payer_percentage,
        })),
      });
      return calculations;
    } catch (e) {
      console.log("error: ", e);
      return {
        tip: "0.00",
        totalNet: "0.00",
        taxAmount: "0.00",
        totalVoucherPrice: "0.00",
        grandTotal: "0.00",
        receiptAmount: "0.00",
        totalGross: "0.00",
      } as IOrderCalculationOutput;
    }
  }, [
    state.vouchers,
    state.items,
    state.customItems,
    state.voucherItems,
    state.compensation,
    state.tip,
    state.discount,
    selectedHotel,
  ]);

  const setHourAndMinutes = (date: Date, time: string): Date => {
    const [hours, mins, seconds] = removeDayAbbreviations(time).split(":");
    const newDate = new Date(date);
    newDate.setHours(Number(hours) + (time.toLowerCase().includes("pm") && Number(hours) < 12 ? 12 : 0));
    newDate.setMinutes(Number(mins));
    newDate.setSeconds(seconds ? Number(seconds) : 0);
    return newDate;
  };

  const getHotelSchedule = useCallback((): Schedule[] => {
    if (!selectedHub || !selectedHotel || !selectedHub.city?.time_zone) {
      return [];
    }

    const operatingHours =
      state.activeCategoryTab && menuHoursMapper[state.activeCategoryTab]
        ? menuHoursMapper[state.activeCategoryTab]
        : menuHoursMapper.Breakfast;

    const now = new Date();
    const hotelDateAndTime = new Date(now.toLocaleString("en-US", { timeZone: selectedHub.city?.time_zone }));
    const sameDay = deliveryDate ? isSameDay(new Date(deliveryDate), hotelDateAndTime) : true;
    const hotelDateAndTimeAdded = add(hotelDateAndTime, { minutes: 45 });
    const dayName = getDayNameFromIndex(new Date(deliveryDate || hotelDateAndTime).getDay());

    const daySchedule = selectedHotel.operating_hours?.[operatingHours]?.[dayName];
    const defaultStartTime = schedules[1].value;
    const defaultEndTime = schedules[schedules.length - 1].value;
    const scheduleStart = setHourAndMinutes(new Date(hotelDateAndTime), daySchedule?.start_time || defaultStartTime);
    const scheduleEnd = setHourAndMinutes(new Date(hotelDateAndTime), daySchedule?.end_time || defaultEndTime);

    return schedules.map((schedule) => {
      if (!schedule.key) {
        return {
          ...schedule,
          hidden: false,
          disabled: false,
        };
      }

      const currentSchedule = setHourAndMinutes(new Date(hotelDateAndTime), schedule.value);

      return {
        ...schedule,
        disabled:
          (sameDay &&
            !isAfter(currentSchedule, hotelDateAndTimeAdded) &&
            !isSameMinute(currentSchedule, hotelDateAndTimeAdded)) ||
          (!isAfter(currentSchedule, scheduleStart) && !isSameMinute(currentSchedule, scheduleStart)) ||
          (isAfter(currentSchedule, scheduleStart) && isAfter(currentSchedule, scheduleEnd)) ||
          isAfter(currentSchedule, scheduleEnd),
      };
    });
  }, [selectedHub, selectedHotel, deliveryDate, deliveryTime, state.activeCategoryTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (selectedHub) setTimeZoneTime(formatInTimeZone(new Date(), selectedHub?.city?.time_zone || "UTC", "p z"));
    interval = setInterval(() => {
      const date = new Date();
      setTimeZoneTime(formatInTimeZone(date, selectedHub?.city?.time_zone || "UTC", "p z"));
    }, 3600);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedHub]);

  useEffect(() => {
    // if id we are in edit mode of an order
    // get order data
    // set Hotel from order (or get the single hotel)
    // if compensation get compensation and set it to state context
    // reset form with order data
    const getOrderData = async (): Promise<void> => {
      setLoading(true);
      try {
        const result = await orderService.get<HTTPResourceResponse<Order>>(`/${orderId}`);
        const order = result.data.payload;
        if (order) {
          const hotelResult = await networkService.get<HTTPResourceResponse<Hotel>>(`/hotels/${order.meta.hotelId}`);
          const hub = await networkService.get<HTTPResourceResponse<HubV2>>(`/hubs/${order.meta.hubId}`);
          setOrderData(order);

          const timeZone = hub.data.payload?.city?.time_zone || "UTC";
          reset({
            phone_number: order.client.phoneNumber,
            guest_name: order.client.name,
            room_number: order.meta.roomNumber,
            order_type: order.type,
            comment: order.comment,
            payment_type: order.paymentType,
            delivery_date: order.scheduledDate ? formatInTimeZone(order.scheduledDate, timeZone, "MM/dd/yyyy") : "",
            delivery_time: order.scheduledDate ? formatInTimeZone(order.scheduledDate, timeZone, "HH:mm:00") : "",
          });
          const hotel = hotelResult.data.payload;
          if (hotel) {
            setSelectedHotel(hotel);
            setSelectedHub(hotel.hub);
          }
        }
      } catch (error: any) {
        pushNotification(error.response?.data?.message, {
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      // editing order
      getOrderData();
    }
  }, [orderId]);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      if (!isEditMode) {
        reset({
          payment_type: selectedHotel?.allow_payment_credit_card ? PaymentType.CREDIT_CARD : PaymentType.CHARGE_TO_ROOM,
        });
      }
      try {
        setMenuLoading(true);
        const result = await menuService.get<HTTPResourceResponse<FormattedMenu>>(
          `/hotel/${selectedHotel?.id}?formatted=true`
        );
        // If in edit mode, get all modifiers items
        // and mutate order products to include modifiers
        // rename product modifiers to options
        // set order items to state context
        // if voucher get voucher and set it to state context
        const menu = result.data.payload;
        if (isEditMode && orderData) {
          const items: any[] = [];
          const voucherItems: any[] = [];
          orderData.products.forEach((product: any) => {
            let modifiers: any[] = [];
            Object.values(menu?.categories || {}).forEach((category) => {
              if (category.subcategories[product.categoryId]) {
                modifiers = category.subcategories[product.categoryId].items[product.productId].modifiers;
              }
            });
            const options = product.modifiers.map((m: any) => ({
              id: m.modifierOptionId,
              name: m.modifierOptionName,
              price: m.modifierOptionPrice,
              modifier: m.modifierId,
            }));

            if (product.vouchers.length > 0) {
              product.vouchers.forEach((voucher: any) => {
                voucherItems.push({
                  id: product.productId,
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: product.quantity,
                  options,
                  modifiers,
                  voucher,
                  comment: product.comment,
                  category: {
                    id: product.categoryId,
                    name: product.categoryName,
                  },
                });
              });
            } else {
              items.push({
                id: product.productId,
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                total: product.price * product.quantity,
                options,
                modifiers,
                comment: product.comment,
                category: {
                  id: product.categoryId,
                  name: product.categoryName,
                },
              });
            }
          });
          const vouchers: string[] = [];
          orderData.vouchers?.forEach((voucher: any) => {
            vouchers.push(voucher.code);
          });
          let vouchersData: any[] = [];
          if (vouchers.length > 0) {
            const voucherResult = await voucherService.get<HTTPResourceResponse<Code>>(`/code/${vouchers[0]}`);
            vouchersData = [
              {
                ...voucherResult.data.payload,
                amount_used: Number(voucherResult.data.payload?.amount_used) - (orderData.totalVoucherPrice || 0),
              },
            ];
          }

          dispatch({
            type: SET_EDIT_ORDER_DATA,
            payload: {
              cutlery: orderData.meta.cutlery,
              items,
              customItems: {},
              vouchers: vouchersData,
              voucherSelection: null,
              voucherItems,
              menu,
              compensation: null,
              tip: orderData.tip
                ? {
                    type: CompensationTypes.AMOUNT,
                    value: orderData.tip,
                  }
                : null,
            },
          });
        } else {
          dispatch({
            type: SET_MENU,
            payload: menu,
          });
        }
      } catch (error: any) {
        pushNotification(error.response?.data?.message, {
          type: "error",
        });
        dispatch({
          type: SET_MENU,
          payload: null,
        });
      } finally {
        setMenuLoading(false);
      }
    };
    if (selectedHotel) getData();
  }, [selectedHotel]);

  // move to another file
  const addVoucher = async () => {
    try {
      const voucherPayload = await voucherService.get<HTTPResourceResponse<Code>>(`/code/${voucherCode}`);
      const code = voucherPayload.data.payload;
      if (state.vouchers.length && code) {
        // TODO
        // if (code.hotel.id !== selectedHotel.id) {
        //   pushNotification("Voucher is not valid for this hotel", {
        //     type: "error",
        //   });
        // }
        if (state.vouchers[0].program.type !== VoucherType.PRE_FIXE || code.program.type !== VoucherType.PRE_FIXE) {
          pushNotification(t("only_prefixe_multiple"), {
            type: "error",
            ...voucherPayload,
          });
          return;
        }
        if (document.querySelector("[data-voucherselected='false']")) {
          pushNotification(t("voucher_complete_before_adding_another"), {
            type: "error",
          });
          return;
        }
        if (state.vouchers[0].code === voucherCode) {
          pushNotification(t("cannot_use_same_code_twice"), { type: "error" });
          return;
        }
      }
      dispatch({
        type: ADD_VOUCHER,
        payload: code,
      });
      setVoucherCode("");
    } catch (error) {
      pushNotification(t("voucher_not_found"), { type: "error" });
    }
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTipChecked(e.target.checked);
    if (!e.target.checked && state.tip) {
      dispatch({
        type: REMOVE_TIP,
      });
    }
  };

  const convertDateToUTC = (date?: string, time?: string, timeZone?: string): string => {
    if (!date || !time || !timeZone) {
      return "";
    }
    const timeZoneOffset = getTimezoneOffset(timeZone) / (60 * 60 * 1000);
    const [hour, minutes] = time.split(":");
    const hourAfterOffset = Number(hour) - timeZoneOffset;
    const nowDate = new Date(date);
    nowDate.setUTCHours(hourAfterOffset);
    nowDate.setMinutes(Number(minutes));
    return nowDate.toISOString();
  };

  const onSubmit = async (data: any) => {
    // TODO: handle create form
    const products: any = [];
    const customProducts: any = [];
    state.items?.forEach((item) => {
      products.push({
        // if edit include item productId
        // @ts-ignore
        id: item.productId,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        code: null,
        codeId: null,
        ruleId: null,
        comment: item.comment,
        categoryId: item.category.id,
        categoryName: item.category.name,
        options: item.options?.map((option) => option.id) || [],
      });
    });
    state.voucherItems?.forEach((item) => {
      products.push({
        // if edit include item productId
        // @ts-ignore
        id: item.productId,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        code: item.code,
        codeId: item.codeId,
        ruleId: item.ruleId,
        comment: item.comment,
        categoryId: item.category.id,
        categoryName: item.category.name,
        options: item.options?.map((option) => option.id) || [],
      });
    });
    Object.values(state.customItems)?.forEach((item) => {
      customProducts.push({
        // if edit include item productId
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      });
    });

    const formData: any = {
      client: {
        name: data.guest_name,
        email: data.email || null,
        phoneNumber: data.phone_number.replace(/ /g, ""),
      },
      tax: Number(orderCalculations.taxAmount),
      totalNet: Number(orderCalculations.totalNet),
      totalGross: Number(orderCalculations.totalGross),
      grandTotal: Number(orderCalculations.grandTotal),
      receiptAmount: Number(orderCalculations.receiptAmount),
      cutlery: state.cutlery,
      type: data.order_type,
      paymentGateway: null,
      tip: Number(orderCalculations.tip),
      discount: state.discount
        ? {
            id: state.discount.id,
            type: state.discount.type,
            code: state.discount.code,
          }
        : null,
      voucher:
        state.vouchers.length === 1 && state.vouchers[0].program.type !== VoucherType.PRE_FIXE
          ? {
              id: state.vouchers[0].id,
              code: state.vouchers[0].code,
            }
          : null,
      products,
      customProducts,
      scheduledDate:
        data.delivery_date && data.delivery_time
          ? convertDateToUTC(data.delivery_date, data.delivery_time, selectedHub?.city?.time_zone)
          : null,
      hotel: {
        id: selectedHotel?.id,
        roomNumber: data.room_number,
        menuId: state.menu?.id,
        name: selectedHotel?.name,
        hubId: selectedHotel?.hub.id,
        hubName: selectedHotel?.hub.name,
      },
      paymentType: data.payment_type,
      comment: data.comment,
      nonce: null,
    };

    if (isEditMode) {
      try {
        await orderService.put(`/${orderId}`, {
          ...formData,
          version: orderData?.version,
        });
        // TODO: update edit messages
        pushNotification(t("order_created"), { type: "success" });
        history.push(`/orders?city=${selectedHotel?.hub?.city?.id}&hubs=${selectedHotel?.hub.id}&order=${orderId}`);
      } catch (error) {
        pushNotification(t("error_creating_order"), { type: "error" });
      }
    } else {
      try {
        const result = await orderService.post("", formData);
        pushNotification(t("order_created"), { type: "success" });
        const order = result.data.payload;
        history.push(`/orders?city=${selectedHotel?.hub?.city?.id}&hubs=${selectedHotel?.hub.id}&order=${order.id}`);
      } catch (error) {
        pushNotification(t("error_creating_order"), { type: "error" });
      }
    }
  };

  const getHubHotels = async (hub: HubV2) => {
    setSelectedHotel(null);
    dispatch({
      type: SET_MENU,
      payload: null,
    });
    try {
      const result = await networkService.get<HTTPResourceResponse<Hotel[]>>(
        `/hotels?statuses[0]=true&hub_ids[0]=${hub.id}`
      );
      setHotels(result.data);
    } catch (error: any) {
      pushNotification(error.response?.data?.message, {
        type: "error",
      });
    } finally {
      // setLoading(false);
    }
  };

  const searchHotels = async (query: OnQueryParams) => {
    const { filter, page } = query;
    const params = qs.stringify({
      name: filter,
      page,
      statuses: ["true"],
    });
    const result = await networkService.get<HTTPResourceResponse<Hotel[]>>(
      `/hotels?${params}${selectedHub ? `&hub_ids[0]=${selectedHub.id}` : ""}`
    );
    return result.data;
  };

  const searchHubs = async (query: OnQueryParams) => {
    const { filter } = query;
    const result =
      hubs?.payload?.filter((hub) =>
        hub.name.toLocaleLowerCase().includes((filter || "").toLocaleLowerCase().trim())
      ) || [];
    return {
      payload: result,
      total: result.length,
    };
  };

  const handleAddCustomItem = (item: { name: string; price: number }) => {
    const itemId = item.name + item.price;
    dispatch({
      type: ADD_UPDATE_SPECIAL_ITEM,
      payload: { ...item, id: itemId },
    });
  };

  if (loading) {
    return (
      <Grid gutter={0} className="orders-app-container">
        <Card size="small" className="h-100">
          <div className="ui-flex v-center between mb-10">
            <Skeleton parts={["cardHeaderAction"]} className="w-100" />
          </div>
          <Row>
            <Column size={6}>
              <Skeleton parts={["block"]} />
              <Skeleton parts={["block"]} className="mt-10" />
              <Skeleton parts={["block"]} className="mt-10" />
            </Column>
            <Column size={6}>
              <Skeleton parts={["block"]} />
              <Skeleton parts={["block"]} className="mt-10" />
            </Column>
          </Row>
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0} className="orders-app-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card size="small" className="h-100">
          <div className="ui-flex v-center between mb-10">
            <div className="ui-flex v-center pl-10">
              <Typography className="ui-block" size="large" bold>
                {/* if edit order show, Edit #{order number} */}
                {isEditMode ? `${t("edit_order")} #${orderData?.number}` : t("new_order")}
              </Typography>
              {selectedHub && (
                <Typography className="ui-block ml-10" muted>
                  {selectedHub.city?.name} ({timeZoneTime})
                </Typography>
              )}
            </div>
            <div className="ui-flex end v-center">
              <Button onClick={() => history.goBack()} variant="ghost" className="px-20 mr-10">
                {t("cancel")}
              </Button>
              <Button type="submit" className="px-20">
                {t("save")}
              </Button>
            </div>
          </div>
          <Row>
            <Column size={6}>
              {/* Hotel Info */}
              <Card className="orders-app-card-block" size="small">
                <FormControl label={t("hotel")} vertical>
                  <AsyncSelect
                    value={selectedHotel}
                    placeholder={t("selectHotel")}
                    onChange={(hotel: Hotel) => {
                      if (
                        selectedHotel &&
                        (state.items.length || state.voucherItems.length || state.customItems !== {})
                      ) {
                        setHotelChangeModal({
                          open: true,
                          hotel,
                        });
                      } else {
                        setSelectedHotel(hotel);
                        setSelectedHub(hotel.hub);
                      }
                    }}
                    data={hotels?.payload}
                    total={hotels?.total || hotels?.payload?.length || 0}
                    onQuery={searchHotels}
                    labelKey="name"
                    valueKey="id"
                    renderLabel={(hotel: Hotel) => `${hotel.code} - ${hotel.name}`}
                  />
                </FormControl>
                <FormControl label={t("hub")} className="mt-10" vertical>
                  <AsyncSelect
                    value={selectedHub}
                    placeholder={t("selectHub")}
                    onChange={(hub: HubV2) => {
                      setSelectedHub(hub);
                      getHubHotels(hub);
                    }}
                    data={hubs?.payload || []}
                    total={hubs?.total || hubs?.payload?.length || 0}
                    onQuery={searchHubs}
                    loading={hubsLoading}
                    labelKey="name"
                    valueKey="id"
                  />
                </FormControl>
                <Row>
                  <Column size={6}>
                    <FormControl label={t("room_number")} className="mt-10" vertical>
                      <Input
                        className="w-100"
                        placeholder={t("type_room_number")}
                        {...register("room_number")}
                        error={errors?.room_number?.message}
                      />
                    </FormControl>
                  </Column>
                  <Column size={6}>
                    <div className="ui-flex w-100 h-100 end v-end">
                      {/* feature not implemented yet */}
                      {/* <Link component={ButtonBase} size="small">
                        User profile matched in PMS
                      </Link> */}
                    </div>
                  </Column>
                </Row>
              </Card>
              {/* Gues info */}
              <Card className="orders-app-card-block mt-5" size="small">
                <Row>
                  <Column size={6}>
                    <FormControl label={t("guest_name")} vertical>
                      <Input
                        {...register("guest_name")}
                        className="w-100"
                        placeholder={t("enter_guest_name")}
                        error={errors?.guest_name?.message}
                      />
                    </FormControl>
                  </Column>
                  <Column size={6}>
                    <FormControl label={t("phone_number")} vertical>
                      <PhoneNumberInput
                        placeholder={t("enter_guest_phone")}
                        inputProps={{
                          ...register("phone_number"),
                          error: errors?.phone_number?.message,
                        }}
                      />
                    </FormControl>
                  </Column>
                </Row>
              </Card>
              {/* Payment */}
              {selectedHotel && (
                <Card className="orders-app-card-block mt-5" size="small">
                  <Typography className="ui-block">{t("payment_type")}</Typography>
                  <div className="ui-flex v-start mt-10">
                    <div className="ui-flex column">
                      <Radio
                        value={PaymentType.CREDIT_CARD}
                        {...register("payment_type")}
                        label={t("credit_card")}
                        disabled={!selectedHotel?.allow_payment_credit_card}
                      />
                      {!selectedHotel?.allow_payment_credit_card && (
                        <Typography size="small" className="ui-block pl-30 text-danger">
                          <Icon type="Warning" className="mt-5 mr-5" size={10} />
                          {t("credit_card_not_available")}
                        </Typography>
                      )}
                    </div>
                    <div className="ui-flex column ml-20">
                      <Radio
                        value={PaymentType.CHARGE_TO_ROOM}
                        {...register("payment_type")}
                        label={t("room_charge")}
                      />
                      {!selectedHotel?.allow_payment_room_charge && (
                        <Typography size="small" className="ui-block pl-30 text-danger">
                          <Icon type="Warning" className="mt-5 mr-5" size={10} />
                          {t("credit_card_not_available")}
                        </Typography>
                      )}
                    </div>
                  </div>
                  {/* if in edit mode do not render payment */}
                  {isEditMode ? null : <Payment visible={paymentType === PaymentType.CREDIT_CARD} />}
                </Card>
              )}
              {/* Order Info */}
              <Card className="orders-app-card-block mt-5" size="small">
                <Row>
                  <Column size={4}>
                    <FormControl label={t("order_type")} vertical>
                      <Select selectProps={register("order_type")}>
                        <Option value="ROOM_SERVICE">Room Service</Option>
                        <Option value="CATERING">Catering</Option>
                        <Option value="AMENITY">Amenity</Option>
                        <Option value="FAAS">Faas</Option>
                      </Select>
                    </FormControl>
                  </Column>
                  <Column size={4}>
                    <FormControl label="Delivery Date" vertical>
                      {/* <Input className="w-100" placeholder="Pick a date" /> */}
                      <DatePicker
                        minDate={new Date()}
                        inputProps={{
                          ...register("delivery_date"),
                          placeholder: t("pick_a_date"),
                          error: errors?.delivery_date?.message,
                        }}
                      />
                    </FormControl>
                  </Column>
                  <Column size={4}>
                    <FormControl label={t("delivery_time")} vertical>
                      <Select
                        value={deliveryTime}
                        selectProps={register("delivery_time")}
                        error={errors?.delivery_time?.message}
                      >
                        {getHotelSchedule().map((schedule) => (
                          <Option
                            value={schedule.key}
                            key={schedule.key}
                            disabled={schedule.disabled}
                            hidden={schedule.hidden}
                          >
                            {schedule.value}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </Column>
                </Row>
              </Card>
              {/* Comment */}
              <Card className="orders-app-card-block mt-5" size="small">
                <FormControl label={t("print_comment")} vertical>
                  <Textarea {...register("comment")} className="w-100" placeholder={t("optional_comment")} />
                  {/* <div className="ui-flex end w-100 mt-10">
                    <Link size="small">Add order comment (internal)</Link>
                  </div> */}
                </FormControl>
              </Card>
            </Column>
            <Column size={6}>
              {/* items */}
              <Card className="orders-app-card-block" size="small">
                <ItemTabs loading={menuLoading} selectedHotel={!!selectedHotel} />
                <AddCustomItem onAddItem={handleAddCustomItem} />
                <Divider vertical={20} />
                <ItemsTable />
              </Card>
              {/* Voucher */}
              <Card className="orders-app-card-block mt-5" size="small">
                <Row>
                  <FormControl label={t("add_voucher")} vertical>
                    <div className="ui-flex v-center">
                      <Input
                        value={voucherCode}
                        placeholder={t("enter_voucher_code")}
                        onChange={(e) => setVoucherCode(e.currentTarget.value)}
                        disabled={Boolean(state.discount) || !selectedHotel}
                      />
                      {voucherCode && (
                        <Link
                          component={ButtonBase}
                          size="small"
                          className="ml-10"
                          onClick={addVoucher}
                          disabled={Boolean(state.discount)}
                        >
                          {t("apply_voucher")}
                        </Link>
                      )}
                    </div>
                  </FormControl>
                </Row>
              </Card>
              {/* Price modifiers */}
              <Card className="orders-app-card-block mt-5" size="small">
                <Discount phoneNumber={phoneNumber} selectedHotel={!!selectedHotel} />
              </Card>
              {/* tip */}
              <Card className="orders-app-card-block mt-5" size="small">
                <div className="ui-flex v-start between">
                  <div>
                    <Checkbox label="Tip" onChange={handleTipChange} />
                    {tipChecked && <OrderTip />}
                  </div>
                  <div className="order-create-info-prices">
                    <div className="ui-flex between">
                      <Typography>{t("subtotal")}</Typography>
                      <Typography className="ui-block pl-40">${orderCalculations.receiptAmount}</Typography>
                    </div>
                    {state.discount && (
                      <div className="ui-flex between">
                        <Typography>{t("discount")}</Typography>
                        <Typography className="ui-block pl-40">
                          {state.discount.type === PriceMeasurementType.AMOUNT && "$"}
                          {(state.discount.amount || 0).toFixed(2)}
                          {state.discount.type === PriceMeasurementType.PERCENTAGE && "%"}
                        </Typography>
                      </div>
                    )}
                    <div className="ui-flex between">
                      <Typography>{t("tax")}</Typography>
                      <Typography className="ui-block pl-40">${orderCalculations.taxAmount}</Typography>
                    </div>
                    {state.compensation && (
                      <div className="ui-flex between">
                        <Typography>{t("comp")}</Typography>
                        <Typography className="ui-block pl-40">
                          {state.compensation.type === CompensationTypes.AMOUNT && "$"}
                          {state.compensation.value}
                          {state.compensation.type === CompensationTypes.PERCENTAGE && "%"}
                        </Typography>
                      </div>
                    )}
                    {state.vouchers.length > 0 && (
                      <div className="ui-flex between">
                        <Typography>{t("voucher")}</Typography>
                        <Typography className="ui-block pl-40">{`$${orderCalculations.totalVoucherPrice}`}</Typography>
                      </div>
                    )}
                    {state.tip && (
                      <div className="ui-flex between">
                        <Typography>{t("tip")}</Typography>
                        <Typography className="ui-block pl-40">{`$${orderCalculations.tip}`}</Typography>
                      </div>
                    )}
                    <div className="ui-flex between mt-10">
                      <Typography bold>{t("total")}</Typography>
                      <Typography bold className="ui-block pl-40">
                        {`$${orderCalculations.grandTotal}`}
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            </Column>
          </Row>
        </Card>
      </form>
      {hotelChangeModal.open && (
        <ConfirmModal onClose={() => setHotelChangeModal({ open: false, hotel: null })}>
          <Typography h2>{t("confirm_assign")}</Typography>
          <Divider />
          <Typography className="ui-flex mb-10">{t("change_menu_message")}</Typography>
          <Divider />
          <div className="ui-flex v-center end">
            <Button className="mr-10" variant="ghost" onClick={() => setHotelChangeModal({ open: false, hotel: null })}>
              {t("cancel")}
            </Button>
            <Button
              disabled={false}
              variant="primary"
              onClick={() => {
                if (hotelChangeModal.hotel) {
                  setSelectedHotel(hotelChangeModal.hotel);
                  setSelectedHub(hotelChangeModal.hotel.hub);
                }
                setHotelChangeModal({ open: false, hotel: null });
              }}
            >
              {t("assing")}
            </Button>
          </div>
        </ConfirmModal>
      )}
    </Grid>
  );
};

export { CreateOrder };
