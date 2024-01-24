import { Modal, useTranslation } from "@butlerhospitality/ui-sdk";
import DeleteResourceContent from "../../../../../component/DeleteResourceContent";
import { useDeleteHub } from "../../../../../store/hub";

export interface DeleteResourceMeta {
  resource: string;
  id: string;
}

interface DeleteResourceProps {
  onClose: () => void;
  meta: DeleteResourceMeta;
  reloadData: (data?: string) => void;
}

export default function DeleteResource({
  reloadData,
  meta,
  onClose,
}: DeleteResourceProps) {
  const { t } = useTranslation();
  const { mutate: deleteHub } = useDeleteHub(meta.id);

  const onDelete = async () => {
    try {
      await deleteHub();
      reloadData();
      onClose();
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Modal visible onClose={onClose} style={{ minWidth: 360 }}>
      <DeleteResourceContent
        title={t("Hub")}
        onClose={onClose}
        onDelete={onDelete}
        contentText={{
          title: t("Delete Hub?"),
        }}
      />
    </Modal>
  );
}
