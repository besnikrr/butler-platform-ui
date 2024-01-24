import { useEffect, useState } from "react";
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
  useApi,
  useTranslation,
  ErrorMessage,
  LeavePageAlert,
  LookupField,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { AppEnum, baseUserValidator, Role } from "@butlerhospitality/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { USER_BASE_ROUTE } from "../../../data/share";
import { useFetchRoles } from "../../../store/role";
import { useCreateUser } from "../../../store/user";

export default function CreateUser() {
  const { t } = useTranslation();
  const serviceApi = useApi(AppEnum.IAM);
  const history = useHistory();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>({ resolver: yupResolver(baseUserValidator) });
  const [error, setError] = useState<string>("");

  const { data: roles } = useFetchRoles({});
  const { mutateAsync: createUser, isError: isCreateUserError, isLoading: isCreateUserLoading } = useCreateUser();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setIsFormChanged(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onLeavePage = (url: string) => {
    if (isFormChanged) {
      return setLeaveModal(true);
    }

    return history.push(url);
  };

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      roles: data?.roles.filter((item: string) => {
        return item !== "false";
      }),
    };

    try {
      setError("");
      await createUser(submitData);
      history.push(`${USER_BASE_ROUTE}/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderRoles = () => (
    <FormControl label="Roles">
      <LookupField<Role>
        multiple
        selectProps={register(`roles`)}
        placeholder="Select Roles"
        initData={roles}
        error={errors?.roles?.message}
        onQuery={({ page, filter }) => serviceApi.get(`/roles?page=${page}&name=${filter}`)}
      />
    </FormControl>
  );

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="iam-content"
            page
            header={
              <div>
                <Typography h2>{t("create_user")}</Typography>
              </div>
            }
          >
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Typography h2>{t("general_information")}</Typography>
                  </Row>
                  <Divider />
                  <FormControl label={`${t("name")}*`}>
                    <Input placeholder={t("enter_name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  <FormControl label={`${t("email")}*`}>
                    <Input placeholder={t("enter_email")} {...register("email")} error={errors?.email?.message} />
                  </FormControl>
                  <FormControl label={t("phone_number")}>
                    <Input
                      placeholder={t("enter_phone_number")}
                      {...register("phone_number")}
                      error={errors?.phone_number?.message}
                    />
                  </FormControl>
                  <Divider />
                  {roles && renderRoles()}
                  <Divider vertical={30} />
                  <div className="mb-30">{isCreateUserError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/iam/users/list`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isCreateUserLoading}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </Row>
          </Card>
        </Column>
        <LeavePageAlert modal={leaveModal} setModal={setLeaveModal} onLeave={() => history.push(`/iam/users/list`)} />
      </Row>
    </Grid>
  );
}
