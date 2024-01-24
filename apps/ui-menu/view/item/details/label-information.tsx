import { Card, Column, Typography, useTranslation } from "@butlerhospitality/ui-sdk";
import { Label } from "@butlerhospitality/shared";
import editHeader from "./edit-header";
import { EditType } from "../edit";

const renderLabels = (labels: Label[]) => {
  return (
    <Column>
      {labels?.map((item: Label) => (
        <Typography key={item.id} size="large" p className="mb-5">
          {item.name}
        </Typography>
      ))}
    </Column>
  );
};

export default ({ item }: any): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card className="menu-content" page header={editHeader("Labels", `/menu/item/manage/${EditType.LABEL}/${item.id}`)}>
      {item && item.labels?.length ? (
        renderLabels(item.labels)
      ) : (
        <Typography muted size="large" p className="mb-5">
          <Typography muted>{t("no_labels")}</Typography>
        </Typography>
      )}
    </Card>
  );
};
