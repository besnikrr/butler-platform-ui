import React, { useState, useEffect } from "react";
import ReactDatePicker, {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
} from "react-datepicker";
import classNames from "classnames";
import { ButtonBase } from "../../primitive/button";
import { Input, InputProps } from "../input";
import { Button } from "../button";
import { Card } from "../card";
import { Divider } from "../divider";
import { Icon } from "../icon";
import { Typography } from "../typography";

import { useForkRef } from "../../util";
import "./index.scss";

type DatePickerPropsType = Pick<ReactDatePickerProps, "minDate" | "maxDate">;
interface DatePickerProps extends DatePickerPropsType {
  inputProps?: InputProps;
  range?: boolean;
  format?: string;
  onChange?: (date: Date | [Date | null, Date | null] | null) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DatePicker: React.FC<DatePickerProps> = ({
  inputProps,
  range,
  format,
  ...props
}) => {
  const [dateRange, setDateRange] = useState<any>(range ? [null, null] : null);
  const inputRef = React.useRef<any>(null);

  const renderDayContents = (day: any, date: Date) => {
    let disabled = false;
    if (props.minDate) {
      disabled = disabled || date < props.minDate;
    }
    if (props.maxDate) {
      disabled = disabled || date > props.maxDate;
    }
    if (date.getDate() === new Date().getDate()) disabled = false;
    return (
      <div
        className={classNames("ui-btn ui-rounded ui-btn-small", {
          "ui-disabled": disabled,
        })}
      >
        {day}
      </div>
    );
  };

  useEffect(() => {
    const onInputChange = (e: any) => {
      inputProps?.onChange?.(e);
    };
    inputRef.current.input.addEventListener("change", onInputChange);
    return () => {
      if (!inputRef.current) return;
      inputRef.current.input.removeEventListener("change", onInputChange);
    };
  }, [inputRef.current?.input]);

  useEffect(() => {
    if (inputRef.current?.input.value) {
      setDateRange(new Date(inputRef.current?.input.value));
    }
  }, []);

  const ExtendedCustomInput = React.forwardRef((customProps: any, ref) => {
    const refFork = useForkRef(ref, (inputProps as any).ref);
    return (
      <>
        <Input
          {...customProps}
          {...inputProps}
          className={classNames(inputProps, "w-100")}
          autoComplete="off"
          ref={refFork}
          onChange={customProps.onChange}
          rightAddon={
            customProps.value && (
              <ButtonBase
                onClick={(_) => {
                  if (inputProps?.onChange) {
                    setTimeout(() => {
                      inputRef.current?.input?.dispatchEvent(
                        new Event("change", { bubbles: false })
                      );
                    }, 0);
                  }

                  if (props.onChange) {
                    props.onChange(range ? [null, null] : null);
                  }

                  setDateRange(range ? [null, null] : null);
                }}
              >
                <Icon type="Close" size="12" />
              </ButtonBase>
            )
          }
        />
      </>
    );
  });

  /*
    Reason for the `strictParsing` prop set to true
    https://github.com/Hacker0x01/react-datepicker/issues/2051
  */

  return (
    <ReactDatePicker
      {...props}
      ref={inputRef}
      selectsRange={!!range}
      selected={!range && (dateRange as any)}
      startDate={range && dateRange[0]}
      endDate={range && dateRange[1]}
      dateFormat={format || "MM-dd-yyyy"}
      calendarClassName="ui-datepicker"
      dayClassName={() => "ui-datepicker-day"}
      weekDayClassName={() => "ui-datepicker-weekday"}
      popperClassName="ui-datepicker-popper"
      wrapperClassName="ui-datepicker-wrapper"
      strictParsing
      minDate={props.minDate}
      maxDate={props.maxDate}
      onChange={(date: Date | [Date | null, Date | null] | null) => {
        if (inputProps?.onChange) {
          setTimeout(() => {
            inputRef.current?.input?.dispatchEvent(
              new Event("change", { bubbles: false })
            );
          }, 0);
        }
        if (props.onChange) {
          props.onChange(date);
        }
        setDateRange(date);
      }}
      renderCustomHeader={(renderProps: ReactDatePickerCustomHeaderProps) => {
        return (
          <div>
            <div className="ui-flex between v-center">
              <Button
                onClick={renderProps.decreaseMonth}
                disabled={renderProps.prevMonthButtonDisabled}
                size="small"
                variant="ghost"
                muted
                iconOnly
              >
                <Icon type="ArrowLeft" size={16} />
              </Button>
              <Typography size="large">
                {months[renderProps.monthDate.getMonth()]}{" "}
                {renderProps.date.getFullYear()}
              </Typography>
              <Button
                onClick={renderProps.increaseMonth}
                disabled={renderProps.nextMonthButtonDisabled}
                size="small"
                variant="ghost"
                muted
                iconOnly
              >
                <Icon type="ArrowRight" size={16} />
              </Button>
            </div>
            <Divider vertical={10} />
          </div>
        );
      }}
      calendarContainer={(containerProps) => (
        <Card {...containerProps} style={{ borderRadius: 10 }} size="small" />
      )}
      popperModifiers={[{ name: "offset", options: { offset: [0, 20] } }]}
      customInput={<ExtendedCustomInput />}
      onBlur={inputProps?.onBlur}
      renderDayContents={renderDayContents}
    />
  );
};

export { DatePicker, DatePickerProps };
