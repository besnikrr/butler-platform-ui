import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import parsePhoneNumberFromString, {
  CountryCode,
  PhoneNumber,
  NumberFormat,
} from "libphonenumber-js";
import { Input, Select, Option } from "@butlerhospitality/ui-sdk";
import {
  PhoneCountryType,
  PhoneNumberInputType,
} from "./PhoneNumberInput.types";
import { countriesJSON } from "./countries";

const countries = countriesJSON as PhoneCountryType[];
const USCountryIndex = 218;

const PhoneNumberInput = forwardRef(
  (
    {
      initialValue,
      onBlur,
      error,
      onChange,
      rounded,
      ...props
    }: PhoneNumberInputType,
    ref: Ref<{ inputValue: string; validate: () => boolean; reset: () => void }>
  ) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selected, setSelected] = useState(countries[USCountryIndex]);
    const [filteredCountries, setFilteredCountries] = useState(countries);

    const wrapperRef = useRef(null);

    function validate() {
      return !!parsePhoneNumberFromString(
        phoneNumber,
        selected.key as CountryCode
      )?.isValid?.();
    }

    function reset() {
      setSelected(countries[USCountryIndex]);
      setPhoneNumber("");
    }

    useImperativeHandle(ref, () => ({
      validate,
      inputValue: phoneNumber,
      reset,
    }));

    useEffect(() => {
      if (initialValue) {
        const result = parsePhoneNumberFromString(initialValue);
        if (result && result.nationalNumber) {
          setPhoneNumber(result.nationalNumber as string);
          setSelected(
            countries.find((country) => country.key === result.country) ||
              selected
          );
        }
      }
    }, [initialValue]);

    const selectCountry = (country: PhoneCountryType) => {
      setSelected(country);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let result: PhoneNumber | undefined;

      if (phoneNumber?.[0] === "+") {
        result = parsePhoneNumberFromString(e.target.value);
      } else {
        result = parsePhoneNumberFromString(
          e.target.value,
          selected.key as CountryCode
        );
      }

      let formatMode: NumberFormat = "INTERNATIONAL";
      if (!result || !e.target.value || e.target.value[0] !== "+") {
        formatMode = "NATIONAL";
      }

      const formattedNumber = result?.format?.(formatMode) || e.target.value;
      setPhoneNumber(formattedNumber);
      if (result && result?.country !== selected.key) {
        setSelected(
          countries.find((country) => country.key === result?.country) ||
            selected
        );
      }
      onChange && onChange((result?.number as string) || e.target.value);
    };

    const renderCountryCodes = (): any => {
      return filteredCountries.map((country) => (
        <Option
          key={country.key}
          value={country.value}
          selected={country?.value === selected.value}
        >
          {`${country.flag} ${country.value.replace(/[A-Z]+-/, "")}`}
        </Option>
      ));
    };

    return (
      <div className="ui-flex v-center" ref={wrapperRef}>
        <Select
          style={{ width: "120px" }}
          value={selected?.value}
          selectProps={{
            onChange: (e: any) => {
              setPhoneNumber("");
              const selectedCountry: any = countries.find(
                (country) => country.value === e.target.value
              );
              selectCountry(selectedCountry);
            },
          }}
        >
          <Option value="" hidden />
          {renderCountryCodes()}
        </Select>
        <Input
          placeholder={props.placeholder}
          className="w-100 ml-10"
          value={phoneNumber}
          onChange={onInputChange}
          ref={ref as any}
          error={error}
        />
      </div>
    );
  }
);

export default PhoneNumberInput;
