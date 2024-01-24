import { useContext, useEffect, useState } from "react";
import qs from "qs";
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
  Checkbox,
  AppContext,
  pushNotification,
  useTranslation,
  FilterColumnConfig,
  Filters,
  FilterValue,
  InputSearch,
  Skeleton,
  useApi,
  Pagination,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  MenuEntity,
  PERMISSION,
  HTTPResourceResponse,
  getTotalPages,
  HotelV2,
} from "@butlerhospitality/shared";
import { useHistory, useParams, Redirect } from "react-router-dom";
import arraysEqual from "../../../util/arraysEqual";
import NoResult from "../../../component/NoResult";
import useDebounce from "../../../util/useDebounce";
import EditResource, { EditResourceMeta } from "./edit-resource/edit-resource";

const HotelsListView = (): JSX.Element => {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);

  const canAssignMenu = can(PERMISSION.MENU.CAN_ASSIGN_MENU);
  const canGetHotels = can(PERMISSION.MENU.CAN_GET_HOTELS);
  const filtersColumnConfigs: FilterColumnConfig[] = [
    {
      name: "menu",
      queryParamName: "menuIds",
      data: async (): Promise<FilterValue[]> => {
        const result = await menuServiceApi.get<HTTPResourceResponse<MenuEntity[]>>("");
        const filterValues: FilterValue[] = [];
        result?.data?.payload?.forEach((item) => {
          filterValues.push({
            label: item.name,
            queryParamValue: `${item.id || ""}`,
          });
        });
        return filterValues;
      },
    },
  ];

  const history = useHistory();
  const params = useParams<{ name: string; id: string }>();
  const [data, setData] = useState<HTTPResourceResponse<any[]>>();
  const [editResourceMeta, setEditResourceMeta] = useState<EditResourceMeta>();
  const [filtersStr, setFiltersStr] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedValue = useDebounce<string>(searchInput);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [initialSelectedHotels, setInitialSelectedHotels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const filterOnChange = (queryString: string) => {
    setFiltersStr(queryString);
    history.push(`?${queryString}`);
  };

  useEffect(() => {
    setFiltersStr(history.location.search);
  }, []);

  const getData = async (p: number): Promise<void> => {
    const filtersParsed = qs.parse(history.location.search.replace("?", "").replace(/\|([^&]*)&?/g, "&"));

    const queryString = decodeURIComponent(qs.stringify(filtersParsed)).replace(/\|([^&]*)&?/g, "&");

    const url = debouncedValue
      ? `/external/relation/hotels?${queryString}name=${debouncedValue}&page=${p}`
      : `/external/relation/hotels?${queryString}page=${p}`;

    const hotels = await menuServiceApi.get<HTTPResourceResponse<any[]>>(url);

    if (hotels?.data?.payload) {
      const hotelsSelected: string[] = [];

      const hotelsParsed = (hotels?.data?.payload || []).map((it) => {
        if (it.menus?.some((menu: any) => menu.id === +params.id)) {
          hotelsSelected.push(it.id);
        }
        return {
          hotel_id: it.id,
          hotel_name: it.name,
          hub_name: it?.hub?.name,
          menus: it.menus,
        };
      });

      setData({
        payload: hotelsParsed,
        nextPage: hotels.data.nextPage,
        total: hotels.data.total,
      });
      setLoading(false);
      setPage(p);
    }
  };

  const getHotelMenus = async (): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<HotelV2[]>>(`/${params.id}/hotels`);

    const hotelsParsed: any[] = [];

    result?.data?.payload?.forEach((item) => hotelsParsed.push(item.id));

    setSelectedHotels(hotelsParsed);
    setInitialSelectedHotels(hotelsParsed);
  };

  useEffect(() => {
    getData(1);
    getHotelMenus();
  }, []);

  useEffect(() => {
    getData(1);
  }, [filtersStr, debouncedValue]);

  const handleHotelClick = (hotelId: string | undefined) => {
    if (!hotelId) return;

    if (!selectedHotels.includes(hotelId)) {
      setSelectedHotels([...selectedHotels, hotelId]);
      return;
    }

    setSelectedHotels((selectedHotels || []).filter((item) => item !== hotelId));
  };

  const onAssign = async () => {
    const newAssign: any[] = [];
    const overrideMenuHotel: any[] = [];
    const removeMenuHotel: any[] = [];
    const removeMenuHotelIds: string[] = initialSelectedHotels.filter((item: any) => !selectedHotels.includes(item));

    const allHotels = await menuServiceApi.get<HTTPResourceResponse<any[]>>("/external/relation/hotels?paginate=false");

    const hotelsParsed = (allHotels?.data?.payload || []).map((it) => {
      return {
        hotel_id: it.id,
        hotel_name: it.name,
        hub_name: it?.hub?.name,
        menus: it.menus,
      };
    });

    (hotelsParsed || []).filter((item: any) => {
      if (selectedHotels.includes(item.hotel_id)) {
        if (item.menus.length && item.menus[0].id !== +params.id) {
          return overrideMenuHotel.push(item);
        }
        return newAssign.push(item);
      }

      return null;
    });

    (hotelsParsed || []).forEach((item: any) => {
      if (removeMenuHotelIds.includes(item.hotel_id)) {
        removeMenuHotel.push(item);
      }
    });

    setEditResourceMeta({
      resource: "hotels",
      newAssign,
      overrideMenuHotel,
      removeMenuHotel,
      hotels: selectedHotels,
    });
  };

  if (!canAssignMenu || !canGetHotels) {
    pushNotification("You have no permissions to assign hotels menu", {
      type: "warning",
    });
    return <Redirect to={`/menu/menu/view/${params.id}`} />;
  }
  if (loading) {
    return (
      <Grid gutter={0}>
        <Skeleton parts={["header"]} className="pt-10" />
        <Card page>
          <Skeleton parts={["cardHeaderAction", "divider", "block"]} />
        </Card>
        <Card className="mt-20" page>
          <Skeleton parts={["filterTable-2"]} />
        </Card>
      </Grid>
    );
  }
  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card
            className="menu-content"
            page
            header={
              <Typography h2>
                {t("assign_menu_to_hotel", {
                  menu_name: decodeURIComponent(params.name),
                })}
              </Typography>
            }
          >
            <div className="menu-toolbar">
              <div className="menu-toolbar-actions ui-flex start v-center">
                <Filters columns={filtersColumnConfigs} onChange={filterOnChange} filtersString={filtersStr} />
                <InputSearch
                  value={searchInput}
                  placeholder={t("search")}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell as="th" style={{ width: 50 }} />
                  <TableCell as="th">{t("name")}</TableCell>
                  <TableCell as="th">{t("hub")}</TableCell>
                  <TableCell as="th">{t("menu")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.payload?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        key={item.id}
                        onChange={() => {
                          handleHotelClick(item.hotel_id);
                        }}
                        checked={selectedHotels.includes(item.hotel_id)}
                      />
                    </TableCell>
                    <TableCell>{item.hotel_name}</TableCell>
                    <TableCell>{item.hub_name}</TableCell>
                    <TableCell>{item.menus.map((menu: any) => menu.name).join(" / ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(!data?.payload || data?.payload?.length < 1) && !loading ? (
              <div>
                <NoResult />
              </div>
            ) : (
              <Pagination
                className="ui-flex end mt-20"
                pages={getTotalPages(Number(data?.total))}
                current={page}
                onPageChange={getData}
              />
            )}
            <Row className="mt-30">
              <div className="form-bottom-action">
                <Button
                  variant="ghost"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="primary"
                  onClick={onAssign}
                  disabled={arraysEqual(initialSelectedHotels, selectedHotels)}
                >
                  {t("save")}
                </Button>
              </div>
            </Row>
          </Card>
        </Column>
        {editResourceMeta && <EditResource meta={editResourceMeta} onClose={() => setEditResourceMeta(undefined)} />}
      </Row>
    </Grid>
  );
};

export default HotelsListView;
