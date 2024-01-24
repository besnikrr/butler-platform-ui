import { useEffect, useState, useContext } from "react";
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
  Icon,
  ActionButton,
  Typography,
  Skeleton,
  Filters,
  InputSearch,
  FilterColumnConfig,
  FilterValue,
  useTranslation,
  NoResult,
  AppContext,
  Pagination,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  CodeStatus,
  VoucherType,
  VoucherTypeLower,
  PERMISSION,
  getTotalPages,
} from "@butlerhospitality/shared";
import { useParams, useHistory } from "react-router-dom";
import useDebounce from "../../../utils/hooks/useDebounce";
import VoucherTypeTooltip from "../../../component/VoucherTypeTooltip";
import NoPermissions from "../../../component/NoPermissions";
import { useFetchCodesByHotelId } from "../../../store/code";
import { useFetchHotel } from "../../../store/hotel";

function CodesListView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();
  const params = useParams<{ hotelId: string }>();

  const filtersColumnConfigs: FilterColumnConfig[] = [
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
    {
      name: "Status",
      queryParamName: "statuses",
      data: async (): Promise<FilterValue[]> => {
        return [
          {
            label: CodeStatus.PENDING,
            queryParamValue: CodeStatus.PENDING,
          },
          {
            label: CodeStatus.REDEEMED,
            queryParamValue: CodeStatus.REDEEMED,
          },
        ];
      },
    },
  ];

  const canGetHotelVoucherCodes =
    can && can(PERMISSION.VOUCHER.CAN_GET_HOTEL_VOUCHER_CODES);

  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const debouncedValue = useDebounce<string>(searchInput);

  const {
    data: codes,
    isLoading: isCodesLoading,
    isError: isCodesError,
  } = useFetchCodesByHotelId({
    id: +params.hotelId,
    page,
    search: debouncedValue,
    filters: filtersStr,
  });

  const {
    data: hotelData,
    isError: isHotelError,
    isLoading: isHotelLoading,
  } = useFetchHotel({
    id: params.hotelId,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  const filterOnChange = (queryString: string) => {
    setPage(1);
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  if (!canGetHotelVoucherCodes) return <NoPermissions entity="Hotel codes" />;

  if (isCodesError) {
    pushNotification(t("Error fetching entity", { entity: "codes" }), {
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
            header={<Typography h2>{t("VOUCHER_CODES")}</Typography>}
          >
            <div className="network-toolbar mb-20">
              <div className="network-toolbar-actions ui-flex start v-center">
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
            {isCodesLoading ? (
              <Skeleton parts={["filterTable"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th">{t("VOUCHER_NAME")}</TableCell>
                    <TableCell as="th">{t("CODE")}</TableCell>
                    <TableCell as="th">{t("DATE_CREATED")}</TableCell>
                    <TableCell as="th">
                      {t("TYPE")}
                      <VoucherTypeTooltip />
                    </TableCell>
                    <TableCell as="th">{t("STATUS")}</TableCell>
                    <TableCell as="th" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {codes?.payload?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item?.program.name}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>
                        {item?.created_at &&
                          new Date(item.created_at).toDateString()}
                      </TableCell>
                      <TableCell>
                        {VoucherTypeLower[item.program.type as VoucherType]}
                      </TableCell>
                      <TableCell>
                        {item.claimed_date ? t("REDEEMED") : t("PENDING")}
                      </TableCell>
                      <TableCell>
                        {item.claimed_date && (
                          <ActionButton size="small" variant="primary">
                            <Icon type="DocumentWithLines" size={20} />
                          </ActionButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {(!codes || (codes.payload || []).length < 1) && !isCodesLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(codes?.total))}
                current={page}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </Card>
        </Column>
      </Row>
    </Grid>
  );
}

export default CodesListView;
