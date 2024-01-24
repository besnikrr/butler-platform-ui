import { useState } from "react";
import {
  Button,
  Divider,
  Modal,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { useDeleteHotel } from "../../../../../store/hotel";

export interface DeleteResourceMeta {
  resource: string;
  id: string;
}

interface DeleteResourceProps {
  onClose: () => void;
  meta: DeleteResourceMeta;
  reloadData: (data: string) => void;
}

export default function DeleteResource({
  reloadData,
  meta,
  onClose,
}: DeleteResourceProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { mutate: deleteHotel } = useDeleteHotel(meta.id);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteHotel();
      reloadData(meta.id);
      onClose();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Modal visible onClose={onClose} style={{ minWidth: 360 }}>
      <h3>{t("Delete Hotel")}</h3>
      <Divider />
      <span>{t("Are you sure you want to delete this Hotel?")}</span>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 30,
        }}
      >
        <Button size="large" variant="ghost" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button
          disabled={isDeleting}
          size="large"
          variant="danger"
          style={{ marginLeft: 20 }}
          onClick={onDelete}
        >
          {t("Delete")}
        </Button>
      </div>
    </Modal>
  );
}
