import React from "react";
import { ErrorObjectType } from "@butlerhospitality/shared";
import { ErrorMessage } from "@butlerhospitality/ui-sdk";

const Error: React.FC<ErrorObjectType> = ({ message }) => {
  return <div>{message && <ErrorMessage error={message} />}</div>;
};

export { Error };
