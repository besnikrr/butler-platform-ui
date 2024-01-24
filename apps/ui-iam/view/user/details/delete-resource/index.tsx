/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from "react";
import { useApi, Modal, useTranslation } from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  Hotel,
  HTTPResourceResponse,
} from "@butlerhospitality/shared";
import DeleteResourceContent from "../../../../component/DeleteResourceContent";
import { useDeleteUser } from "../../../../store/user/queries/use-delete-user";

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
  const networkServiceApi = useApi(AppEnum.NETWORK);
  const [userRelations, setUserRelations] = useState<Hotel>();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>();
  const { mutate: deleteUser } = useDeleteUser(props.meta.id);

  const deleteButtonOnClick = async () => {
    if (deleteConfirmation) {
      try {
        await deleteUser();
        props.onDelete();
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const getRelations = async () => {
      try {
        const result = await networkServiceApi.get<HTTPResourceResponse<Hotel>>(
          `/hotels?account_manager=${props.meta.id}`
        );
        setUserRelations(result.data.payload);
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getRelations();
  }, []);

  return (
    <Modal visible onClose={props.onClose} style={{ minWidth: 500 }}>
      <DeleteResourceContent
        title={t("user")}
        isLoading={isLoading}
        relations={userRelations}
        deleteConfirmation={(event) => setDeleteConfirmation(event)}
        onClose={props.onClose}
        onDelete={deleteButtonOnClick}
      />
    </Modal>
  );
};

export default DeleteResource;
