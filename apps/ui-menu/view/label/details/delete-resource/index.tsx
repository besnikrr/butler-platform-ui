import React, { useState } from "react";
import { Button, useApi, Divider, Modal, useTranslation } from "@butlerhospitality/ui-sdk";
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

const DeleteResource: React.FC<DeleteResourceProps> = ({ meta: { id }, onClose, onDelete }): JSX.Element => {
  const { t } = useTranslation();
  const networkServiceApi = useApi(AppEnum.MENU);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteButtonOnClick = () => {
    const deleteAction = async () => {
      setIsDeleting(true);
      await networkServiceApi.delete<ResourceResponse<boolean>>(`/labels/${id}`);
      onDelete();
      // TODO: HANDLE ERRORS
    };
    deleteAction();
  };
  return (
    <Modal visible onClose={onClose} style={{ minWidth: 360 }}>
      <h3>{t("delete_label")}</h3>
      <Divider />
      <span>{t("delete_label_confirm")}</span>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 30,
        }}
      >
        <Button size="large" variant="ghost" onClick={onClose}>
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
