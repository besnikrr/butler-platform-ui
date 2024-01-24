import React from "react";
import classNames from "classnames";
import { Icon } from "../icon";

import "./index.scss";

interface ErrorMessageProps {
  className?: string;
  error?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ className, error }) => {
  return (
    <div
      data-testid="ui-error-message"
      className={classNames("ui-error-message", className)}
    >
      <Icon type="Infoi" size={16} />
      {error}
    </div>
  );
};

ErrorMessage.defaultProps = {
  className: "",
  error: "",
};

export { ErrorMessage };
