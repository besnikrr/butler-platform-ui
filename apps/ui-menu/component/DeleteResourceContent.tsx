import React, { useEffect, useState } from "react";
import {
  Typography,
  Divider,
  Skeleton,
  Link,
  Icon,
  Input,
  Button,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

interface DeleteResourceContentProps {
  isLoading: boolean;
  relations: any;
  keys: string[];
  title: string;
  contentText?: { title: string; subtitle: string; info: string };
  deleteConfirmation: (deleteText: string | undefined) => any;
  onDelete: (nonce?: string) => void;
  onClose: () => void;
}

const generateLink = (id: string, type: string) => {
  switch (type) {
    case "subcategories":
      return `menu/category/manage/${id}`;
    case "items":
      return `menu/item/manage/${id}`;
    case "menus":
      return `/menu/menu/manage/${id}`;
    default:
      return "";
  }
};

const DeleteResourceContent: React.FC<DeleteResourceContentProps> = ({
  relations,
  keys,
  isLoading,
  title,
  onDelete,
  onClose,
  deleteConfirmation,
  contentText,
}) => {
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [deleteText, setDeleteText] = useState<string>();
  const GENERAL_DELETE_VALIDATION: string = contentText?.title
    ? contentText.title
    : `${t("delete")} ${title}`;

  useEffect(() => {
    if (deleteText?.trim() === GENERAL_DELETE_VALIDATION.trim().toLowerCase()) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    deleteConfirmation(deleteText);
  }, [deleteText]);

  const hasRelations =
    relations &&
    keys.reduce((acc, key) => acc || relations[key].length > 0, false);

  return (
    <>
      <Typography h2>
        {contentText?.title ? contentText.title : `${t("delete")} ${title}?`}
      </Typography>
      <Divider />
      <Typography className="ui-flex mb-10">
        {contentText?.subtitle
          ? contentText.subtitle
          : `${t("delete_confirm")} ${title?.toLowerCase()}`}
        ?
      </Typography>
      {isLoading && <Skeleton parts={["labelField-4"]} className="mt-20" />}
      {hasRelations && (
        <Typography>
          {contentText?.info
            ? contentText.info
            : t("delete_entity_used_on", { entity: title?.toLowerCase() })}
        </Typography>
      )}
      {!isLoading &&
        hasRelations &&
        keys.map((key) => {
          const relation = relations?.[key];
          if (!relation.length) return null;
          return (
            <div className="mt-30" key={key}>
              <Typography size="large" className="menu-text-capitalize" p>
                {key}:
              </Typography>
              <ul className="mt-10">
                {relation.map((item: any) => (
                  <li key={item.id} className="my-5">
                    <Link
                      size="medium"
                      href={generateLink(item.id, key)}
                      target="_blank"
                      className="ui-flex v-center between ui-border p-10 ui-rounded"
                    >
                      {item.name}
                      <Icon type="Link" size={14} className="ml-5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      <div className="ui-flex mt-30 column end">
        <Typography className="mb-10">
          {t("type_validation_to_continue", {
            validation: GENERAL_DELETE_VALIDATION.toLowerCase(),
          })}
        </Typography>
        <Input
          placeholder={GENERAL_DELETE_VALIDATION.toLowerCase()}
          onChange={(event) => setDeleteText(event.target.value)}
        />
      </div>
      <Divider vertical={30} />
      <div className="ui-flex v-center end">
        <Button size="large" variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isDisabled}
          size="large"
          variant="danger"
          className="ml-10"
          onClick={() => {
            setIsDisabled(true);
            onDelete(deleteText);
          }}
        >
          {t("delete")}
        </Button>
      </div>
    </>
  );
};

DeleteResourceContent.defaultProps = {
  contentText: {
    title: "",
    subtitle: "",
    info: "",
  },
};

export default DeleteResourceContent;
