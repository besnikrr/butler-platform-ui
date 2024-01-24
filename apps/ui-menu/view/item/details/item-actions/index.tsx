import { useContext, useState } from "react";
import {
  Button,
  useTranslation,
  AppContext,
  Dropdown,
  Icon,
  pushNotification,
  useApi,
} from "@butlerhospitality/ui-sdk";
import {
  AppEnum,
  HTTPResourceResponse,
  Item,
  PERMISSION,
} from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import DeleteResource, { DeleteResourceMeta } from "./delete-resource";
import { ItemActionsProp } from "../index.types";
import ItemStatus, { ItemStatusResourceMeta } from "./change-status";

export default function ItemActions({ item, onChange }: ItemActionsProp) {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const menuServiceApi = useApi(AppEnum.MENU);

  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();
  const [itemStatusResourceMeta, setItemStatusResourceMeta] =
    useState<ItemStatusResourceMeta>();
  const canDeleteItem = can(PERMISSION.MENU.CAN_DELETE_ITEM);
  const canUpdateItemStatus = can(PERMISSION.MENU.CAN_CHANGE_ITEM_STATUS);

  const handleStatusChange = async () => {
    const result = await menuServiceApi.get<any>(
      `/products/${item?.id}/relations`
    );
    if (item?.id && item?.is_active && result.data) {
      setItemStatusResourceMeta({
        resource: "items",
        id: item.id,
        is_active: item.is_active,
        name: item.name,
        menus: result.data.menus,
      });
    } else {
      await menuServiceApi.post<HTTPResourceResponse<Item[]>>(
        `/products/batch-edit-status`,
        {
          ids: [item?.id],
          is_active: !item?.is_active,
        }
      );
      onChange?.();
    }
  };

  return (
    <div>
      {(canDeleteItem || canUpdateItemStatus) && (
        <Dropdown
          renderTrigger={(openDropdown, triggerRef) => (
            <Button
              size="small"
              variant="ghost"
              ref={triggerRef}
              onClick={openDropdown}
              iconOnly
            >
              <Icon type="MoreHorizontal01" size={18} />
            </Button>
          )}
          hasArrow
          placement="right"
        >
          <div className="ui-flex column network-action-dropdown">
            <div>
              {canUpdateItemStatus && (
                <Button
                  muted
                  className="w-100"
                  variant={`${item?.is_active ? "danger-ghost" : "ghost"}`}
                  onClick={() => handleStatusChange()}
                >
                  <Icon
                    type={item?.is_active ? "Close" : "Checkmark"}
                    className="mr-10"
                    size={20}
                  />
                  {item?.is_active ? t("deactivate_item") : t("activate_item")}
                </Button>
              )}
              {canDeleteItem && (
                <Button
                  className="w-100"
                  variant="danger-ghost"
                  muted
                  onClick={() => {
                    if (item?.id) {
                      setDeleteResourceMeta({
                        resource: "items",
                        id: `${item?.id}`,
                      });
                    }
                  }}
                >
                  <Icon type="Delete" size={20} className="mr-10" />
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>
        </Dropdown>
      )}
      {itemStatusResourceMeta && (
        <ItemStatus
          meta={itemStatusResourceMeta}
          onClose={() => setItemStatusResourceMeta(undefined)}
          reloadData={() => onChange?.()}
        />
      )}

      {deleteResourceMeta && (
        <DeleteResource
          meta={deleteResourceMeta}
          onClose={() => setDeleteResourceMeta(undefined)}
          onDelete={() => {
            pushNotification("Product deleted successfully", {
              type: "success",
            });
            history.push("/menu/item/list");
          }}
        />
      )}
    </div>
  );
}
