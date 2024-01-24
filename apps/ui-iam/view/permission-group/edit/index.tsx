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
  Checkbox,
  useApi,
  Skeleton,
  Select,
  Option,
  ErrorMessage,
  LeavePageAlert,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { App, AppEnum, basePermissionGroupValidator, HTTPResourceResponse } from "@butlerhospitality/shared";
import { useHistory, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { PERMISSION_GROUPS_BASE_ROUTE } from "../../../data/share";
import { useFetchPermissionGroup, useUpdatePermissionGroup } from "../../../store/permission-group";

export default (): JSX.Element => {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const iamServiceApi = useApi(AppEnum.IAM);
  const [apps, setApps] = useState<App[]>([]);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [allChecked, setAllChecked] = useState<any>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: yupResolver(basePermissionGroupValidator),
    defaultValues: {},
  });

  const { data: permissionGroup, isLoading: isPermissionGroupLoading } = useFetchPermissionGroup({
    id: params.id,
  });

  const {
    mutateAsync: updatePermissionGroup,
    isLoading: isUpdatePermissionGroupLoading,
    isError: isUpdatePermissionGroupError,
  } = useUpdatePermissionGroup(params.id);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      try {
        const appPermissions: any = [];
        const appsResult = await iamServiceApi.get<HTTPResourceResponse<App[]>>("/apps/apps");

        setApps(appsResult.data.payload || []);

        permissionGroup?.payload?.permissions?.forEach((permission: any) => {
          if (!Array.isArray(appPermissions[Number(permission.app_id)])) {
            appPermissions[Number(permission.app_id)] = [`${permission.id}`];
          } else {
            appPermissions[Number(permission.app_id)].push(`${permission.id}`);
          }
        });
        setAllChecked(
          ((appsResult.data.payload as any[]) || []).reduce((acc, app) => {
            // eslint-disable-next-line no-param-reassign
            acc[`${app.id}`] = appPermissions[Number(app.id)]?.length === app.permissions.length || false;
            return acc;
          }, {} as any)
        );
        reset({
          name: permissionGroup?.payload?.name,
          apps: appPermissions,
        });
      } catch (err: any) {
        setError(err.response.data.error);
      }
    };
    getData();
  }, [permissionGroup]);

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
      const dataToSend = {
        name: data.name,
        permissions: [].concat(...data.apps.filter((x: any) => x && x.length)),
      };
      if (!dataToSend.permissions.length) {
        setError("You must select at least one permission");
        return;
      }
      await updatePermissionGroup(dataToSend);
      history.push(`${PERMISSION_GROUPS_BASE_ROUTE}/details/${params.id}`);
    } catch (err: unknown) {
      setError((err as AxiosError)?.response?.data?.message);
    }
  };

  const renderAppsWithPermissions = () => {
    return (apps || []).map((item: any) => {
      return (
        <FormControl key={item.id} label={item.name.charAt(0).toUpperCase() + item.name.slice(1)} className="mt-20">
          <div className="mb-5">
            <Checkbox
              key={item.name}
              value={item.name}
              label="Check all"
              checked={allChecked[item.id]}
              onChange={(e) => {
                setValue(`apps[${item.id}]`, e.target.checked ? item.permissions.map((x: any) => `${x.id}`) : []);
                setAllChecked({ ...allChecked, [item.id]: e.target.checked });
              }}
            />
          </div>
          <Select multiple placeholder={t("select_permissions")} selectProps={register(`apps[${item.id}]`)}>
            {item &&
              item.permissions.map((permission: any) => {
                return (
                  <Option key={permission.name} value={`${permission.id}`}>
                    {permission.name}
                  </Option>
                );
              })}
          </Select>
        </FormControl>
      );
    });
  };

  if (isPermissionGroupLoading) {
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
          <Card className="iam-content" page header={<Typography h2>{t("edit_permission_groups")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Typography h2>{t("general_information")}</Typography>
                  </Row>
                  <Divider />
                  <FormControl label={`${t("name")}*`}>
                    <Input
                      placeholder={t("enter_name")}
                      {...register("name", { required: "Name is required" })}
                      error={errors?.name?.message}
                    />
                  </FormControl>
                  <Divider />
                  {apps && renderAppsWithPermissions()}
                  <Divider vertical={30} />
                  <div className="mb-30">{isUpdatePermissionGroupError && <ErrorMessage error={error} />}</div>
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/iam/permission-groups/details/${params.id}`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isUpdatePermissionGroupLoading}>
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
            onLeave={() => history.push(`/iam/permission-groups/details/${params.id}`)}
          />
        </Column>
      </Row>
    </Grid>
  );
};
