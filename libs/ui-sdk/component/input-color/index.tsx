import React, { useEffect } from "react";
import classNames from "classnames";
import { Input, InputProps } from "../input";
import { InputBase } from "../../primitive";
import { useForkRef } from "../../util";

import "./index.scss";

interface InputColorProps extends InputProps {
  error?: string;
}

const InputColor = React.forwardRef<HTMLInputElement, InputColorProps>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const colorInputRef = React.useRef<HTMLInputElement>(null);
    const handleInputRef = useForkRef(inputRef, ref);

    useEffect(() => {
      const changeColor = (e: any) => {
        if (inputRef.current) {
          // @ts-ignore
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;
          // @ts-ignore
          nativeInputValueSetter.call(inputRef.current, e.target.value);

          const ev2 = new Event("change", { bubbles: true });
          inputRef.current.dispatchEvent(ev2);
        }
      };

      colorInputRef.current?.addEventListener("change", changeColor);
      return () => {
        colorInputRef.current?.removeEventListener("change", changeColor);
      };
    }, [colorInputRef.current]);

    useEffect(() => {
      if (inputRef.current && colorInputRef.current) {
        colorInputRef.current.value = inputRef.current.value;
      }
      const changeColor = (e: any) => {
        if (colorInputRef.current) {
          colorInputRef.current.value = e.target.value;
        }
      };

      inputRef.current?.addEventListener("change", changeColor);
      return () => {
        inputRef.current?.removeEventListener("change", changeColor);
      };
    }, [inputRef.current]);

    return (
      <Input
        {...props}
        ref={handleInputRef}
        type="text"
        className={classNames("ui-input-color", className)}
        leftAddon={
          <InputBase
            defaultValue={inputRef.current?.value}
            ref={colorInputRef}
            type="color"
          />
        }
      />
    );
  }
);

export { InputColor };
