import React, { useEffect, useState } from "react";
import {
  useApi,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTranslation,
  Pagination,
} from "@butlerhospitality/ui-sdk";
import { useParams } from "react-router-dom";
import {
  AppEnum,
  Hotel,
  HTTPResourceResponse,
  getTotalPages,
} from "@butlerhospitality/shared";
import NoResult from "../../../component/NoResult";

const HotelsListView = (): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<HTTPResourceResponse<Hotel[]>>();
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const getData = async (p: number): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<Hotel[]>>(
      `/${params.id}/hotels?page=${p}`
    );
    setData(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    getData(1);
  }, []);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th">{t("hotel")}</TableCell>
            <TableCell as="th">{t("hub")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.payload?.map((item: any) => (
            <TableRow key={item.it}>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.hub?.name}</TableCell>
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
    </div>
  );
};

export default HotelsListView;
