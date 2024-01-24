import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Icon,
  Typography,
  Link,
  ButtonBase,
  useTranslation,
} from "@butlerhospitality/ui-sdk";
import { VoucherType } from "@butlerhospitality/shared";
import { InputCounter } from "../../../component/input-counter";
import { useOrderContext } from "../store/order-context";
import {
  REMOVE_ITEM,
  REMOVE_OPTION,
  REMOVE_SPECIAL_ITEM,
  UPDATE_CUTLERY_QUANTITY,
  UPDATE_ITEM_QUANTITY,
  UPDATE_SPECIAL_ITEM_QUANTITY,
} from "../store/constants";
import { OrderItem, OrderVoucherItem, StoreItemTypes } from "../../../util/constants";
import VoucherRibbon from "./VoucherRibbon";
import PreFixeOptions from "./PreFixeOptions";
import CustomizeItem from "../customize-item";

import "./index.scss";

interface ItemsTableProps {
  className?: string;
}

const ItemsTable: React.FC<ItemsTableProps> = () => {
  const {
    dispatch,
    state: { items, customItems, vouchers, voucherItems, cutlery },
  } = useOrderContext();
  const { t } = useTranslation();
  const [customizeItem, setCustomizeItem] = React.useState<{
    item: OrderItem | OrderVoucherItem;
    index: number;
    type: StoreItemTypes;
  } | null>(null);

  const handleRemoveItem = (itemIndex: number) => {
    dispatch({ type: REMOVE_ITEM, payload: itemIndex });
  };

  const handleUpdateItemQuantity = (index: number, quantity: number) => {
    if (items[index]) {
      dispatch({
        type: UPDATE_ITEM_QUANTITY,
        payload: {
          index,
          quantity,
        },
      });
    }
  };

  const handleRemoveSpecialItem = (itemId: string) => {
    dispatch({ type: REMOVE_SPECIAL_ITEM, payload: itemId });
  };

  const handleUpdateCustomItemQuantity = (itemId: string, quantity: number) => {
    if (customItems[itemId]) {
      if (quantity === 0) {
        handleRemoveSpecialItem(itemId);
      } else {
        dispatch({
          type: UPDATE_SPECIAL_ITEM_QUANTITY,
          payload: {
            id: itemId,
            quantity,
          },
        });
      }
    }
  };

  const handleCustomizeItem = (item: OrderItem | OrderVoucherItem, index: number, type: StoreItemTypes) => {
    setCustomizeItem({ item, type, index });
  };

  const handleRemoveOption = (itemIndex: number, optionId: number, type: StoreItemTypes) => {
    dispatch({
      type: REMOVE_OPTION,
      payload: {
        type,
        itemIndex,
        optionId,
      },
    });
  };

  const updateCutleryQuantity = (quantity: number) => {
    dispatch({
      type: UPDATE_CUTLERY_QUANTITY,
      payload: quantity,
    });
  };

  return (
    <>
      <Table className="mt-10">
        <TableHead>
          <TableRow>
            <TableCell as="th">Item</TableCell>
            <TableCell style={{ width: 120 }} as="th">
              {t("quantity")}
            </TableCell>
            <TableCell style={{ width: 80 }} as="th">
              {t("price")}
            </TableCell>
            <TableCell style={{ width: 50 }} as="th" />
          </TableRow>
        </TableHead>
        <TableBody>
          {/* voucher */}
          {vouchers.length > 0 &&
            [...vouchers.values()].map((v) => {
              return (
                <React.Fragment key={v.code}>
                  <VoucherRibbon voucher={v} />
                  {v.program.type === VoucherType.PRE_FIXE && <PreFixeOptions voucher={v} />}
                </React.Fragment>
              );
            })}
          {/* items from vouchers */}
          {voucherItems.map((vItem, vItemIndex) => (
            <React.Fragment key={vItemIndex}>
              <TableRow noHover>
                <TableCell colspan={1}>
                  <ButtonBase onClick={() => handleCustomizeItem(vItem, vItemIndex, "voucherItems")}>
                    {vItem.name} ({t("from_voucher")})
                    <Icon type="Pen01" className="ml-5" size={14} />
                  </ButtonBase>
                </TableCell>
                <TableCell>
                  <div className="w-100 text-center">{vItem.quantity}</div>
                </TableCell>
                <TableCell colspan={2} />
              </TableRow>
              {vItem.invalidError && (
                <tr>
                  <td colSpan={4}>
                    <div className="px-10" style={{ marginTop: -10 }}>
                      <Typography className="text-danger" size="small">
                        {t("invalid_item")}
                      </Typography>
                    </div>
                  </td>
                </tr>
              )}
              {vItem.comment && (
                <tr>
                  <td colSpan={4}>
                    <div className="px-10 pb-10">
                      <Typography muted>{vItem.comment}</Typography>
                    </div>
                  </td>
                </tr>
              )}
              {(vItem.options || []).map((option) => (
                <tr className="order-modifier-row" key={option.id}>
                  <td colSpan={2}>
                    {option.name} {vItem.id}
                  </td>
                  <td>${(Number(option.price) * vItem.quantity).toFixed(2)}</td>
                  <td>
                    <div className="ui-flex v-center center">
                      <Button
                        size="xsmall"
                        variant="ghost"
                        onClick={() => handleRemoveOption(vItemIndex, option.id, "voucherItems")}
                        iconOnly
                      >
                        <Icon type="Close" size={20} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {/* items */}
          {items.length || customItems !== {} ? (
            <>
              {items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <TableRow noHover>
                    <TableCell>
                      <ButtonBase onClick={() => handleCustomizeItem(item, itemIndex, "items")}>
                        {item.name}
                        <Icon type="Pen01" className="ml-5" size={14} />
                        {item.priceChangeWarning && (
                          <Typography className="ui-block ml-5" size="small" muted>
                            {t("item_price_changed")} ${item.priceChangeWarning.from.toFixed(2)} {t("to")} $
                            {item.priceChangeWarning.to.toFixed(2)}
                          </Typography>
                        )}
                      </ButtonBase>
                    </TableCell>
                    <TableCell>
                      <InputCounter
                        value={Number(item.quantity)}
                        placeholder="0"
                        type="number"
                        min={1}
                        onChange={(e) => {
                          const number = Number(e.target.value);
                          if (number >= 1) {
                            handleUpdateItemQuantity(itemIndex, Math.abs(number));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>${Number(item.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="small" variant="ghost" onClick={() => handleRemoveItem(itemIndex)} iconOnly>
                        <Icon type="Close" size={20} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {item.invalidError && (
                    <tr>
                      <td colSpan={4}>
                        <div className="px-10" style={{ marginTop: -10 }}>
                          <Typography className="text-danger" size="small">
                            {t("invalid_item")}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  )}
                  {item.comment && (
                    <tr>
                      <td colSpan={4}>
                        <div className="px-10 pb-10">
                          <Typography muted>{item.comment}</Typography>
                        </div>
                      </td>
                    </tr>
                  )}
                  {(item.options || []).map((option) => (
                    <tr className="order-modifier-row" key={option.id}>
                      <td colSpan={2}>{option.name}</td>
                      <td>${(Number(option.price) * item.quantity).toFixed(2)}</td>
                      <td>
                        <div className="ui-flex v-center center">
                          <Button
                            size="xsmall"
                            variant="ghost"
                            onClick={() => handleRemoveOption(itemIndex, option.id, "items")}
                            iconOnly
                          >
                            <Icon type="Close" size={20} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {Object.keys(customItems).map((key: string) => (
                <React.Fragment key={key}>
                  <TableRow noHover key={key}>
                    <TableCell>{customItems[key].name}</TableCell>
                    <TableCell>
                      <InputCounter
                        value={Number(customItems[key].quantity)}
                        placeholder="0"
                        type="number"
                        min={1}
                        onChange={(e) => handleUpdateCustomItemQuantity(key, Math.abs(Number(e.target.value)))}
                      />
                    </TableCell>
                    <TableCell>${Number(customItems[key].total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="small" variant="ghost" onClick={() => handleRemoveSpecialItem(key)} iconOnly>
                        <Icon type="Close" size={20} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {customItems[key].comment && (
                    <tr>
                      <td colSpan={4}>
                        <div className="px-10 pb-10">
                          <Typography muted>{customItems[key].comment}</Typography>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {/* cutlery */}
              <TableRow noHover>
                <TableCell>{t("cutlery")}</TableCell>
                <TableCell>
                  <InputCounter
                    value={cutlery}
                    placeholder="0"
                    type="number"
                    min={1}
                    onChange={(e) => updateCutleryQuantity(Math.abs(Number(e.target.value)))}
                  />
                </TableCell>
                <TableCell />
                <TableCell>
                  <Button
                    size="small"
                    variant="ghost"
                    onClick={() => updateCutleryQuantity(0)}
                    iconOnly
                    disabled={cutlery === 0}
                  >
                    <Icon type="Close" size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <tr>
              <TableCell colspan={4}>
                <div className="w-100 text-center">
                  <Typography>{t("add_products_from_menu_top")}</Typography>
                </div>
              </TableCell>
            </tr>
          )}
        </TableBody>
      </Table>
      {false && (
        <div className="w-100 text-right ui-border-top">
          <Link size="small" component={ButtonBase}>
            {t("clear_all_comments")}
          </Link>
        </div>
      )}
      {customizeItem && (
        <CustomizeItem
          item={customizeItem.item}
          index={customizeItem.index}
          itemType={customizeItem.type}
          onClose={() => setCustomizeItem(null)}
        />
      )}
    </>
  );
};

export { ItemsTable };
