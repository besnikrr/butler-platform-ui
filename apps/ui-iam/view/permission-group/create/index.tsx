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
  LeavePageAlert,
  useTranslation,
  ErrorMessage,
} from "@butlerhospitality/ui-sdk";
import { useForm } from "react-hook-form";
import { App, AppEnum, basePermissionGroupValidator, HTTPResourceResponse } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { PERMISSION_GROUPS_BASE_ROUTE } from "../../../data/share";
import { useCreatePermissionGroup } from "../../../store/permission-group";

export default (): JSX.Element => {
  const serviceApi = useApi(AppEnum.IAM);
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [apps, setApps] = useState<App[]>([]);
  const [leaveModal, setLeaveModal] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [allChecked, setAllChecked] = useState<any>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(basePermissionGroupValidator),
    defaultValues: {},
  });

  useEffect(() => {
    setLoading(true);
    const getApps = async (): Promise<void> => {
      try {
        const appsResult = await serviceApi.get<HTTPResourceResponse<App[]>>("/apps/apps");
        const appsWithPermissions: App[] = appsResult.data.payload || [];
        setApps(appsWithPermissions);
        setAllChecked(
          appsWithPermissions.reduce((acc, app) => {
            // eslint-disable-next-line no-param-reassign
            acc[`${app.id}`] = false;
            return acc;
          }, {} as any)
        );
        setLoading(false);
      } catch (err: any) {
        setError(err.response.data.error);
      }
    };
    getApps();
  }, []);

  const {
    mutateAsync: createPermissionGroup,
    isError: isCreatePermissionGroupError,
    isLoading: isCreatePermissionGroupLoading,
  } = useCreatePermissionGroup();

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
        permissions: [].concat(...data.apps.filter((x: any) => x && x.length)).map((x: any) => Number(x)),
      };

      if (!dataToSend.permissions.length) {
        setError("You must select at least one permission");
        return;
      }
      await createPermissionGroup(dataToSend);
      history.push(`${PERMISSION_GROUPS_BASE_ROUTE}/list`);
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
              label={t("check_all")}
              checked={allChecked[item.id]}
              onChange={(e) => {
                setValue(`apps[${item.id}]`, e.target.checked ? item.permissions.map((x: any) => `${x.id}`) : []);
                setAllChecked({ ...allChecked, [item.id]: e.target.checked });
              }}
            />
          </div>
          <Select
            multiple
            placeholder={t("select_permissions")}
            selectProps={register(`apps[${item.id}]`)}
            error={error}
          >
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

  if (loading) {
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
          <Card className="iam-content" page header={<Typography h2>{t("create_permission_groups")}</Typography>}>
            <Row>
              <Column offset={3} size={6}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl label={`${t("name")}*`}>
                    <Input placeholder={t("Enter Name")} {...register("name")} error={errors?.name?.message} />
                  </FormControl>
                  {apps && renderAppsWithPermissions()}
                  <Divider vertical={30} />
                  <div className="mb-30">{isCreatePermissionGroupError && <ErrorMessage error={error} />}</div>
                  <Divider vertical={30} />
                  <Row>
                    <div className="form-bottom-action">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onLeavePage(`/iam/permission-groups/list`);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                      <Button type="submit" variant="primary" disabled={isCreatePermissionGroupLoading}>
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
            onLeave={() => history.push(`/iam/permission-groups/list`)}
          />
        </Column>
      </Row>
    </Grid>
  );
};
