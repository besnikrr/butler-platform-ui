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
  isErrorType,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { AppEnum, HTTPResourceResponse, PermissionGroup, baseRoleValidator } from "@butlerhospitality/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import { AxiosError } from "axios";
import { ROLE_BASE_ROUTE } from "../../../data/share";
import { useUpdateRole, useFetchRole } from "../../../store/role";
import { useFetchPermissionGroups } from "../../../store/permission-group";

export default (): JSX.Element => {
  const serviceApi = useApi(AppEnum.IAM);
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const [permissionGroups, setPermissionGroups] = useState<HTTPResourceResponse<PermissionGroup[]>>();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    resolver: yupResolver(baseRoleValidator),
    defaultValues: {},
  });

  const {
    mutateAsync: updateRole,
    isLoading: isUpdateRoleLoading,
    isError: isUpdateRoleError,
  } = useUpdateRole(params.id);

  const { data: role, isLoading: isRoleLoading } = useFetchRole({
    id: params.id,
  });

  const { data: permissionGroupsData, isLoading: isPermissionGroupLoading } = useFetchPermissionGroups({});

  useEffect(() => {
    if (role?.payload?.id) {
      setPermissionGroups({
        payload: _.uniqBy([...(permissionGroupsData?.payload || []), ...role.payload.permissiongroups], "id"),
        total: permissionGroupsData?.total,
      });
      reset({
        name: role?.payload?.name,
        description: role?.payload?.description,
        permissiongroups: role?.payload?.permissiongroups?.map((item: any) => `${item.id}`),
      });
    }
  }, [role, permissionGroupsData, reset]);

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
    setError("");
    try {
      await updateRole(data);
      history.push(`${ROLE_BASE_ROUTE}/details/${params.id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderPermissionGroups = () => (
    <FormControl label="Permission Groups">
      <LookupField<PermissionGroup>
        multiple
        selectProps={register(`permissiongroups`)}
        placeholder={t("select_permission_groups")}
        error={errors?.permissiongroups?.message}
        initData={permissionGroups}
        onQuery={({ page }) => {
          return serviceApi.get(`/permissiongroups?page=${page}`);
        }}
      />
    </FormControl>
  );

  if (isRoleLoading || isPermissionGroupLoading) {
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
          <Card className="iam-content" page header={<Typography h2>{t("edit_role")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("name")}*`}>
                    <Input placeholder={t("enter_name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  <FormControl label={t("description")}>
                    <Input
                      placeholder={t("enter_description")}
                      {...register("description")}
                      error={errors?.description?.message}
                    />
                  </FormControl>
                  <Divider />
                  {permissionGroups && renderPermissionGroups()}
                  <Divider vertical={30} />
                  <div className="mb-30">
                    {isUpdateRoleError && <ErrorMessage error={isErrorType(error) ? error.message : ""} />}
                  </div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/iam/roles/details/${params.id}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isUpdateRoleLoading}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </Row>
          </Card>
          <LeavePageAlert
            modal={leaveModal}
            setModal={setLeaveModal}
            onLeave={() => history.push(`/iam/roles/details/${params.id}`)}
          />
        </Column>
      </Row>
    </Grid>
  );
};
