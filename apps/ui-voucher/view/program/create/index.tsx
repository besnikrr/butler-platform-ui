import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Row,
  Column,
  Card,
  Typography,
  Divider,
  Skeleton,
  useTranslation,
  AppContext,
  LeavePageAlert,
  FormControl,
  Input,
  Select,
  Option,
  Textarea,
  FormGroup,
  Icon,
  NoResult,
  ErrorMessage,
  LookupField,
  useApi,
} from "@butlerhospitality/ui-sdk";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  VoucherType,
  HotelV2,
  VoucherPayer,
  PaymentType,
  PERMISSION,
  createVoucherProgramValidatorV2,
  AppEnum,
  Category,
} from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import NoPermissions from "../../../component/NoPermissions";
import { useFetchHotels } from "../../../store/hotel";
import { useFetchMenu } from "../../../store/menu";
import { useCreateProgram } from "../../../store/program";

function ProgramCreateView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();

  const serviceApi = useApi(AppEnum.VOUCHER);
  const urlParams = new URLSearchParams(window.location.search);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    resetField,
    clearErrors,
    formState: { errors },
    control,
    getValues,
  } = useForm<any>({
    resolver: yupResolver(createVoucherProgramValidatorV2),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "rules" });

  const canCreateVoucherProgram = can && can(PERMISSION.VOUCHER.CAN_CREATE_VOUCHER_PROGRAM);

  const [error, setError] = useState<string>("");
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [payer, setPayer] = useState<string>("");
  const [configType, setConfigType] = useState<any>();
  const [amountPrefixNode, setAmountPrefixNode] = useState<string>("$");
  const [amountPlaceholder, setAmountPlaceholder] = useState<string>("0.00");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [hotelId, setHotelId] = useState<string | number>("");
  const [selectedHotel, setSelectedHotel] = useState<HotelV2>();
  const [menuId, setMenuId] = useState<string | number>("");
  const [preFixeCategorySelectError, setPreFixeCategorySelectError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const { data: hotelData, isLoading: hotelsLoading } = useFetchHotels({});

  const { data: menuData } = useFetchMenu({
    enabled: !!menuId,
    id: menuId,
  });

  useEffect(() => {
    const formattedCategories = Object.entries(menuData?.payload?.categories || {}).map((key) => {
      const categoryItem = {
        id: key[0],
        name: key[1].name,
        subcategories: Object.entries(key[1].subcategories || {}).map((subKey) => {
          return {
            id: subKey[0],
            name: subKey[1].name,
          };
        }),
      };

      return categoryItem;
    });

    setCategories(formattedCategories);
  }, [menuData]);

  useEffect(() => {
    setMenuId(selectedHotel?.menu_id || "");
  }, [selectedHotel]);

  const {
    mutateAsync: createProgram,
    isError: isCreateProgramError,
    isLoading: isCreateProgramLoading,
  } = useCreateProgram();

  useEffect(() => {
    reset({
      payer: VoucherPayer.BUTLER,
      payer_percentage: 100,
      code_limit: 100,
      hotel_id: hotelId,
    });

    if (urlParams.has("hotelId")) {
      const hotelParamId = urlParams.get("hotelId");
      if (hotelParamId) {
        setHotelId(hotelParamId);
        setSelectedHotel(hotelData?.payload?.find((item) => `${item.id}` === hotelParamId));
      }
    }
  }, [hotelId, hotelData]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setHasChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: any) => {
    setError("");

    try {
      let rules = [];

      if (data?.rules?.length) {
        rules = data.rules.map((item: any) => {
          return {
            quantity: item.quantity && +item.quantity,
            max_price: item.max_price && +item.max_price,
            categories: (item.categories || []).map((element: string) => +element),
          };
        });
      }

      const parsedData = {
        ...data,
        status: "ACTIVE",
        hotel_id: data.hotel_id && +data.hotel_id,
        description: data?.description,
        type: configType,
        rules,
        payer_percentage: data?.payer_percentage && +data.payer_percentage,
        amount: data?.amount && +data.amount,
        amount_type: configType !== VoucherType.DISCOUNT ? "FIXED" : data?.amount_type,
        code_limit: data?.code_limit && +data.code_limit,
      };

      await createProgram(parsedData);

      history.push(hotelId ? `/voucher/programs/${hotelId}` : `/voucher/hotel-programs/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const onLeavePage = (url: string) => {
    if (!hasChanges) {
      return history.push(url);
    }

    return setLeaveModal(true);
  };

  const renderHotels = () => {
    return (
      <FormControl label={`${t("HOTEL")}*`} className="my-10">
        <LookupField<HotelV2>
          value=""
          disabled={urlParams.has("hotelId")}
          selectProps={{
            ...register("hotel_id"),
            onChange: (e: any) => {
              setHotelId(e.target.value);
              setSelectedHotel(hotelData?.payload?.find((item) => `${item.id}` === e.target.value));
            },
          }}
          error={errors?.hotel_id?.message}
          initData={hotelData}
          placeholder={t("SELECT_HOTEL")}
          onQuery={(queryParams) => {
            return serviceApi.get(`/hotels?page=${queryParams.page}&search=${queryParams.filter}`);
          }}
        />
      </FormControl>
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    resetField("rules");
    append({ quantity: "", max_price: undefined, categories: [] });
    const selected = categories?.find((item) => `${item.id}` === categoryId);

    if (selected) {
      return setSelectedCategory(selected);
    }

    return setSelectedCategory(null);
  };

  const renderSelectCategories = (categoriesSelect: Category[]): any => {
    if (categoriesSelect.length) {
      return (categoriesSelect || []).map((item: Category) => <Option value={item.id}>{item.name}</Option>);
    }

    return null;
  };

  const renderParentCategories = () => {
    return (
      <FormControl className="category-wrapper" label={`${t("Category")}*`}>
        <Select
          value=""
          placeholder={t("SELECT_CATEGORY")}
          selectProps={{
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
              handleCategoryChange(e.target.value);
            },
          }}
          error={preFixeCategorySelectError}
        >
          <Option value="" disabled hidden>
            {t("SELECT_CATEGORY")}
          </Option>
          {renderSelectCategories(categories || [])}
        </Select>
      </FormControl>
    );
  };

  const renderConditions = () => {
    return (
      <div>
        {(fields || []).map((item, index) => (
          <div key={item.id}>
            <div className="ui-flex between mt-30 mb-10">
              <Typography p>Condition {index + 1}</Typography>
              {fields.length !== 1 && (
                <Button
                  type="button"
                  variant="danger-ghost"
                  size="small"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Icon type="Delete" size={16} />
                </Button>
              )}
            </div>
            <FormControl label={`${t("Categories")}*`} className="w-100 my-10">
              <Select
                multiple
                selectProps={register(`rules[${index}].categories`)}
                placeholder="Select Categories"
                error={errors?.rules?.[index]?.categories?.message}
              >
                {(selectedCategory.subcategories || []).map((element: any) => (
                  <Option value={element.id}>{element.name}</Option>
                ))}
              </Select>
            </FormControl>
            <FormGroup className="ui-flex between my-10">
              <FormControl label={t("Quantity*")}>
                <Input
                  type="number"
                  {...register(`rules[${index}].quantity`)}
                  placeholder="0"
                  error={errors?.rules?.[index]?.quantity?.message}
                  min={0}
                />
              </FormControl>
              <FormControl label={t("Price limit*")}>
                <Input
                  prefixNode="$"
                  placeholder="0.00"
                  type="number"
                  {...register(`rules[${index}].max_price`)}
                  error={errors?.rules?.[index]?.max_price?.message}
                />
              </FormControl>
            </FormGroup>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="small"
          onClick={() => append({ quantity: "", max_price: undefined, categories: [] })}
          leftIcon={<Icon type="Plus" size={20} />}
          className="mt-20"
        >
          Add Another Condition
        </Button>
      </div>
    );
  };

  const renderPerDiemFormView = () => {
    return (
      <FormControl label={`${t("AMOUNT_USD")}*`}>
        <Input
          type="number"
          prefixNode="$"
          step="any"
          placeholder="0.00"
          className="w-100"
          {...register("amount")}
          error={errors?.amount?.message}
        />
      </FormControl>
    );
  };

  const renderDiscountFormView = () => {
    return (
      <FormGroup>
        <FormControl label={`${t("PAYMENT_TYPE")}*`}>
          <Select
            selectProps={{
              ...register("amount_type"),
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const paymentType = e.target.value;

                setValue("amount_type", paymentType);
                resetField("amount");

                if (paymentType === PaymentType.PERCENTAGE) {
                  setAmountPlaceholder("0");
                  setAmountPrefixNode("%");
                } else {
                  setAmountPlaceholder("0.00");
                  setAmountPrefixNode("$");
                }
              },
            }}
          >
            <Option value="" disabled hidden>
              {t("PAYMENT_TYPE")}
            </Option>
            <Option value={PaymentType.FIXED}>$</Option>
            <Option value={PaymentType.PERCENTAGE}>%</Option>
          </Select>
        </FormControl>
        <FormControl label={`${t("DISCOUNT")}*`}>
          <Input
            type="number"
            step="any"
            prefixNode={amountPrefixNode}
            placeholder={amountPlaceholder}
            className="w-100"
            {...register("amount")}
            error={errors?.amount?.message}
          />
        </FormControl>
      </FormGroup>
    );
  };

  const renderPreFixeFormView = () => {
    return (
      <>
        <FormGroup className="my-10">
          {categories && renderParentCategories()}
          <FormControl label={`${t("PRICE")}*`}>
            <Input
              type="number"
              prefixNode="$"
              placeholder="0.00"
              min="0"
              className="w-100"
              {...register("amount")}
              error={errors?.amount?.message}
            />
          </FormControl>
        </FormGroup>
        {selectedCategory && renderConditions()}
      </>
    );
  };

  const renderConfigByType = () => {
    switch (configType) {
      case VoucherType.PER_DIEM:
        return renderPerDiemFormView();
      case VoucherType.DISCOUNT:
        return renderDiscountFormView();
      case VoucherType.PRE_FIXE:
        return renderPreFixeFormView();
      default:
        return null;
    }
  };

  const renderVoucherTypeOptions: any = () => {
    return Object.keys(VoucherType).map((item: string) => <Option value={item}>{item}</Option>);
  };

  const handleOnConfigChange = (e: any) => {
    setValue("type", e.currentTarget.value);
    clearErrors("type");
    setConfigType(e.currentTarget.value);
    resetField("amount");
    setSelectedCategory(null);
    resetField("rules");
  };

  if (!canCreateVoucherProgram) return <NoPermissions entity="Create voucher program" />;

  if (hotelsLoading) {
    return (
      <Grid gutter={0}>
        <Card>
          <Skeleton parts={["title", "divider", "labelField-5"]} />
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
                <Typography h2>{t("Create New Voucher Program")}</Typography>
              </div>
            }
          >
            <div className="mt-30">
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <FormControl label={`${t("VOUCHER_PROGRAM")}*`} className="my-10">
                      <Input
                        placeholder={t("ENTER_VOUCHER_PROGRAM_NAME")}
                        {...register("name")}
                        error={errors?.name?.message}
                      />
                    </FormControl>
                    {hotelData && renderHotels()}
                    <FormControl label={`${t("PAYER")}*`} className="my-10">
                      <Select
                        value=""
                        selectProps={{
                          ...register("payer"),
                          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                            setPayer(e.target.value);
                            setValue("payer", e.target.value);
                            setValue("payer_percentage", e.target.value === VoucherPayer.BUTLER ? 100 : null);
                          },
                        }}
                      >
                        <Option value={VoucherPayer.BUTLER}>{VoucherPayer.BUTLER}</Option>
                        <Option value={VoucherPayer.HOTEL}>{VoucherPayer.HOTEL}</Option>
                      </Select>
                    </FormControl>
                    <FormControl label={`${t("PAYER_PERCENTAGE")}*`} className="my-10">
                      <Input
                        placeholder={t("PAYER_PERCENTAGE")}
                        type="number"
                        min="0"
                        max="100"
                        disabled={payer !== VoucherPayer.HOTEL}
                        {...register("payer_percentage")}
                        error={errors?.payer_percentage?.message}
                      />
                    </FormControl>
                    <FormControl label={t("NOTES")} className="my-10">
                      <Textarea {...register("description")} />
                    </FormControl>
                    <FormControl label={`${t("CODE_LIMIT_PER_DAY")}*`} className="my-10">
                      <Input
                        placeholder={t("CODE_LIMIT")}
                        type="number"
                        min="0"
                        {...register("code_limit")}
                        error={errors?.code_limit?.message}
                      />
                    </FormControl>
                    <FormControl label={`${t("VOUCHER_TYPE")}*`} className="my-10 type-wrapper">
                      <Select
                        value={configType ?? ""}
                        selectProps={{
                          onChange: handleOnConfigChange,
                        }}
                        error={errors?.type?.message}
                      >
                        <Option value="" disabled hidden selected>
                          {t("SELECT_VOUCHER_TYPE")}
                        </Option>
                        {renderVoucherTypeOptions()}
                      </Select>
                    </FormControl>
                    {renderConfigByType()}
                    <Divider vertical={30} />
                    <div className="mb-30">{isCreateProgramError && <ErrorMessage error={error} />}</div>
                    <Row>
                      <div className="form-bottom-action">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => {
                            onLeavePage(`/voucher/hotel-programs/list`);
                          }}
                        >
                          {t("CANCEL")}
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isCreateProgramLoading}
                          onClick={() => {
                            if (getValues("type") === VoucherType.PRE_FIXE && !selectedCategory) {
                              setPreFixeCategorySelectError("Category is a required field!");
                            }
                          }}
                        >
                          {t("SAVE")}
                        </Button>
                      </div>
                    </Row>
                  </div>
                </form>
              </Column>
            </div>
            {!hotelData ||
              ((hotelData.payload || []).length < 1 && !hotelsLoading && (
                <div>
                  <NoResult />
                </div>
              ))}
          </Card>
          <LeavePageAlert
            modal={leaveModal}
            setModal={setLeaveModal}
            onLeave={() => history.push(`/voucher/hotel-programs/list`)}
          />
        </Column>
      </Row>
    </Grid>
  );
}

export default ProgramCreateView;
