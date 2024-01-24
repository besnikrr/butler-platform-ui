import { useState } from "react";
import {
  Button,
  Row,
  useTranslation,
  Dropdown,
  ActionButton,
  Icon,
} from "@butlerhospitality/ui-sdk";
import { useHistory } from "react-router-dom";
import ReassignHotels from "../reassign-hotels";
import { HubGeneralInformationProp } from "../index.types";
import DeleteResource, { DeleteResourceMeta } from "./delete-resource";
import { useUpdateHubStatus, useFetchHub } from "../../../../store/hub";

export default function HubStatus({
  hub,
  onChange,
}: HubGeneralInformationProp) {
  const { t } = useTranslation();
  const history = useHistory();
  const [reassignHotelModal, setReassignHotelModal] = useState<boolean>();
  const [deleteHub, setDeleteHub] = useState<boolean>(false);
  const [deleteResourceMeta, setDeleteResourceMeta] =
    useState<DeleteResourceMeta>();

  const { mutateAsync: updateHubStatus, isLoading: isUpdateHubStatusLoading } =
    useUpdateHubStatus(`${hub?.id}`);

  const isHubActive = hub?.active;
  const hotelCount = hub?.hotels?.length;

  const { refetch: refetchHub } = useFetchHub({
    id: `${hub?.id}`,
    enabled: false,
  });

  const patchHubStatus = async () => {
    await updateHubStatus({
      status: !isHubActive,
      name: hub?.name || "",
      city_id: hub?.city_id && +hub?.city_id,
    });
    const updatedHub = await refetchHub();
    onChange?.(updatedHub?.data?.payload);
  };

  const getUpdatedHub = async () => {
    const updatedHub = await refetchHub();
    onChange?.(updatedHub?.data?.payload);
  };

  const onDeleteOrReassign = async () => {
    if (hub?.id && !hotelCount) {
      return setDeleteResourceMeta({
        resource: "hubs",
        id: `${hub?.id}`,
      });
    }
    setDeleteHub(true);
    return setReassignHotelModal(true);
  };

  const handleStatusChange = async () => {
    if (isHubActive && hotelCount) {
      return setReassignHotelModal(true);
    }

    return patchHubStatus();
  };

  return (
    <Row>
      <div>
        <Dropdown
          renderTrigger={(openDropdown, triggerRef) => (
            <ActionButton
              ref={triggerRef}
              onClick={openDropdown}
              data-testid="three-dots-cta"
            >
              <Icon type="ThreeDots" size={40} />
            </ActionButton>
          )}
          hasArrow
          placement="right"
        >
          <div className="ui-flex column network-action-dropdown">
            <Button
              muted
              className="w-100"
              variant={`${isHubActive ? "danger-ghost" : "ghost"}`}
              onClick={handleStatusChange}
              disabled={isUpdateHubStatusLoading}
            >
              <Icon
                type={isHubActive ? "Close" : "Checkmark"}
                className="mr-10"
                size={20}
              />
              {isHubActive ? t("Deactivate Hub") : t("Activate Hub")}
            </Button>
            <Button
              className="w-100"
              variant="danger-ghost"
              muted
              onClick={onDeleteOrReassign}
            >
              <Icon type="Delete" size={20} className="mr-10" />
              Delete
            </Button>
          </div>
        </Dropdown>
      </div>
      <ReassignHotels
        hub={hub}
        modal={reassignHotelModal}
        setModal={setReassignHotelModal}
        onChange={async () => {
          if (!deleteHub) {
            getUpdatedHub();
          }
        }}
        submitTxt={t(
          deleteHub
            ? "Save Assignment & Delete Hub"
            : "Save Assignment & Deactivate Hub"
        )}
        isDeleteAction={deleteHub}
      />
      {deleteResourceMeta && (
        <DeleteResource
          reloadData={() => history.push("/network/hub/list")}
          meta={deleteResourceMeta}
          onClose={() => setDeleteResourceMeta(undefined)}
        />
      )}
    </Row>
  );
}
