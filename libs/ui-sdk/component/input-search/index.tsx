import React, { useState } from "react";
import classNames from "classnames";
import { Input, InputProps } from "../input";
import { useForkRef } from "../../util";
import InputAddon from "../input-addon";
import { Icon } from "../icon";
import { Typography } from "../typography";

import "./index.scss";

interface InputSearchProps extends InputProps {
  className?: string;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  (props, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const inputRef = useForkRef(innerRef, ref);
    const [hasValue, setHasValue] = useState(
      !!props.value || !!innerRef.current?.value
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.onChange) {
        props.onChange(e);
      }
      setHasValue(!!e.target.value);
    };

    const clearInput = () => {
      if (innerRef.current) {
        // trigger change event
        const ev = new Event("input", { bubbles: true });
        innerRef.current.value = "";
        innerRef.current.dispatchEvent(ev);
        handleChange(ev as any);
      }
    };

    return (
      <Input
        {...props}
        ref={inputRef}
        onChange={handleChange}
        type="text"
        className={classNames("ui-input-search", props.className)}
        prefixNode={<Icon type="Search" size={20} />}
        rightAddon={
          hasValue && (
            <InputAddon disabled={props.disabled} onClick={clearInput}>
              <Typography muted>Clear</Typography>
            </InputAddon>
          )
        }
      />
    );
  }
);

export { InputSearch };
