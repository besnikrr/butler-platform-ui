import React from "react";
import { ActionButton, Dropdown, Button } from "@butlerhospitality/ui-sdk";

const ActionResource: React.FC<any> = (props): JSX.Element => {
  return (
    <Dropdown
      renderTrigger={(openDropdown, triggerRef) => (
        <ActionButton ref={triggerRef} onClick={openDropdown}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.79939 9.00012C4.79939 9.78679 4.16167 10.4245 3.375 10.4245C2.58833 10.4245 1.95061 9.78679 1.95061 9.00012C1.95061 8.21345 2.58833 7.57573 3.375 7.57573C4.16167 7.57573 4.79939 8.21345 4.79939 9.00012ZM10.4244 9.00012C10.4244 9.78679 9.78667 10.4245 9 10.4245C8.21333 10.4245 7.57561 9.78679 7.57561 9.00012C7.57561 8.21345 8.21333 7.57573 9 7.57573C9.78667 7.57573 10.4244 8.21345 10.4244 9.00012ZM16.0494 9.00012C16.0494 9.78679 15.4117 10.4245 14.625 10.4245C13.8383 10.4245 13.2006 9.78679 13.2006 9.00012C13.2006 8.21345 13.8383 7.57573 14.625 7.57573C15.4117 7.57573 16.0494 8.21345 16.0494 9.00012Z"
              stroke="currentColor"
              strokeWidth="0.901216"
            />
          </svg>
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
          Manage
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
          Delete
        </Button>
      </div>
    </Dropdown>
  );
};

export default ActionResource;
