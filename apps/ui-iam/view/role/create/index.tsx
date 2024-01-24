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
import { AppEnum, baseRoleValidator, PermissionGroup } from "@butlerhospitality/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { ROLE_BASE_ROUTE } from "../../../data/share";
import { useCreateRole } from "../../../store/role";
import { useFetchPermissionGroups } from "../../../store/permission-group";

export default (): JSX.Element => {
  const serviceApi = useApi(AppEnum.IAM);
  const history = useHistory();
  const { t } = useTranslation();
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: yupResolver(baseRoleValidator),
    defaultValues: {},
  });

  const { data: permissionGroups, isLoading: isPermissionGroupsLoading } = useFetchPermissionGroups({});
  const { mutateAsync: createRole, isError: isCreateRoleError, isLoading: isCreateRoleLoading } = useCreateRole();

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
      await createRole(data);
      history.push(`${ROLE_BASE_ROUTE}/list`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderPermissionGroups = () => (
    <FormControl label="Permission Groups">
      <LookupField<PermissionGroup>
        multiple
        selectProps={register(`permissiongroups`)}
        placeholder={t("select_permmission_group")}
        error={errors?.permissiongroups?.message}
        initData={permissionGroups}
        onQuery={(params) => serviceApi.get(`/permissiongroups?page=${params.page}`)}
      />
    </FormControl>
  );

  if (isPermissionGroupsLoading) {
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
          <Card className="iam-content" page header={<Typography h2>Create Role</Typography>}>
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
                  <div className="mb-30">{isCreateRoleError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage("/iam/roles/list");
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isCreateRoleLoading}>
                        {t("save")}
                      </Button>
                    </div>
                  </Row>
                </form>
              </Column>
            </Row>
          </Card>
          <LeavePageAlert modal={leaveModal} setModal={setLeaveModal} onLeave={() => history.push("/iam/roles/list")} />
        </Column>
      </Row>
    </Grid>
  );
};
