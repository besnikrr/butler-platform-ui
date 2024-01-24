import classNames from "classnames";
import React, { TextareaHTMLAttributes } from "react";
import { SimpleSpread } from "../../util";

import "./index.scss";

interface Props {
  size?: "default" | "small" | "large";
}

type TextareaBaseProps = SimpleSpread<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  Props
>;

const TextareaBase = React.forwardRef<HTMLTextAreaElement, TextareaBaseProps>(
  ({ size, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classNames(
          "ui-textarea",
          { [`ui-textarea-${size}`]: size },
          props.className
        )}
      >
        {props.children}
      </textarea>
    );
  }
);

export { TextareaBase, TextareaBaseProps };
