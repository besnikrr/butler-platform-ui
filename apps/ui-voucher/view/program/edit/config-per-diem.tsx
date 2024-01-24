import { useEffect, useState } from "react";
import { Button, Input, FormControl, useTranslation, Divider, ErrorMessage } from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { perdiemConfigValidatorV2, Program, VoucherType } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";

import { AxiosError } from "axios";
import { programDetails } from "../../../routes";
import { useUpdateProgram } from "../../../store/program";

export default ({ voucherProgram }: { voucherProgram: Program }): JSX.Element => {
  const { t } = useTranslation();

  const history = useHistory();
  const [error, setError] = useState<string>("");
  const params = useParams<{ id: string }>();

  const {
    mutateAsync: updateProgram,
    isLoading: isUpdateProgramLoading,
    isError: isUpdateProgramError,
  } = useUpdateProgram(params.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Program>({
    resolver: yupResolver(perdiemConfigValidatorV2),
  });

  useEffect(() => {
    reset({
      amount: voucherProgram?.amount,
    });
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setError("");
      await updateProgram({
        ...data,
        name: voucherProgram?.name,
        type: VoucherType.PER_DIEM,
      });
      history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl label={`${t("AMOUNT_USD")}*`} className="my-10">
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
        <Divider vertical={30} />
        <div className="mb-30">{isUpdateProgramError && <ErrorMessage error={error} />}</div>
        <div className="form-bottom-action mt-30">
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
    </>
  );
};
