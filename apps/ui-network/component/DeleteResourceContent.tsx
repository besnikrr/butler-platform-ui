import {
  Typography,
  Divider,
  Skeleton,
  Link,
  Icon,
  Button,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { HotelV2 } from "@butlerhospitality/shared";

interface DeleteResourceContentProps {
  title: string;
  onDelete: (nonce?: string) => void;
  onClose: () => void;
  contentText: { title: string; subtitle?: string; info?: string };
  isLoading?: boolean;
  relations?: any;
}

export default function DeleteResourceContent({
  relations = [],
  isLoading = false,
  title,
  onDelete,
  onClose,
  contentText,
}: DeleteResourceContentProps) {
  const { t } = useTranslation();

  const hasRelations = relations?.length;
  return (
    <>
      <Typography h2>
        {contentText?.title ? contentText.title : `${t("delete")} ${title}`}
      </Typography>
      <Divider />
      {isLoading && <Skeleton parts={["labelField-4"]} className="mt-20" />}
      {hasRelations ? (
        <Typography>
          {contentText?.info
            ? contentText.info
            : t("delete_entity_used_on", { entity: title?.toLowerCase() })}
          :
        </Typography>
      ) : (
        <Typography>{t("delete_confirm")} Hub?</Typography>
      )}

      {!isLoading && (
        <ul className="mt-10">
          {(relations || []).map((item: HotelV2) => (
            <li key={item.id} className="my-5">
              <Link
                size="medium"
                href={`network/hotel/view/${item.id}`}
                target="_blank"
                className="ui-flex v-center between ui-border p-5 ui-rounded"
              >
                {item.name}
                <Icon type="Link" size={14} className="ml-5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Divider vertical={30} />
      <div className="ui-flex v-center end">
        {!hasRelations && (
          <>
            <Button size="large" variant="ghost" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              size="large"
              variant="danger"
              className="ml-10"
              onClick={() => {
                onDelete();
              }}
            >
              {t("Delete")}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
