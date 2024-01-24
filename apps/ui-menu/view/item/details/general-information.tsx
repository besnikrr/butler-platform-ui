import {
  Card,
  Typography,
  Image,
  Row,
  Column,
  useTranslation,
  GoToOMSLink,
} from "@butlerhospitality/ui-sdk";
import { EditType } from "../edit";
import editHeader from "./edit-header";

const conditionalRender = (prop: boolean) => {
  return prop ? "Yes" : "No";
};

export default ({ item }: any): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Card
      className="menu-content"
      page
      header={editHeader(
        "General information",
        `/menu/item/manage/${EditType.GENERAL_INFORMATION}/${item?.id}`
      )}
    >
      <Row className="mt-30" gutterY={0}>
        <div className="ui-flex">
          <div className="mr-30">
            {/* TODO: use env. base img url */}
            <Image
              src={`${item?.image_base_url}/image/400x400/${item?.image}`}
              alt={item?.image}
              width={100}
              height={100}
            />
          </div>
          <Row cols={1} className="mt-0 w-100">
            <Column className="mt-0">
              <div className="ui-flex between v-start">
                <div>
                  <Typography className="mb-5" size="small" p muted>
                    {t("name")}
                  </Typography>
                  <Typography>{item?.name}</Typography>
                </div>
                {item?.oms_id && (
                  <GoToOMSLink path={`inventory/menu-items/${item.oms_id}`} />
                )}
              </div>
            </Column>
            <Column>
              <Typography className="mb-5" size="small" p muted>
                {t("price")}
              </Typography>
              <Typography>${item?.price}</Typography>
            </Column>
            <Column>
              <Typography className="mb-5" size="small" p muted>
                {t("description")}
              </Typography>
              <Typography>{item?.description}</Typography>
            </Column>
            <Column>
              <Typography className="mb-5" size="small" p muted>
                {t("needs_cutlery")}
              </Typography>
              <Typography data-testid="menu-item-needs_cutlery">
                {conditionalRender(item?.needs_cutlery)}
              </Typography>
            </Column>
            <Column>
              <Typography className="mb-5" size="small" p muted>
                {t("guest_view")}
              </Typography>
              <Typography data-testid="menu-item-guest_view">
                {conditionalRender(item?.guest_view)}
              </Typography>
            </Column>
            <Column>
              <Typography className="mb-5" size="small" p muted>
                {t("raw_food")}
              </Typography>
              <Typography data-testid="menu-item-raw_food">
                {conditionalRender(item?.raw_food)}
              </Typography>
            </Column>
          </Row>
        </div>
      </Row>
    </Card>
  );
};
