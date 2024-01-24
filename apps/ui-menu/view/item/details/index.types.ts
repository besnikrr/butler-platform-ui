import { Item } from "@butlerhospitality/shared";

export interface ItemActionsProp {
  item: Item | undefined;
  onChange?: (item?: Item) => void;
}
