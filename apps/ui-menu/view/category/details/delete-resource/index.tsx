import React, { useEffect, useState } from "react";
import { useApi, Modal, useTranslation } from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  CategoryRelations,
  ResourceResponse,
} from "@butlerhospitality/shared";
import DeleteResourceContent from "../../../../component/DeleteResourceContent";

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
  const networkServiceApi = useApi(AppEnum.MENU);
  const [categoryRelations, setCategoryRelations] =
    useState<CategoryRelations>();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>();

  const deleteButtonOnClick = async () => {
    try {
      await networkServiceApi.delete<ResourceResponse<boolean>>(
        `/categories/${props.meta.id}`,
        { data: { confirmation: deleteConfirmation } }
      );
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
        const result = await networkServiceApi.get<CategoryRelations>(
          `/categories/${props.meta.id}/relations`
        );
        setCategoryRelations(result.data);
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
        title={t("category")}
        isLoading={isLoading}
        relations={categoryRelations}
        deleteConfirmation={(event) => setDeleteConfirmation(event)}
        keys={["menus", "subcategories", "items"]}
        onClose={props.onClose}
        onDelete={deleteButtonOnClick}
      />
    </Modal>
  );
};

export default DeleteResource;
