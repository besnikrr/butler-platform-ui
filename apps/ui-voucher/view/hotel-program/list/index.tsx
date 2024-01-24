import { useContext, useEffect, useState } from "react";
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
  Button,
  Typography,
  Skeleton,
  useTranslation,
  Filters,
  FilterColumnConfig,
  FilterValue,
  InputSearch,
  AppContext,
  NoResult,
  Pagination,
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import {
  VoucherType,
  VoucherTypeLower,
  PERMISSION,
  HotelProgramList,
  getTotalPages,
} from "@butlerhospitality/shared";
import useDebounce from "../../../utils/hooks/useDebounce";
import { programList, programCreate, codeList } from "../../../routes";
import NoPermissions from "../../../component/NoPermissions";
import { useFetchHotelPrograms } from "../../../store/hotel-program";

function HotelProgramListView() {
  const { t } = useTranslation();
  const { can } = useContext(AppContext);
  const history = useHistory();

  const canGetHotelsWithVouchers =
    can && can(PERMISSION.VOUCHER.CAN_LIST_VOUCHER_PROGRAMS_HOTELS);
  const canCreateVoucherProgram =
    can && can(PERMISSION.VOUCHER.CAN_CREATE_VOUCHER_PROGRAM);
  const canListVoucherPrograms =
    can && can(PERMISSION.VOUCHER.CAN_LIST_HOTEL_VOUCHER_PROGRAMS);
  const canGetHotelVoucherCodes =
    can && can(PERMISSION.VOUCHER.CAN_GET_HOTEL_VOUCHER_CODES);

  const canSeeActions = canListVoucherPrograms || canGetHotelVoucherCodes;
  const numberOfColumns = canSeeActions ? 4 : 3;
  const cellWidth = `${100 / numberOfColumns}%`;

  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "Program type",
      queryParamName: "type",
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

  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filtersStr, setFiltersStr] = useState<string>(history.location.search);
  const debouncedValue = useDebounce<string>(searchInput);

  const {
    data: hotelProgramData,
    isLoading: hotelProgramLoading,
    isError: hotelProgramError,
  } = useFetchHotelPrograms({
    page,
    search: debouncedValue,
    filters: filtersStr,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedValue]);

  const filterOnChange = (queryString: string) => {
    setPage(1);
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  if (!canGetHotelsWithVouchers)
    return <NoPermissions entity="Hotel Program" />;

  if (hotelProgramError) {
    pushNotification(t("Error fetching entity", { entity: "hotel programs" }), {
      type: "error",
    });
    return null;
  }

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="network-content"
            page
            header={
              <>
                <Typography h2>{t("HOTELS_LIST")}</Typography>
                {canCreateVoucherProgram && (
                  <Button
                    data-testId="create-new"
                    onClick={() => history.push(programCreate.path)}
                  >
                    {t("CREATE_NEW")}
                  </Button>
                )}
              </>
            }
          >
            <div className="voucher-toolbar mb-20">
              <div className="voucher-toolbar-actions ui-flex start v-center">
                <Filters
                  columns={filtersColumnConfigs}
                  onChange={filterOnChange}
                  filtersString={filtersStr}
                />
                <div className="ml-5">
                  <InputSearch
                    value={searchInput}
                    placeholder="Search..."
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {hotelProgramLoading ? (
              <Skeleton parts={["table"]} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as="th" style={{ width: cellWidth }}>
                      {t("HOTEL_NAME")}
                    </TableCell>
                    <TableCell as="th" style={{ width: cellWidth }}>
                      {t("PROGRAM_TYPES")}
                    </TableCell>
                    <TableCell as="th" style={{ width: cellWidth }}>
                      {t("NUMBER_OF_PROGRAMS")}
                    </TableCell>
                    {canSeeActions && (
                      <TableCell as="th" style={{ width: cellWidth }} />
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(hotelProgramData?.payload || []).map(
                    (item: HotelProgramList) => (
                      <TableRow key={item.id}>
                        <TableCell>{item?.name}</TableCell>
                        <TableCell>
                          {item?.program_types
                            ?.map((programType) => programType)
                            .join(", ")}
                        </TableCell>
                        <TableCell>{item?.programs}</TableCell>
                        {canSeeActions && (
                          <TableCell>
                            <div className="w-100 ui-flex end v-center">
                              {item.id && (
                                <>
                                  {canListVoucherPrograms && (
                                    <Button
                                      className="ml-20"
                                      variant="ghost"
                                      size="small"
                                      onClick={() =>
                                        history.push(
                                          `${
                                            programList.path
                                          }/${encodeURIComponent(
                                            item.id || ""
                                          )}`
                                        )
                                      }
                                    >
                                      {t("PROGRAMS")}
                                    </Button>
                                  )}
                                  {canGetHotelVoucherCodes && (
                                    <Button
                                      className="ml-20"
                                      variant="ghost"
                                      size="small"
                                      onClick={() =>
                                        history.push(
                                          `${
                                            codeList.path
                                          }/${encodeURIComponent(
                                            item.id || ""
                                          )}`
                                        )
                                      }
                                    >
                                      {t("CODES")}
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
            {(!hotelProgramData || !(hotelProgramData.payload || []).length) &&
            !hotelProgramLoading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(hotelProgramData?.total))}
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

export default HotelProgramListView;
