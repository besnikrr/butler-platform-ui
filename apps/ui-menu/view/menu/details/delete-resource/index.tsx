import React, { useState } from "react";
import {
  Button,
  useApi,
  Divider,
  Modal,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, ResourceResponse } from "@butlerhospitality/shared";

export interface DeleteResourceMeta {
  resource: string;
  id: string;
}

interface DeleteResourceProps {
  onClose: () => void;
  onDelete: () => void;
  meta: DeleteResourceMeta;
}

const DeleteResource: React.FC<DeleteResourceProps> = (props) => {
  const { t } = useTranslation();
  const networkServiceApi = useApi(AppEnum.MENU);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteButtonOnClick = () => {
    const deleteAction = async () => {
      setIsDeleting(true);
      await networkServiceApi.delete<ResourceResponse<boolean>>(
        `/${props.meta.id}`
      );
      props.onDelete();
      // TODO: HANDLE ERRORS
    };
    deleteAction();
  };
  return (
    <Modal visible onClose={props.onClose} style={{ minWidth: 360 }}>
      <h3>{t("delete_menu")}</h3>
      <Divider />
      <span>{t("delete_menu_confirm")}</span>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 30,
        }}
      >
        <Button size="large" variant="ghost" onClick={props.onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isDeleting}
          size="large"
          variant="danger"
          style={{ marginLeft: 20 }}
          onClick={deleteButtonOnClick}
        >
          {t("delete")}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteResource;
