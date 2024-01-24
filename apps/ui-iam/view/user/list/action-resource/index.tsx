import React from "react";
import {
  ActionButton,
  Dropdown,
  Button,
  Icon,
  useTranslation,
} from "@butlerhospitality/ui-sdk";

const ActionResource: React.FC<any> = (props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Dropdown
      renderTrigger={(openDropdown, triggerRef) => (
        <ActionButton ref={triggerRef} onClick={openDropdown}>
          <Icon type="ThreeDots" size={18} />
        </ActionButton>
      )}
      hasArrow
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 160,
        }}
      >
        <Button
          className="w-100"
          variant="ghost"
          muted
          onClick={() => {
            props.history.push(`/iam/users/details/${props.item.id}`);
          }}
        >
          {t("manage")}
        </Button>
        <Button
          className="w-100"
          variant="danger-ghost"
          muted
          onClick={() => {
            if (props.item.id) {
              props.setDeleteResourceMeta({
                resource: "iam",
                id: props.item.id,
              });
            }
          }}
        >
          {t("delete")}
        </Button>
      </div>
    </Dropdown>
  );
};

export default ActionResource;
