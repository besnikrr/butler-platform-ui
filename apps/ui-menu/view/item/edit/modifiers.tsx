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
  pushNotification,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  CreateUpdateItemInput,
  Modifier,
  ModifierOnItem,
  HTTPResourceResponse,
  getTotalPages,
  Item,
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

  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOnItem[]>([]);
  const [modifiers, setModifiers] = useState<HTTPResourceResponse<Modifier[]>>();
  const { handleSubmit } = useForm<CreateUpdateItemInput>();

  const getModifiers = async (p: number): Promise<void> => {
    const result = await menuServiceApi.get<HTTPResourceResponse<Modifier[]>>(
      debouncedValue ? `/modifiers?name=${debouncedValue}&page=${p}` : `/modifiers?page=${p}`
    );
    setModifiers(result.data);
    setPage(p);
    setLoading(false);
  };

  useEffect(() => {
    setSelectedModifiers(item.modifiers);
  }, []);

  useEffect(() => {
    getModifiers(1);
  }, [debouncedValue]);

  const handleModifierClick = (mod: Modifier) => {
    const modifier = { id: mod.id, name: mod.name } as ModifierOnItem;

    const modifierExists = selectedModifiers.find((modItem) => modItem.id === modifier.id);
    if (!modifierExists) {
      return setSelectedModifiers([...selectedModifiers, modifier]);
    }

    return setSelectedModifiers((selectedModifiers || []).filter((modItem) => modItem.id !== modifier.id));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const data = {
      modifiers: selectedModifiers.map((modifier) => modifier.id),
    };
    try {
      await menuServiceApi.put<HTTPResourceResponse<Item>>(`/products/type/modifiers/${item.id}`, data);
      pushNotification(t("Item updated successfully"), {
        type: "success",
      });
      history.push(`/menu/item/view/${item.id}`);
    } catch (e: any) {
      if (e.response.data) {
        setError(e.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const preCheckedModifiers = (modId: number): boolean => {
    const foundSelected = selectedModifiers.find((mod) => mod.id === modId);
    return !!foundSelected;
  };

  return (
    <Grid gutter={0}>
      <Row>
        <Column>
          <Card className="menu-content" page header={<Typography h2>{t("add_modifiers_to_item")}</Typography>}>
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
                    <TableCell as="th">{t("options")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modifiers?.payload?.map((modItem: Modifier) => (
                    <TableRow key={modItem.id}>
                      <TableCell>
                        <Checkbox
                          name={modItem.name}
                          checked={preCheckedModifiers(modItem.id)}
                          onChange={() => handleModifierClick(modItem)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link size="medium" component={RouterLink} to={`/menu/modifier/view/${modItem.id}`}>
                          {modItem.name}
                        </Link>
                      </TableCell>
                      <TableCell>{modItem.options?.map((i: any) => i.name).join(" / ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!modifiers?.payload || modifiers?.payload?.length < 1) && !loading ? (
                <div>
                  <NoResult />
                </div>
              ) : (
                <Pagination
                  className="ui-flex end mt-20"
                  pages={getTotalPages(Number(modifiers?.total))}
                  current={page}
                  onPageChange={getModifiers}
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
