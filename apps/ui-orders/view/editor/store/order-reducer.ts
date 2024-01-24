import { Code, Discount, ModifierOption, Rule, VoucherType } from "@butlerhospitality/shared";
import { pushNotification } from "@butlerhospitality/ui-sdk";
import _ from "lodash";
import { OrderItem, CustomItem, OrderVoucherItem, FormattedMenu, StoreItemTypes } from "../../../util/constants";
import {
  ADD_UPDATE_ITEM,
  ADD_UPDATE_SPECIAL_ITEM,
  ADD_VOUCHER_ITEM,
  ADD_VOUCHER,
  CLEAR_VOUCHER_SELECTION,
  REMOVE_ITEM,
  REMOVE_SPECIAL_ITEM,
  REMOVE_VOUCHER,
  SET_VOUCHER_SELECTION,
  UPDATE_ITEM,
  UPDATE_ITEM_QUANTITY,
  UPDATE_SPECIAL_ITEM_QUANTITY,
  SET_MENU,
  CUSTOMIZE_ITEM,
  ADD_CUSTOMIZED_ITEM,
  REMOVE_OPTION,
  ADD_CUSTOMIZED_VOUCHER_ITEM,
  CANCEL_VOUCHER_SELECTION,
  SET_COMPENSATION,
  SET_TIP,
  REMOVE_TIP,
  UPDATE_CUTLERY_QUANTITY,
  SET_EDIT_ORDER_DATA,
  SET_ACTIVE_CATEGORY_TAB,
  SET_DISCOUNT,
} from "./constants";

const mutateArray = (array: any[], index: number, value: any) => {
  return array.splice(index, 1, value);
};

const removeItemFromArray = (array: any[], index: number) => {
  return array.splice(index, 1);
};

const isArrayEqual = (x: any[], y: any[]) => {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};

interface VoucherSelectionRule extends Rule {
  voucherId: number;
  code: string;
}

export type CreateOrderContextInterface = {
  items: OrderItem[];
  customItems: {
    [key: string]: CustomItem;
  };
  vouchers: Code[];
  voucherSelection: VoucherSelectionRule | null;
  voucherItems: OrderVoucherItem[];
  menu: FormattedMenu | null;
  compensation: any;
  tip: any;
  cutlery: number;
  activeCategoryTab: string | null;
  discount: Discount | null;
};

