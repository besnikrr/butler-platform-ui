import { useState } from "react";
import {
  Button,
  useApi,
  Divider,
  Modal,
  useTranslation,
  Typography,
  Link,
} from "@butlerhospitality/ui-sdk";
import { AppEnum, HTTPResourceResponse, Item } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";

export interface ItemStatusResourceMeta {
  resource: string;
  id: string;
  is_active: boolean;
  name: string;
  menus: ItemRelation[];
}

export interface ItemRelation {
  id: number;
  name: string;
}

interface ItemStatusResourceProps {
  onClose: () => void;
  meta: ItemStatusResourceMeta;
  reloadData: () => void;
}

export default function ItemStatus({
  reloadData,
  meta: { id, is_active, name, menus },
  onClose,
}: ItemStatusResourceProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const menuServiceApi = useApi(AppEnum.MENU);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleStatusChange = async () => {
    setIsUpdating(true);
    const result = await menuServiceApi.post<HTTPResourceResponse<Item[]>>(
      `/products/batch-edit-status`,
      {
        ids: [id],
        is_active: !is_active,
      }
    );

    if (result.data.payload) {
      setIsUpdating(false);
      reloadData();
      return onClose();
    }
    return null;
  };

  return (
    <Modal visible onClose={onClose} style={{ maxWidth: 500 }}>
      <Typography h2>{t("deactive_confirmation")}</Typography>
      <Divider />
      <Typography span className="ui-flex mb-20">
        {t(
          `${name} is currently active in ${menus.length} different menus. Deactivating this item will make this item unavailable for purchase. Are you sure you want to proceed?`
        )}
      </Typography>
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {menus.map((item: ItemRelation) => (
          <Link
            component={Link}
            onClick={() => history.push(`/menu/menu/view/${item.id}`)}
            className="ui-flex mb-10"
          >
            <Typography>{t(`Go to ${item.name}`)}</Typography>
          </Link>
        ))}
      </div>

      <Divider />
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
          disabled={isUpdating}
          size="large"
          variant="danger"
          style={{ marginLeft: 20 }}
          onClick={handleStatusChange}
        >
          {t("deactive")}
        </Button>
      </div>
    </Modal>
  );
}
