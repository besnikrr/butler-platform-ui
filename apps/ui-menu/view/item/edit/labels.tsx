import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Column,
  useApi,
  Divider,
  Grid,
  Row,
  Typography,
  ErrorMessage,
  useTranslation,
  Pagination,
  NoResult,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Link,
  InputSearch,
  TableHead,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  CreateUpdateItemInput,
  HTTPResourceResponse,
  getTotalPages,
  Item,
  Label,
} from "@butlerhospitality/shared";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import useDebounce from "../../../util/useDebounce";

export default ({ item }: any): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedValue = useDebounce<string>(searchInput);

  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [labels, setLabels] = useState<HTTPResourceResponse<Label[]>>();
  const { handleSubmit } = useForm<CreateUpdateItemInput>();

  const getLabels = async (p: number): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<Label[]>>(
      debouncedValue ? `/labels?name=${debouncedValue}&page=${p}` : `/labels?page=${p}`
    );
    setLabels(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    setSelectedLabels(item.labels);
  }, []);

  useEffect(() => {
    getLabels(1);
  }, [debouncedValue]);

  const handleLabelClick = (labelItem: Label) => {
    const label = { id: labelItem.id, name: labelItem.name } as Label;

    const labelExists = selectedLabels.find((labItem) => labItem.id === label.id);
    if (!labelExists) {
      return setSelectedLabels([...selectedLabels, label]);
    }

    return setSelectedLabels((selectedLabels || []).filter((labItem) => labItem.id !== label.id));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const data = {
      labels: selectedLabels.map((label) => label.id),
    };
    try {
      await menuServiceApi.put<HTTPResourceResponse<Item>>(`/products/type/labels/${item.id}`, data);
      history.push(`/menu/item/view/${item.id}`);
    } catch (e: any) {
      if (e.response.data) {
        setError(e.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const preCheckedLabels = (labelId: number): boolean => {
    const foundSelected = selectedLabels.find((lab) => lab.id === labelId);
    return !!foundSelected;
  };

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("add_labels_to_item")}</Typography>}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="menu-toolbar">
                <div className="menu-toolbar-actions ui-flex start v-center">
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labels?.payload?.map((labelItem: Label) => (
                    <TableRow key={labelItem.id}>
                      <TableCell>
                        <Checkbox
                          name={labelItem.name}
                          checked={preCheckedLabels(labelItem.id)}
                          onChange={() => handleLabelClick(labelItem)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link size="medium" component={RouterLink} to={`/menu/label/view/${labelItem.id}`}>
                          {labelItem.name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!labels?.payload || labels?.payload?.length < 1) && !loading ? (
                <div>
                  <NoResult />
                </div>
              ) : (
                <Pagination
                  className="ui-flex end mt-20"
                  pages={getTotalPages(Number(labels?.total))}
                  current={page}
                  onPageChange={getLabels}
                />
              )}
              {error && (
                <div className="mt-20">
                  <ErrorMessage error={error} />
                </div>
              )}
              <Divider vertical={30} />
              <Row>
                <div className="form-bottom-action">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      history.push(`/menu/item/view/${item.id}`);
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button data-testid="item-submit" variant="primary" type="submit" disabled={isSubmitting}>
                    {t("save")}
                  </Button>
                </div>
              </Row>
            </form>
          </Card>
        </Column>
      </Row>
    </Grid>
  );
};
