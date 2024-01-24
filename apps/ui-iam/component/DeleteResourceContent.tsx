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
import { Hotel } from "@butlerhospitality/shared";

const GENERAL_DELETE_VALIDATION = "proceed anyway";

interface DeleteResourceContentProps {
  isLoading: boolean;
  relations: any;
  title?: string;
  deleteConfirmation: (deleteText: string | undefined) => void;
  onDelete: (nonce?: string) => void;
  onClose: () => void;
}

const DeleteResourceContent: React.FC<DeleteResourceContentProps> = ({
  relations,
  isLoading,
  title,
  onDelete,
  onClose,
  deleteConfirmation,
}) => {
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(true);
  const [deleteText, setDeleteText] = useState<string>();

  useEffect(() => {
    if (deleteText === GENERAL_DELETE_VALIDATION) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    deleteConfirmation(deleteText);
  }, [deleteText]);

  useEffect(() => {
    if (relations?.length === 0) {
      setDeleteText(GENERAL_DELETE_VALIDATION);
    }
  }, [relations, isDisabled]);

  return (
    <>
      <Typography h2>{`${t("delete")} ${title}`}</Typography>
      <Divider />
      <Typography className="ui-flex mb-10">
        {`${t("delete_confirm")} ${title?.toLowerCase()}`}
      </Typography>
      {isLoading && <Skeleton parts={["labelField-4"]} className="mt-20" />}
      {relations?.length > 0 && (
        <Typography>
          {`${t("delete_entity_used_on", { entity: title?.toLowerCase() })}`}
        </Typography>
      )}
      {!isLoading && relations?.length > 0 && (
        <div className="mt-30">
          <Typography size="large" className="menu-text-capitalize" p>
            Hotels
          </Typography>
          <ul className="mt-10">
            {relations.map((item: Hotel) => (
              <li key={item.id} className="my-5">
                <Link
                  size="medium"
                  href={`network/hotel/view/${item.id}`}
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
      )}
      {relations?.length > 0 && (
        <div className="ui-flex mt-30 column end">
          <Typography className="mb-10">
            {t("type_validation_to_continue", {
              validation: GENERAL_DELETE_VALIDATION,
            })}
          </Typography>
          <Input
            placeholder={GENERAL_DELETE_VALIDATION}
            onChange={(event) => setDeleteText(event.target.value)}
          />
        </div>
      )}
      <Divider vertical={30} />
      <div className="ui-flex v-center end">
        <Button size="large" variant="ghost" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={relations?.length > 0 ? isDisabled : false}
          size="large"
          variant="danger"
          className="ml-10"
          onClick={() => {
            setIsDisabled(true);
            onDelete(deleteText);
          }}
        >
          {t("continue")}
        </Button>
      </div>
    </>
  );
};

export default DeleteResourceContent;
