import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Typography,
  Select,
  Option,
  Input,
  ButtonBase,
  Link,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, Discount as DiscountType, PriceMeasurementType } from "@butlerhospitality/shared";
import { useFetch, Status } from "../../../hooks/use-fetch";
import { CompensationTypes, DiscountExplanations, discountExplanations } from "../../../util/constants";
import { useOrderContext } from "../store/order-context";
import { SET_DISCOUNT } from "../store/constants";

interface DiscountProps {
  phoneNumber: string;
  selectedHotel: boolean;
}

const Discount: React.FC<DiscountProps> = ({ phoneNumber, selectedHotel }) => {
  const { t } = useTranslation();
  const { dispatch, state } = useOrderContext();
  const [discountValue, setDiscountValue] = useState<number>(state.compensation?.value);
  const [discountType, setDiscountType] = useState<PriceMeasurementType>(
    state.compensation?.type || CompensationTypes.AMOUNT
  );
  const [discountCode, setDiscountCode] = useState<string>("");
  const discountData = useFetch(AppEnum.DISCOUNT)<DiscountType>(
    {
      path: `/discount/${discountCode}/${phoneNumber}`,
    },
    { enabled: false, retry: false, cacheTime: 0 }
  );

  const handleDiscountResponse = (): void => {
    if (discountData.status === Status.ERROR) {
      pushNotification(t("discount_code_not_found"), {
        type: "error",
      });
      return;
    }
    if (discountData.status === Status.SUCCESS) {
      const { startDate, endDate } = discountData.data.payload || {};
      if (
        (startDate && new Date(startDate).getTime() > new Date().getTime()) ||
        (endDate && new Date(endDate).getTime() < new Date().getTime())
      ) {
        pushNotification(t("invalid_discount_code"), {
          type: "error",
        });
        return;
      }

      dispatch({
        type: SET_DISCOUNT,
        payload: {
          discount: discountData.data.payload,
        },
      });
    }
  };

  const applyDiscount = (): void => {
    discountData.refetch();
  };

  const removeDiscount = (): void => {
    dispatch({
      type: SET_DISCOUNT,
      payload: {
        discount: null,
      },
    });
    setDiscountCode("");
  };

  const onDiscountCodeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (state.discount) {
      dispatch({
        type: SET_DISCOUNT,
        payload: {
          discount: null,
        },
      });
    }
    setDiscountCode(event.target.value);
  };

  useEffect(() => {
    handleDiscountResponse();
  }, [discountData.data, discountData.error]);

  const handleDiscountOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const discountExplanation = event.target.value;
    let value = 0;
    let type = PriceMeasurementType.AMOUNT;
    if (discountExplanation === DiscountExplanations.EMPLOYEE) {
      value = 50;
      type = PriceMeasurementType.PERCENTAGE;
    } else if (
      discountExplanation === DiscountExplanations.EXECUTIVES_DISCOUNT ||
      discountExplanation === DiscountExplanations.SALES_DEPARTMENT ||
      discountExplanation === DiscountExplanations.ACCOUNT_MANAGER ||
      discountExplanation === DiscountExplanations.CORPORATE_DISCOUNT
    ) {
      value = 100;
      type = PriceMeasurementType.PERCENTAGE;
    }
    setDiscountType(type);
    setDiscountValue(value);

    dispatch({
      type: SET_DISCOUNT,
      payload: {
        discount: {
          type,
          amount: value,
          amountUsed: 0,
          explanation: discountExplanation,
        },
      },
    });
  };

  const handleCompensationTypeSelect = (e: any) => {
    dispatch({
      type: SET_DISCOUNT,
      payload: {
        discount: {
          amount: 0,
          amountUsed: 0,
          ...state.discount,
          type: e.currentTarget.value,
        },
      },
    });
    setDiscountType(e.currentTarget.value as PriceMeasurementType);
  };

  const handleDiscountValueChange = (e: any) => {
    dispatch({
      type: SET_DISCOUNT,
      payload: {
        discount: {
          amountUsed: 0,
          ...state.discount,
          type: discountType,
          amount: Number(e.target.value),
        },
      },
    });
    setDiscountValue(Number(e.target.value));
  };

  return (
    <form>
      <Typography className="ui-block mb-10">{t("discount")}</Typography>
      <div className="ui-flex mt-10">
        <Input
          type="text"
          placeholder={t("discount_code")}
          value={discountCode}
          onChange={onDiscountCodeChange}
          className="mr-10"
          onKeyPress={(e) => {
            if (e.key === "Enter" && discountCode !== "") {
              applyDiscount();
            }
          }}
          disabled={Boolean(state.vouchers?.length) || !selectedHotel}
        />
        {!state.discount?.id ? (
          <Link
            component={ButtonBase}
            size="small"
            onClick={applyDiscount}
            disabled={discountCode === "" || Boolean(state.vouchers?.length) || !selectedHotel}
          >
            {t("apply_discount")}
          </Link>
        ) : (
          <Link component={ButtonBase} size="small" onClick={removeDiscount}>
            {t("remove_discount")}
          </Link>
        )}
      </div>
      <div className="ui-flex mt-10">
        <Input
          type="number"
          placeholder={t("discount")}
          value={discountValue}
          min={0}
          onChange={handleDiscountValueChange}
          disabled={Boolean(state.discount?.id) || Boolean(state.vouchers?.length) || !selectedHotel}
        />
        <Select
          selectProps={{ onChange: handleCompensationTypeSelect }}
          value={discountType}
          className="mx-10"
          disabled={Boolean(state.discount?.id) || Boolean(state.vouchers?.length) || !selectedHotel}
        >
          <Option value={PriceMeasurementType.AMOUNT}>USD</Option>
          <Option value={PriceMeasurementType.PERCENTAGE}>%</Option>
        </Select>
        <Select
          selectProps={{ onChange: handleDiscountOptionSelect }}
          style={{ width: 200 }}
          disabled={Boolean(state.discount?.id) || Boolean(state.vouchers?.length) || !selectedHotel}
        >
          {discountExplanations.map((explanation) => (
            <Option key={explanation.key} value={explanation.key}>
              {explanation.value}
            </Option>
          ))}
        </Select>
      </div>
    </form>
  );
};

export default Discount;
