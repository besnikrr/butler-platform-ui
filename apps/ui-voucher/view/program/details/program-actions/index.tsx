import {
  Button,
  Row,
  useTranslation,
  Dropdown,
  ActionButton,
  Icon,
} from "@butlerhospitality/ui-sdk";
import { ProgramStatus } from "@butlerhospitality/shared";
import { ProgramGeneralInformationProp } from "../index.types";
import { useUpdateProgramStatus } from "../../../../store/program";

export default function VoucherProgramStatus({
  program,
}: ProgramGeneralInformationProp) {
  const { t } = useTranslation();
  const isProgramActive = program.status === ProgramStatus.ACTIVE;
  const { mutateAsync: updateBatchStatus } = useUpdateProgramStatus();

  const patchProgramStatus = async () => {
    await updateBatchStatus({
      activate: program.status !== ProgramStatus.ACTIVE,
      ids: [+program.id],
    });
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
              variant={`${isProgramActive ? "danger-ghost" : "ghost"}`}
              onClick={patchProgramStatus}
            >
              <Icon
                type={isProgramActive ? "Close" : "Checkmark"}
                className="mr-10"
                size={20}
              />
              {isProgramActive ? t("Deactivate") : t("Activate")}
            </Button>
          </div>
        </Dropdown>
      </div>
    </Row>
  );
}
