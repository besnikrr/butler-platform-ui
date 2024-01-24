import { useEffect, useState } from "react";
import {
  Button,
  Input,
  FormControl,
  Select,
  Option,
  FormGroup,
  useTranslation,
  Divider,
  ErrorMessage,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PaymentType, VoucherType, discountConfigValidatorV2, Program, AmountType } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { programDetails } from "../../../routes";
import { useUpdateProgram } from "../../../store/program";

export default ({ voucherProgram }: { voucherProgram: Program }): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const [amountPrefixNode, setAmountPrefixNode] = useState<string>(
    voucherProgram.amount_type === AmountType.FIXED ? "$" : "%"
  );
  const [amountPlaceholder, setAmountPlaceholder] = useState<string>("0.00");
  const [error, setError] = useState<string>("");
  const params = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<any>({
    resolver: yupResolver(discountConfigValidatorV2),
  });

  const {
    mutateAsync: updateProgram,
    isLoading: isUpdateProgramLoading,
    isError: isUpdateProgramError,
  } = useUpdateProgram(params.id);

  useEffect(() => {
    reset({
      amount: voucherProgram?.amount,
      amount_type: voucherProgram?.amount_type,
    });
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setError("");
      await updateProgram({
        ...data,
        name: voucherProgram?.name,
        amount: data.amount && +data.amount,
        amount_type: data.amount_type,
        type: VoucherType.DISCOUNT,
      });
      history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormControl label={`${t("PAYMENT_TYPE")}*`} className="my-10">
            <Select
              selectProps={{
                ...register("amount_type"),
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                  const paymentType = e.target.value;
                  setValue("amount_type", paymentType);
                  setValue("amount", null);

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
                Payment type
              </Option>
              <Option value="FIXED">$</Option>
              <Option value="PERCENTAGE">%</Option>
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
        <Divider vertical={30} />
        <div className="mb-30">{isUpdateProgramError && <ErrorMessage error={error} />}</div>
        <div className="form-bottom-action mt-20">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
            }}
          >
            {t("CANCEL")}
          </Button>
          <Button variant="primary" type="submit" disabled={isUpdateProgramLoading}>
            {t("SAVE")}
          </Button>
        </div>
      </form>
      {error && <span>{error}</span>}
    </>
  );
};