function reducer(state: CreateOrderContextInterface, action: any): CreateOrderContextInterface {
  switch (action.type) {
    case UPDATE_ITEM: {
      return {
        ...state,
        items: { ...state.items, [action.payload.id]: action.payload },
      };
    }
    case REMOVE_ITEM: {
      const itemIndex = action.payload;
      const itemsArray = [...state.items];
      if (state.items[itemIndex]) {
        removeItemFromArray(itemsArray, itemIndex);
      }
      return {
        ...state,
        items: itemsArray,
      };
    }
    case ADD_UPDATE_ITEM: {
      const itemId = action.payload.id;
      let data = {};
      const itemsArray = [...state.items];

      const itemIndex = state.items.findIndex((i) => i.id === itemId && !i.comment);

      if (itemIndex > -1) {
        data = {
          ...action.payload,
          ...state.items[itemIndex],
          quantity: state.items[itemIndex].quantity + 1,
          total: Number(state.items[itemIndex].price * (state.items[itemIndex].quantity + 1)),
        };
        mutateArray(itemsArray, itemIndex, data);
      } else {
        data = {
          ...action.payload,
          price: action.payload.price || action.payload.base_price,
          quantity: 1,
          total: action.payload.price || action.payload.base_price,
        };
        itemsArray.push(data as OrderItem);
      }
      return {
        ...state,
        items: itemsArray,
      };
    }
    case UPDATE_ITEM_QUANTITY: {
      const itemIndex = action.payload.index;
      const item = state.items[itemIndex];
      if (!item) return state;
      const itemsArray = [...state.items];
      mutateArray(itemsArray, itemIndex, {
        ...item,
        total: item.price * action.payload.quantity,
        quantity: action.payload.quantity,
      });
      return {
        ...state,
        items: itemsArray,
      };
    }
    case ADD_UPDATE_SPECIAL_ITEM: {
      const itemId = action.payload.id;
      const item = state.customItems[itemId];
      let data = {} as OrderItem;
      if (item) {
        data.quantity = item.quantity + 1;
        data.total = Number(item.price * data.quantity);
      } else {
        data = {
          ...action.payload,
          quantity: 1,
          total: Number(action.payload.price),
        };
      }
      return {
        ...state,
        customItems: {
          ...state.customItems,
          [itemId]: {
            ...item,
            ...data,
          },
        },
      };
    }
    case UPDATE_SPECIAL_ITEM_QUANTITY: {
      const itemId = action.payload.id;
      const item = state.customItems[itemId];
      return {
        ...state,
        customItems: {
          ...state.customItems,
          [itemId]: {
            ...item,
            total: item.price * action.payload.quantity,
            quantity: action.payload.quantity,
          },
        },
      };
    }
    case REMOVE_SPECIAL_ITEM: {
      const itemId = action.payload;
      const customItems: any = {};
      Object.assign(customItems, state.customItems);
      const mutatableState = { ...state };
      if (customItems[itemId]) {
        delete customItems[itemId];
      }
      return {
        ...mutatableState,
        customItems,
      };
    }
    case ADD_VOUCHER: {
      if (action.payload.program.type === VoucherType.PRE_FIXE) {
        if (state.vouchers.length) {
          return {
            ...state,
            vouchers: [...state.vouchers, action.payload],
          };
        }
      }
      return {
        ...state,
        vouchers: [action.payload],
      };
    }
    case REMOVE_VOUCHER: {
      const vouchers = state.vouchers.filter((v) => v.id !== action.payload);
      const voucherItems: OrderVoucherItem[] = [];
      Object.assign(voucherItems, state.voucherItems);
      const itemsIdsToBeRemoved: number[] = [];
      state.voucherItems.forEach((item, index: number) => {
        if (item.codeId === action.payload) {
          itemsIdsToBeRemoved.push(index);
        }
      });
      // sort in descending order to avoid index change
      itemsIdsToBeRemoved.sort((a: number, b: number) => b - a);
      itemsIdsToBeRemoved.forEach((index: number) => {
        removeItemFromArray(voucherItems, index);
      });
      return {
        ...state,
        vouchers,
        voucherSelection: null,
        voucherItems,
      };
    }
    case SET_VOUCHER_SELECTION: {
      return {
        ...state,
        voucherSelection: action.payload,
      };
    }
    case ADD_VOUCHER_ITEM: {
      if (!state.voucherSelection) return state;
      const { id, voucherId, code } = state.voucherSelection;
      const itemId = action.payload.id;
      let data = {} as OrderVoucherItem;
      const itemsArray = [...state.voucherItems];
      const itemIndex = state.voucherItems.findIndex(
        (i) => i.id === itemId && !i.comment && i.codeId === voucherId && i.ruleId === id && i.code === code
      );

      if (itemIndex > -1) {
        data = {
          ...state.voucherItems[itemIndex],
          quantity: state.voucherItems[itemIndex].quantity + 1,
        };
        mutateArray(itemsArray, itemIndex, data);
      } else {
        data = {
          ...action.payload,
          quantity: 1,
          price: action.payload.price || action.payload.base_price,
          ruleId: id,
          codeId: voucherId,
          code,
        };
        itemsArray.push(data);
      }
      return {
        ...state,
        voucherItems: itemsArray,
        voucherSelection: null,
      };
    }
    case CLEAR_VOUCHER_SELECTION: {
      const updatedVoucherItems: OrderVoucherItem[] = [];
      const { id, voucherId, code } = action.payload;
      Object.assign(updatedVoucherItems, state.voucherItems);
      const itemsIdsToBeRemoved: number[] = [];
      state.voucherItems.forEach((item, index: number) => {
        if (item.codeId === voucherId && item.ruleId === id && item.code === code) {
          itemsIdsToBeRemoved.push(index);
        }
      });
      // sort in descending order to avoid index change
      itemsIdsToBeRemoved.sort((a: number, b: number) => b - a);
      itemsIdsToBeRemoved.forEach((index: number) => {
        removeItemFromArray(updatedVoucherItems, index);
      });
      return {
        ...state,
        voucherSelection: null,
        voucherItems: updatedVoucherItems,
      };
    }
    case CANCEL_VOUCHER_SELECTION: {
      return {
        ...state,
        voucherSelection: null,
      };
    }
    case SET_MENU: {
      // old menu - state.menu
      // new menu - action.payload
      // addded Items - state.items
      // added Voucher Items - state.voucherItems
      const stateItems = [...state.items];
      const stateVoucherItems = [...state.voucherItems];
      if (state.menu) {
        if (stateItems.length > 0) {
          stateItems.forEach((item, index) => {
            if (!item.category.parent_category_id) {
              mutateArray(stateItems, index, {
                ...item,
                invalidError: true,
              });
            } else {
              const foundItem =
                action.payload?.categories[item.category.parent_category_id]?.subcategories[item.category.id]?.items[
                  item.id
                ];
              if (foundItem) {
                if ((foundItem.price || foundItem.base_price) !== item.price) {
                  mutateArray(stateItems, index, {
                    ...item,
                    price: foundItem.price || foundItem.base_price,
                    total: (foundItem.price || foundItem.base_price) * item.quantity,
                    priceChangeWarning: {
                      from: item.price,
                      to: foundItem.price || foundItem.base_price,
                    },
                  });
                }
              } else {
                mutateArray(stateItems, index, {
                  ...item,
                  invalidError: true,
                });
              }
            }
          });
        }
        if (stateVoucherItems.length > 0) {
          stateVoucherItems.forEach((item, index) => {
            if (!item.category.parent_category_id) {
              mutateArray(stateVoucherItems, index, {
                ...item,
                invalidError: true,
              });
            } else {
              const foundItem =
                action.payload?.categories[item.category.parent_category_id]?.subcategories[item.category.id]?.items[
                  item.id
                ];
              if (!foundItem) {
                mutateArray(stateVoucherItems, index, {
                  ...item,
                  invalidError: true,
                });
              }
            }
          });
        }
      }
      return {
        ...state,
        activeCategoryTab: null,
        menu: action.payload,
        items: stateItems,
        voucherItems: stateVoucherItems,
      };
    }
    case CUSTOMIZE_ITEM: {
      const { index, comment, options, type } = action.payload as {
        index: number;
        comment: string;
        options: ModifierOption[];
        type: StoreItemTypes;
      };
      const itemsArray = [...state[type]];
      let duplicateIndex = -1;
      const item = state[type][index];
      if (type === "voucherItems") {
        duplicateIndex = state.voucherItems.findIndex(
          (i, indexNumber: number) =>
            indexNumber !== index &&
            i.id === state.voucherItems[index].id &&
            i.comment === comment &&
            i.codeId === state.voucherItems[index].codeId &&
            i.ruleId === state.voucherItems[index].ruleId &&
            i.code === state.voucherItems[index].code &&
            i.options &&
            isArrayEqual(i.options, options)
        );
      } else {
        duplicateIndex = state.items.findIndex(
          (i, indexNumber: number) => indexNumber !== index && i.id === state.items[index].id && i.comment === comment
        );
      }
      if (duplicateIndex > -1) {
        mutateArray(itemsArray, duplicateIndex, {
          ...state[type][duplicateIndex],
          quantity: state[type][duplicateIndex].quantity + item.quantity,
          total: state[type][duplicateIndex].total + item.total,
        });
        removeItemFromArray(itemsArray, index);
        pushNotification("Quantity of this item has changed", {
          type: "info",
        });
        return {
          ...state,
          [type]: itemsArray,
        };
      }
      mutateArray(itemsArray, index, { ...item, comment, options });
      return {
        ...state,
        [type]: itemsArray,
      };
    }
    case ADD_CUSTOMIZED_ITEM: {
      const { item } = action.payload;
      const itemPrice = item.price || item.base_price;
      const itemsArray = [...state.items];

      const foundItemIndex = state.items.findIndex((i) => {
        return i.id === item.id && i.comment === item.comment && i.options && isArrayEqual(i.options, item.options);
      });
      if (foundItemIndex > -1) {
        mutateArray(itemsArray, foundItemIndex, {
          ...item,
          ...state.items[foundItemIndex],
          quantity: state.items[foundItemIndex].quantity + 1,
          total: Number(itemPrice) * (state.items[foundItemIndex].quantity + 1),
        });
        return {
          ...state,
          items: itemsArray,
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...item,
            quantity: 1,
            price: itemPrice,
            total: Number(itemPrice),
          },
        ],
      };
    }
    case ADD_CUSTOMIZED_VOUCHER_ITEM: {
      if (!state.voucherSelection) return state;
      const { id, voucherId, code } = state.voucherSelection;
      const { item } = action.payload;
      const itemsArray = [...state.voucherItems];

      const foundItemIndex = state.voucherItems.findIndex((i) => {
        return (
          i.id === item.id &&
          i.ruleId === id &&
          i.codeId === voucherId &&
          i.code === code &&
          i.comment === item.comment &&
          i.options &&
          isArrayEqual(i.options, item.options)
        );
      });
      if (foundItemIndex > -1) {
        mutateArray(itemsArray, foundItemIndex, {
          ...item,
          ...state.voucherItems[foundItemIndex],
          quantity: state.voucherItems[foundItemIndex].quantity + 1,
        });
        return {
          ...state,
          voucherItems: itemsArray,
        };
      }
      return {
        ...state,
        voucherItems: [
          ...state.voucherItems,
          {
            ...item,
            quantity: 1,
            price: action.payload.item.price || action.payload.item.base_price,
            ruleId: id,
            codeId: voucherId,
            code,
          },
        ],
      };
    }
    case REMOVE_OPTION: {
      const { itemIndex, optionId, type } = action.payload as {
        itemIndex: number;
        optionId: number;
        type: StoreItemTypes;
      };
      const item = state[type][itemIndex];
      const options = item.options.filter((option) => option.id !== optionId);
      const itemsArray = [...state[type]];
      mutateArray(itemsArray, itemIndex, {
        ...item,
        options,
      });
      return {
        ...state,
        [type]: itemsArray,
      };
    }
    case SET_COMPENSATION: {
      const { compensation } = action.payload;
      return {
        ...state,
        compensation,
      };
    }
    case SET_TIP: {
      const { tip } = action.payload;
      return {
        ...state,
        tip,
      };
    }
    case REMOVE_TIP: {
      return {
        ...state,
        tip: null,
      };
    }
    case UPDATE_CUTLERY_QUANTITY: {
      return {
        ...state,
        cutlery: action.payload,
      };
    }
    case SET_EDIT_ORDER_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_ACTIVE_CATEGORY_TAB: {
      return {
        ...state,
        activeCategoryTab: action.payload.tab,
      };
    }
    case SET_DISCOUNT: {
      return {
        ...state,
        discount: action.payload.discount,
      };
    }
    default:
      throw new Error();
  }
}

export default reducer;
