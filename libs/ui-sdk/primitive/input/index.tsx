import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { ComponentSizeProp, SimpleSpread } from "../../util";

import "./index.scss";

interface Props {
  size?: ComponentSizeProp;
}

type InputBaseProps = SimpleSpread<
  InputHTMLAttributes<HTMLInputElement>,
  Props
>;

const InputBase = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames("ui-input", props.className)}
    />
  );
});

export { InputBase, InputBaseProps };
