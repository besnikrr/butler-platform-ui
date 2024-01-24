import React, { useEffect, useState } from "react";
import { useApi, Modal, useTranslation } from "@butlerhospitality/ui-sdk";
import { AppEnum, ResourceResponse } from "@butlerhospitality/shared";
import DeleteResourceContent from "../../../../../component/DeleteResourceContent";

export interface DeleteResourceMeta {
  resource: string;
  id: string;
}

interface DeleteResourceProps {
  onClose: () => void;
  onDelete: () => void;
  meta: DeleteResourceMeta;
}

const DeleteResource: React.FC<DeleteResourceProps> = (props): JSX.Element => {
  const { t } = useTranslation();
  const menuServiceApi = useApi(AppEnum.MENU);
  const [itemRelations, setItemRelations] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>();

  const deleteButtonOnClick = async () => {
    try {
      await menuServiceApi.delete<boolean>(`/products/${props.meta.id}`, {
        data: { confirmation: deleteConfirmation },
      });
      props.onDelete();
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getRelations = async () => {
      try {
        const result = await menuServiceApi.get<ResourceResponse<boolean>>(
          `/products/${props.meta.id}/relations`
        );
        setItemRelations(result.data);
      } catch (e: any) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    getRelations();
  }, []);

  return (
    <Modal visible onClose={props.onClose} style={{ minWidth: 500 }}>
      <DeleteResourceContent
        title={t("item")}
        isLoading={isLoading}
        relations={itemRelations}
        deleteConfirmation={(event) => setDeleteConfirmation(event)}
        keys={["menus"]}
        onClose={props.onClose}
        onDelete={deleteButtonOnClick}
      />
    </Modal>
  );
};

export default DeleteResource;
