import { HubV2 } from "@butlerhospitality/shared";

export interface HubGeneralInformationProp {
  hub: HubV2 | undefined;
  modal?: boolean | undefined;
  setModal?: (val: boolean) => void | undefined;
  onChange?: (hub?: HubV2) => void;
  submitTxt?: string;
  isDeleteAction?: boolean;
  reloadData?: (data: string) => void;
}
