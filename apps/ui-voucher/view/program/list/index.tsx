import { useContext, useState } from "react";
import {
  Card,
  Column,
  Grid,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ActionButton,
  Dropdown,
  Button,
  Typography,
  Icon,
  Skeleton,
  Badge,
  useTranslation,
  Filters,
  InputSearch,
  FilterColumnConfig,
  FilterValue,
  AppContext,
  Link,
  NoResult,
  Pagination,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import {
  ProgramStatus,
  VoucherType,
  VoucherTypeLower,
  PERMISSION,
  VoucherProgramStatus,
  getTotalPages,
} from "@butlerhospitality/shared";
import { programDetails, programCreate } from "../../../routes";
import StatusUpdateResource, {
  StatusUpdateResourceMeta,
} from "./update-status-resource";
import NoPermissions from "../../../component/NoPermissions";
import useDebounce from "../../../utils/hooks/useDebounce";
import { useFetchProgramsByHotelId } from "../../../store/program";
import { useFetchHotel } from "../../../store/hotel";

function ProgramsListView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const params = useParams<{ hotelId: string }>();

  const { hotelId } = params;
  const history = useHistory();

  const canCreateVoucherProgram =
    can && can(PERMISSION.VOUCHER.CAN_CREATE_VOUCHER_PROGRAM);
  const canGetSingleVoucherProgram =
    can && can(PERMISSION.VOUCHER.CAN_GET_SINGLE_VOUCHER_PROGRAM);
  const canUpdateVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_UPDATE_VOUCHER_PROGRAM);
  const canListVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_LIST_HOTEL_VOUCHER_PROGRAMS);
  const canUpdatePrograms = canUpdateVoucherPrograms;

  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const [statusResourceMeta, setStatusResourceMeta] =
    useState<StatusUpdateResourceMeta>();

  const debouncedValue = useDebounce<string>(searchInput);

  const {
    data: hotelProgramsData,
    isLoading: hotelProgramsLoading,
    isError: hotelProgramsError,
    refetch: refetchHotelProgramData,
  } = useFetchProgramsByHotelId({
    id: +hotelId,
    page,
    search: debouncedValue,
    filters: filtersStr,
  });

  const {
    data: hotelData,
    isError: isHotelError,
    isLoading: isHotelLoading,
  } = useFetchHotel({
    id: hotelId,
  });

  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "Status",
      queryParamName: "statuses",
      data: async (): Promise<FilterValue[]> => {
        return [
          {
            label: VoucherProgramStatus.ACTIVE,
            queryParamValue: ProgramStatus.ACTIVE,
          },
          {
            label: VoucherProgramStatus.INACTIVE,
            queryParamValue: ProgramStatus.INACTIVE,
          },
        ];
      },
    },
    {
      name: "Type",
      queryParamName: "types",
      data: async (): Promise<FilterValue[]> => {
        return [
          {
            label: VoucherTypeLower.DISCOUNT,
            queryParamValue: VoucherType.DISCOUNT,
          },
          {
            label: VoucherTypeLower.PER_DIEM,
            queryParamValue: VoucherType.PER_DIEM,
          },
          {
            label: VoucherTypeLower.PRE_FIXE,
            queryParamValue: VoucherType.PRE_FIXE,
          },
        ];
      },
    },
  ];

  const filterOnChange = (queryString: string) => {
    setPage(1);
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  if (hotelProgramsError) {
    pushNotification(t("Error fetching entity", { entity: "hotel programs" }), {
      type: "error",
    });
    return null;
  }

  if (isHotelError) {
    pushNotification(t("Error fetching entity", { entity: "hotel" }), {
      type: "error",
    });
    return null;
  }

  const renderDropdownButton = (item: any) => {
    return (
      <Dropdown
        renderTrigger={(openDropdown, triggerRef) => (
          <ActionButton onClick={openDropdown} ref={triggerRef}>
            <Icon type="ThreeDots" size={40} />
          </ActionButton>
        )}
        hasArrow
        placement="right"
      >
        <div style={{ display: "flex", flexDirection: "column", width: 160 }}>
          {canUpdateVoucherPrograms && (
            <Button
              className="w-100"
              variant={
                item?.status === ProgramStatus.ACTIVE ? "danger-ghost" : "ghost"
              }
              muted
              leftIcon={<Icon type="ShutDown" size={18} />}
              onClick={() => {
                if (item.id) {
                  setStatusResourceMeta({
                    ids: [item.id],
                    status: item?.status,
                  });
                }
              }}
            >
              {item?.status === ProgramStatus.ACTIVE
                ? t("DEACTIVATE")
                : t("ACTIVATE")}
            </Button>
          )}
          <Button
            className="w-100"
            variant="ghost"
            muted
            onClick={() => history.push(`/voucher/programs/details/${item.id}`)}
            leftIcon={<Icon type="EyeOpen" size={18} />}
          >
            {t("View")}
          </Button>
        </div>
      </Dropdown>
    );
  };

  if (!canListVoucherPrograms) return <NoPermissions entity="Hotel programs" />;

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="voucher-content"
            page
            header={<Typography h2>{t("HOTEL_INFORMATION")}</Typography>}
          >
            <Row>
              {isHotelLoading ? (
                <Skeleton parts={["labelField"]} />
              ) : (
                <div className="ui-flex column">
                  <Typography size="small" muted className="pb-10">
                    {t("HOTEL_NAME")}
                  </Typography>
                  <Typography>{hotelData?.payload?.name}</Typography>
                </div>
              )}
            </Row>
          </Card>
        </Column>
      </Row>
      <Row>
        <Column>
          <Card
            className="voucher-content"
            page
            header={
              <>
                <Typography h2>{t("VOUCHER_PROGRAMS")}</Typography>
                {canCreateVoucherProgram && (
                  <Button
                    data-testId="create-new"
                    onClick={(): void =>
                      history.push(
                        `${programCreate.path}?hotelId=${params.hotelId}`
                      )
                    }
                  >
                    {t("CREATE_NEW")}
                  </Button>
                )}
              </>
            }
          >
            <div className="voucher-toolbar">
              <div className="voucher-toolbar-actions ui-flex start v-center">
                <Filters
                  columns={filtersColumnConfigs}
                  onChange={filterOnChange}
                  filtersString={filtersStr}
                />
                <div className="ml-5">
                  <InputSearch
                    value={searchInput}
                    placeholder={t("Search")}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {hotelProgramsLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("NAME")}</TableCell>
                    <TableCell as="th">{t("TYPE")}</TableCell>
                    <TableCell as="th">{t("STATUS")}</TableCell>
                    <TableCell as="th">{t("DATE_CREATED")}</TableCell>
                    {(canGetSingleVoucherProgram ||
                      canUpdateVoucherPrograms) && (
                      <TableCell
                        data-testId="three-dots"
                        as="th"
                        style={{ width: 50 }}
                      />
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(hotelProgramsData?.payload || []).map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {canGetSingleVoucherProgram ? (
                          <Link
                            size="medium"
                            component={RouterLink}
                            to={`${programDetails.path}/${encodeURIComponent(
                              item.id || ""
                            )}`}
                          >
                            {item?.name}
                          </Link>
                        ) : (
                          item?.name
                        )}
                      </TableCell>
                      <TableCell>{item?.type}</TableCell>
                      <TableCell>
                        <Badge
                          leftIcon="Circle"
                          iconSize={5}
                          size="small"
                          className={
                            item?.status === ProgramStatus.ACTIVE
                              ? "ui-badge"
                              : "ui-badge-inactive"
                          }
                        >
                          {item?.status === ProgramStatus.ACTIVE
                            ? t("ACTIVE")
                            : t("INACTIVE")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item?.created_at &&
                          new Date(item.created_at).toDateString()}
                      </TableCell>
                      {canUpdatePrograms && (
                        <TableCell className="act">
                          {renderDropdownButton(item)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!(hotelProgramsData?.payload || []).length &&
            !hotelProgramsLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(hotelProgramsData?.total))}
                current={page}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </Card>
        </Column>
        {statusResourceMeta && (
          <StatusUpdateResource
            meta={statusResourceMeta}
            onClose={() => {
              setStatusResourceMeta(undefined);
              refetchHotelProgramData();
            }}
          />
        )}
      </Row>
    </Grid>
  );
}

export default ProgramsListView;
