import { useContext, useState } from "react";
import {
  Button,
  useTranslation,
  AppContext,
  Dropdown,
  ActionButton,
  Icon,
} from "@butlerhospitality/ui-sdk";
import { PERMISSION } from "@butlerhospitality/shared";
import { useHistory } from "react-router-dom";
import { HotelGeneralInformationProp } from "../index.types";
import DeleteResource, { DeleteResourceMeta } from "./delete-resource";
import { useUpdateHotel } from "../../../../store/hotel";

export default function HotelStatus({
  hotel,
  onChange,
}: HotelGeneralInformationProp) {
  const { can } = useContext(AppContext);
  const { t } = useTranslation();
  const history = useHistory();
  const deleteButtonVisible = can(PERMISSION.NETWORK.CAN_DELETE_HOTEL);
  const canChangeHotelStatus = can(PERMISSION.NETWORK.CAN_CHANGE_HOTEL_STATUS);
  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();

  const { mutateAsync: updateHotel, isLoading: isUpdateHotelLoading } =
    useUpdateHotel(`${hotel?.id}`);

  const isHotelActive = hotel?.active;
  const showDropDown = !(!deleteButtonVisible && !canChangeHotelStatus);

  const patchHotelStatus = async () => {
    await updateHotel({
      active: !isHotelActive,
    });
  };

  const onDelete = async () => {
    if (hotel?.id) {
      setDeleteResourceMeta({
        resource: "hotels",
        id: `${hotel?.id}`,
      });
    }
  };

  return (
    <div>
      {showDropDown && (
        <Dropdown
          renderTrigger={(openDropdown, triggerRef) => (
            <ActionButton ref={triggerRef} onClick={openDropdown}>
              <Icon
                type="ThreeDots"
                size={40}
                data-testid="hotel-view-action-btn"
              />
            </ActionButton>
          )}
          hasArrow
          placement="right"
        >
          <div className="ui-flex column network-action-dropdown">
            {canChangeHotelStatus && (
              <Button
                className="w-100"
                variant={isHotelActive ? "danger-ghost" : "ghost"}
                muted
                onClick={patchHotelStatus}
                disabled={isUpdateHotelLoading}
              >
                <Icon
                  type={isHotelActive ? "Close" : "Checkmark"}
                  size={20}
                  className="mr-10"
                />
                {isHotelActive ? t("Deactivate Hotel") : t("Activate Hotel")}
              </Button>
            )}
            {deleteButtonVisible && (
              <Button
                className="w-100"
                variant="danger-ghost"
                muted
                onClick={onDelete}
              >
                <Icon type="Delete" size={20} className="mr-10" />
                Delete
              </Button>
            )}
          </div>
        </Dropdown>
      )}
      {deleteResourceMeta && (
        <DeleteResource
          reloadData={() => history.push("/network/hotel/list")}
          meta={deleteResourceMeta}
          onClose={() => setDeleteResourceMeta(undefined)}
        />
      )}
    </div>
  );
}
