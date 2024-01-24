import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Row,
  Column,
  Card,
  Input,
  Textarea,
  FormControl,
  Select,
  Option,
  Skeleton,
  Typography,
  useTranslation,
  LeavePageAlert,
  pushNotification,
  ErrorMessage,
  Divider,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VoucherPayer, baseVoucherValidatorV2, Program, ProgramRules } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { programDetails } from "../../../routes";
import { useFetchProgram, useUpdateProgram } from "../../../store/program";

function ProgramDetailsEdit() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [payerData, setPayerData] = useState("");
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<Program>({
    resolver: yupResolver(baseVoucherValidatorV2),
  });

  const {
    data: programData,
    isError: isProgramError,
    isLoading: isProgramLoading,
  } = useFetchProgram({
    id: params.id,
  });

  const {
    mutateAsync: updateProgram,
    isLoading: isUpdateProgramLoading,
    isError: isUpdateProgramError,
  } = useUpdateProgram(params.id);

  useEffect(() => {
    const subscription = watch((_value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    reset({
      name: programData?.payload?.name,
      payer: programData?.payload?.payer,
      payer_percentage: programData?.payload?.payer_percentage,
      code_limit: programData?.payload?.code_limit,
      description: programData?.payload?.description,
      amount_type: programData?.payload?.amount_type,
    });
  }, [programData, reset]);

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      return setLeaveModal(true);
    }
    return history.push(url);
  };

  const onSubmit = async (data: any) => {
    setError("");
    try {
      let rules: ProgramRules[] = [];

      if (programData?.payload?.rules?.length) {
        rules = (programData.payload.rules || []).map((item: any) => {
          return {
            quantity: item.quantity && +item.quantity,
            max_price: item.max_price && +item.max_price,
            categories: (item.categories || []).map((element: any) => +element?.id),
          };
        });
      }

      const parsedData = {
        ...data,
        payer_percentage: data?.payer_percentage && +data.payer_percentage,
        code_limit: data?.code_limit && +data.code_limit,
        type: programData?.payload?.type,
        description: data?.description,
      };

      if (rules.length) {
        parsedData.rules = rules;
      }

      await updateProgram(parsedData);
      history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  if (isProgramLoading) {
    return (
      <Grid gutter={0}>
        <Card>
          <Skeleton parts={["title", "divider", "labelField-5"]} />
        </Card>
      </Grid>
    );
  }

  if (isProgramError) {
    pushNotification(t("Error fetching entity", { entity: "program" }), {
      type: "error",
    });
    return null;
  }

  return (
    <Grid gutter={0}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Card
            className="network-content"
            page
            header={
              <div>
                <Typography h2>{programData?.payload?.name}</Typography>
              </div>
            }
          >
            <Row>
              <Column offset={3} size={6}>
                <FormControl label={`${t("HOTEL_NAME")}*`} className="my-10">
                  <Input value={programData?.payload?.hotels && programData?.payload?.hotels?.[0].name} disabled />
                </FormControl>
                <FormControl label={`${t("VOUCHER_PROGRAM")}*`} className="my-10">
                  <Input
                    placeholder={t("ENTER_VOUCHER_PROGRAM_NAME")}
                    {...register("name")}
                    error={errors?.name?.message}
                  />
                </FormControl>
                <FormControl label={`${t("PAYER")}*`} className="my-10">
                  <Select
                    value=""
                    selectProps={{
                      ...register("payer"),
                      onChange: (e: any) => {
                        setPayerData(e.target.value);
                        setValue("payer", e.target.value);
                        setValue("payer_percentage", e.target.value === VoucherPayer.BUTLER ? 100 : 0);
                      },
                    }}
                  >
                    <Option value="" disabled hidden>
                      Payer
                    </Option>
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
                    {...register("payer_percentage")}
                    disabled={payerData === VoucherPayer.BUTLER}
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
                <Divider vertical={30} />
                <div className="mb-30">{isUpdateProgramError && <ErrorMessage error={error} />}</div>
                <div className="form-bottom-action mt-30">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      onLeavePage(`${programDetails.path}/${encodeURIComponent(params.id)}`);
                    }}
                  >
                    {t("CANCEL")}
                  </Button>
                  <Button variant="primary" type="submit" disabled={isUpdateProgramLoading}>
                    {t("SAVE")}
                  </Button>
                </div>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`${programDetails.path}/${encodeURIComponent(params.id)}`)}
              />
            </Row>
          </Card>
        </Row>
      </form>
    </Grid>
  );
}

export default ProgramDetailsEdit;
