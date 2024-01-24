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
  Skeleton,
  ErrorMessage,
  LeavePageAlert,
  LookupField,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { AppEnum, HTTPResourceResponse, Role, baseUserValidator } from "@butlerhospitality/shared";
import _ from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { USER_BASE_ROUTE } from "../../../data/share";
import { useUpdateUser, useFetchUser } from "../../../store/user";
import { useFetchRoles } from "../../../store/role";

export default (): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation();
  const serviceApi = useApi(AppEnum.IAM);
  const params = useParams<{ id: string }>();

  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [roles, setRoles] = useState<HTTPResourceResponse<Role[]>>();
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    resolver: yupResolver(baseUserValidator),
    defaultValues: {},
  });

  const {
    mutateAsync: updateUser,
    isLoading: isUpdateUserLoading,
    isError: isUpdateUserError,
  } = useUpdateUser(params.id);

  const { data: user, isLoading: isUserLoading } = useFetchUser({
    id: params.id,
  });

  const { data: roleData, isLoading: isRolesLoading } = useFetchRoles({});

  useEffect(() => {
    if (user?.payload?.id && !isRolesLoading) {
      setRoles({
        payload: _.uniqBy([...(roleData?.payload || []), ...user.payload.roles], "id"),
        total: roleData?.total,
      });

      reset({
        name: user?.payload?.name,
        email: user?.payload?.email,
        phone_number: user?.payload?.phone_number,
        roles: user?.payload?.roles.map((role: any) => `${role.id}`),
      });
    }
  }, [user, roleData, reset]);

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
    try {
      setError("");
      await updateUser(data);
      history.push(`${USER_BASE_ROUTE}/details/${params.id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderRoles = () => (
    <FormControl label="Roles">
      <LookupField
        multiple
        selectProps={{ ...register(`roles`) }}
        placeholder="Select Roles"
        initData={roles}
        error={errors?.roles?.message}
        onQuery={({ page, filter }) =>
          serviceApi.get<HTTPResourceResponse<Role[]>>(`/roles?page=${page}&name=${filter}`)
        }
      />
    </FormControl>
  );

  if (isUserLoading) {
    return (
      <Grid gutter={0}>
        <Skeleton className="ml-10" parts={["header"]} />
        <Card>
          <Skeleton parts={["title"]} />
          <Skeleton parts={["title"]} />
          <Skeleton parts={["title"]} />
        </Card>
      </Grid>
    );
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="iam-content" page header={<Typography h2>{t("edit_user")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="mb-30">{isUpdateUserError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/iam/users/details/${params.id}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isUpdateUserLoading}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
              <LeavePageAlert
                modal={leaveModal}
                setModal={setLeaveModal}
                onLeave={() => history.push(`/iam/users/details/${params.id}`)}
              />
            </Row>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};
