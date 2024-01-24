import { HotelDetails } from "@butlerhospitality/shared";

export interface HotelGeneralInformationProp {
  hotel: HotelDetails | undefined;
  onChange?: (hotel?: HotelDetails) => void;
}

export interface StatusAlertProp {
  visible: boolean;
  title: string;
  onClose: (value: boolean) => void;
  description: string;
  ctaLabel: string;
  onSuccess: () => void;
}
