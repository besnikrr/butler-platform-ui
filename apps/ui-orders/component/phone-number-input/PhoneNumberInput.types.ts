import { InputBaseProps } from "@butlerhospitality/ui-sdk";

export interface PhoneNumberInputType {
  initialValue?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  inputProps?: InputBaseProps;
}

export interface PhoneCountryType {
  key: string;
  value: any;
  flag: string;
  content: string;
}
