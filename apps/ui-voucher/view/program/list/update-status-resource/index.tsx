import {
  Button,
  Divider,
  Modal,
  pushNotification,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { ProgramStatus } from "@butlerhospitality/shared";
import { useUpdateProgramStatus } from "../../../../store/program";

export interface StatusUpdateResourceMeta {
  ids: string[];
  status: "ACTIVE" | "INACTIVE";
}

interface StatusUpdateResourceProps {
  onClose: (itemUpdated: boolean) => void;
  meta: StatusUpdateResourceMeta;
}
function StatusUpdateResource({ meta, onClose }: StatusUpdateResourceProps) {
  const { t } = useTranslation();

  const {
    mutateAsync: updateBatchStatus,
    isLoading: isUpdateStatusLoading,
    isError: isUpdateProgramError,
  } = useUpdateProgramStatus();

  const patchProgramStatus = async () => {
    await updateBatchStatus({
      activate: meta.status !== ProgramStatus.ACTIVE,
      ids: meta.ids,
    });

    return onClose(true);
  };

  if (isUpdateProgramError) {
    pushNotification(t("Error fetching entity", { entity: "program" }), {
      type: "error",
    });
    return null;
  }

  return (
    <Modal visible onClose={() => onClose(false)} style={{ minWidth: 360 }}>
      <h3>
        {meta.status === ProgramStatus.ACTIVE
          ? t("DEACTIVATE_PROGRAM")
          : t("ACTIVATE_PROGRAM")}
      </h3>
      <Divider />
      <span>
        {meta.status === ProgramStatus.ACTIVE
          ? t("CONFIRM_DEACTIVATE_PROGRAM")
          : t("CONFIRM_ACTIVATE_PROGRAM")}
      </span>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 30,
        }}
      >
        <Button size="large" variant="ghost" onClick={() => onClose(false)}>
          {t("CANCEL")}
        </Button>
        <Button
          disabled={isUpdateStatusLoading}
          size="large"
          variant={meta.status === ProgramStatus.ACTIVE ? "danger" : "primary"}
          style={{ marginLeft: 20 }}
          onClick={patchProgramStatus}
        >
          {meta.status === ProgramStatus.ACTIVE
            ? t("DEACTIVATE")
            : t("ACTIVATE")}
        </Button>
      </div>
    </Modal>
  );
}

export default StatusUpdateResource;
