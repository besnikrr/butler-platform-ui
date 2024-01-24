import { BaseItemInterface } from "./shared-items";
import { BaseEntity, BaseFilter } from "../base";

interface ItemList extends BaseEntity, BaseItemInterface {
  id?: string;
  item_id: string;
}

interface ItemFilter extends BaseFilter {
  name: string;
}

export { ItemList, ItemFilter };
