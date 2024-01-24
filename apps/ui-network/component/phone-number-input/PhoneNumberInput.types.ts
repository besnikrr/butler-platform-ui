export interface PhoneNumberInputType {
  initialValue?: string;
  disabled?: boolean;
  outline?: boolean;
  placeholder?: string;
  error?: string;
  name?: string;
  className?: string;
  onChange?: (phoneNumber: string) => void;
  onBlur?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  rounded?: boolean;
}

export interface PhoneCountryType {
  key: string;
  value: any;
  flag: string;
  content: string;
}
