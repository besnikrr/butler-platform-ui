export interface ProgramGeneralInformationProp {
  program: any;
  modal?: boolean | undefined;
  setModal?: (val: boolean) => void | undefined;
  onChange?: (program?: any) => void;
  submitTxt?: string;
  isDeleteAction?: boolean;
  reloadData?: (data: string) => void;
}
