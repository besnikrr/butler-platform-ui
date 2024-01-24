import React, {
  CSSProperties,
  InputHTMLAttributes,
  RefObject,
  useEffect,
} from "react";
import classNames from "classnames";
import { RadioBase, RadioBaseProps } from "../../primitive";
import { useForkRef } from "../../util";
import { Icon } from "../icon";

import "./index.scss";

interface RadioProps extends RadioBaseProps {
  errorText?: string;
  RadioStyle?: CSSProperties;
  inputClassName?: string;
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { size = "medium", errorText, style, label, inputClassName, ...props },
    ref
  ) => {
    const labelRef = React.useRef<HTMLLabelElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleInputRef = useForkRef(inputRef, ref);

    function change(e: any) {
      if (e.target.checked) {
        labelRef.current?.classList.add("ui-radio-checked");
        document
          .querySelectorAll(`input[type=radio][name="${props.name}"]`)
          .forEach((item: any) => {
            if (!item.checked) item.dispatchEvent(new Event("change"));
          });
      } else {
        labelRef.current?.classList.remove("ui-radio-checked");
      }
    }

    useEffect(() => {
      inputRef.current?.addEventListener("change", change);
      if (inputRef.current?.defaultChecked) {
        labelRef.current?.classList.add("ui-radio-checked");
      }
      return () => {
        inputRef.current?.removeEventListener("change", change);
      };
    }, [inputRef]);

    useEffect(() => {
      if (inputRef.current?.checked) {
        labelRef.current?.classList.add("ui-radio-checked");
      }
    }, [ref]);

    return (
      <label
        ref={labelRef}
        htmlFor={props.id}
        className={classNames(
          "ui-radio-wrapper",
          {
            "ui-radio-checked": inputRef.current?.checked,
            "ui-disabled": props.disabled,
          },
          props.className
        )}
      >
        <span className="ui-radio">
          <RadioBase
            {...props}
            ref={handleInputRef}
            className={inputClassName}
          />
        </span>
        {label && <span className="ui-radio-label">{label}</span>}
      </label>
    );
  }
);

export { Radio, RadioProps };
