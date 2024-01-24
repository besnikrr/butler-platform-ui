import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react";
import parsePhoneNumberFromString, { CountryCode, PhoneNumber } from "libphonenumber-js";
import { Input, InputProps, useForkRef } from "@butlerhospitality/ui-sdk";
import { PhoneCountryType } from "./PhoneNumberInput.types";
import { countriesJSON } from "./countries";

const countries = countriesJSON as PhoneCountryType[];
const USCountryIndex = 218;

export interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  countryCode?: CountryCode;
  placeholder?: string;
  inputProps: InputProps;
  error?: string;
}

const PhoneNumberInput = forwardRef(
  ({ error, placeholder, inputProps }: PhoneNumberInputProps, ref: Ref<{ validate: () => boolean }>) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    // @ts-ignore
    const forkedRef = useForkRef(inputRef, inputProps.ref);
    const [selected, setSelected] = useState(countries[USCountryIndex]);
    // @ts-ignore
    const nativeInputValueSetter: any = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

    function validate() {
      if (inputRef.current) {
        return !!parsePhoneNumberFromString(inputRef.current?.value, selected.key as CountryCode)?.isValid?.();
      }
      return false;
    }

    useImperativeHandle(ref, () => ({
      validate,
    }));

    useEffect(() => {
      if (inputRef.current?.value) {
        const result = parsePhoneNumberFromString(inputRef.current?.value);
        const formattedNumber = result?.formatInternational() || inputRef.current?.value;
        nativeInputValueSetter.call(inputRef.current, formattedNumber);
        if (result && result.nationalNumber) {
          setSelected(countries.find((country) => country.key === result.country) || selected);
        }
      }
    }, [inputRef.current?.value]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const result: PhoneNumber | undefined = parsePhoneNumberFromString(e.target.value, selected.key as CountryCode);

      const formattedNumber = result?.formatInternational() || e.target.value;
      nativeInputValueSetter.call(inputRef.current, formattedNumber);
      if (result && result?.country !== selected.key) {
        setSelected(countries.find((country) => country.key === result?.country) || selected);
      }
      inputProps.onChange?.(e);
    };

    return (
      <Input
        placeholder={placeholder}
        prefixNode={selected?.flag}
        className="w-100"
        {...inputProps}
        ref={forkedRef}
        onChange={onInputChange}
        error={inputProps.error || error}
      />
    );
  }
);

export default PhoneNumberInput;
