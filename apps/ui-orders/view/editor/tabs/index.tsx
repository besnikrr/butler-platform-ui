import React, { useEffect, useState, useMemo } from "react";
import { Divider, InputSearch, Skeleton, Typography, useTranslation } from "@butlerhospitality/ui-sdk";
import { TabButton } from "../../../component/tab-button";
import { useOrderContext } from "../store/order-context";
import {
  ADD_UPDATE_ITEM,
  ADD_VOUCHER_ITEM,
  CANCEL_VOUCHER_SELECTION,
  SET_ACTIVE_CATEGORY_TAB,
} from "../store/constants";
import AddCustomizedItem from "./AddCustomizedItem";
import { ItemOnMenu, StoreItemTypes } from "../../../util/constants";

import "./index.scss";

interface CustomizeItemProps {
  item: ItemOnMenu;
  type: StoreItemTypes;
}

interface ItemTabsProps {
  loading?: boolean;
  selectedHotel?: boolean;
}

const ItemTabs: React.FC<ItemTabsProps> = ({ loading, selectedHotel }) => {
  const {
    dispatch,
    state: { items, menu, voucherSelection },
  } = useOrderContext();
  const { t } = useTranslation();
  const [activeCategoryTab, setActiveCategoryTab] = useState<string | null>(null);
  const [activeSubCategoryTab, setActiveSubCategoryTab] = useState<string | null>(null);
  const [customizeItem, setCustomizeItem] = React.useState<CustomizeItemProps | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<ItemOnMenu[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<ItemOnMenu[]>([]);

  useEffect(() => {
    if (voucherSelection) {
      setActiveCategoryTab(`${voucherSelection.categories[0].parent_category}`);
      setActiveSubCategoryTab(null);
    }
  }, [voucherSelection]);

  useEffect(() => {
    const menuCategory = menu?.categories?.[activeCategoryTab ?? 0];
    dispatch({
      type: SET_ACTIVE_CATEGORY_TAB,
      payload: {
        tab: menuCategory?.name,
      },
    });
  }, [activeCategoryTab]);

  useEffect(() => {
    const itemsArray: any[] = [];
    Object.values(menu?.categories ?? {}).forEach((category) => {
      Object.values(category.subcategories ?? {}).forEach((subcategory) => {
        Object.values(subcategory.items ?? {}).forEach((item) => {
          itemsArray.push(item);
        });
      });
    });
    setAllMenuItems(itemsArray);
    setActiveCategoryTab(null);
    setActiveSubCategoryTab(null);
  }, [menu]);

  const handleCategoryTabClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setActiveCategoryTab(event.currentTarget.id);
    setActiveSubCategoryTab(null);
  };

  const handleSubCategoryTabClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setActiveSubCategoryTab(event.currentTarget.id);
  };

  const handleAddItem = (item: ItemOnMenu) => {
    if (voucherSelection) {
      if (item.modifiers.length && !items[item.id]) {
        setCustomizeItem({ item, type: "voucherItems" });
      } else {
        setActiveSubCategoryTab(null);
        setActiveCategoryTab(null);
        dispatch({ type: ADD_VOUCHER_ITEM, payload: item });
      }
    } else if (item.modifiers.length) {
      setCustomizeItem({ item, type: "items" });
    } else {
      dispatch({ type: ADD_UPDATE_ITEM, payload: item });
    }
  };

  const handleOptionClose = () => {
    if (voucherSelection) {
      setActiveSubCategoryTab(null);
      setActiveCategoryTab(null);
      dispatch({ type: CANCEL_VOUCHER_SELECTION });
    }
    setCustomizeItem(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    const query = event.target.value.toLowerCase().trim();
    const filteredItemsArray = allMenuItems.filter((item) => item.name.toLowerCase().includes(query));
    setFilteredItems(filteredItemsArray);
  };

  const renderMenu = useMemo(() => {
    if (!menu) {
      if (!selectedHotel) return null;
      return (
        <div className="mb-10">
          <Typography size="small" className="text-danger">
            {t("no_specified_menu_for_hotel")}
          </Typography>
        </div>
      );
    }
    return (
      <>
        <div className="ui-flex v-start orders-app-tab-container">
          {Object.keys(menu.categories || []).map((key: string) => {
            const category = menu.categories[key];
            return (
              <TabButton
                size="xlarge"
                onClick={handleCategoryTabClick}
                id={key}
                key={key}
                active={activeCategoryTab}
                disabled={!!(voucherSelection && `${voucherSelection.categories[0].parent_category}` !== key)}
              >
                {category.name}
              </TabButton>
            );
          })}
        </div>
        {activeCategoryTab && (
          <div className="mt-10 orders-app-tab-container">
            {Object.keys(menu.categories[activeCategoryTab]?.subcategories || []).map((key: string) => {
              const subCategory = menu.categories[activeCategoryTab].subcategories[key];
              return (
                <TabButton
                  key={key}
                  size="medium"
                  onClick={handleSubCategoryTabClick}
                  id={key}
                  active={activeSubCategoryTab}
                  disabled={!!voucherSelection && voucherSelection.categories.findIndex((i) => i.id === +key) === -1}
                >
                  {subCategory.name}
                </TabButton>
              );
            })}
          </div>
        )}
        {activeCategoryTab && activeSubCategoryTab && (
          <div>
            <Divider vertical={10} dashed />
            <Typography className="ui-block">{t("items")}</Typography>
            <div className="my-10 orders-app-tab-container">
              {Object.keys(menu.categories[activeCategoryTab].subcategories[activeSubCategoryTab].items || []).map(
                (key: string) => {
                  const item = menu.categories[activeCategoryTab].subcategories[activeSubCategoryTab].items[key];
                  return (
                    <TabButton
                      key={item.id}
                      size="medium"
                      onClick={() => handleAddItem(item)}
                      id={item.name}
                      outline
                      disabled={
                        !!voucherSelection && (item.price || item.base_price) > parseFloat(voucherSelection.max_price)
                      }
                    >
                      {item.name}
                    </TabButton>
                  );
                }
              )}
              {/* : (
              <Typography size="small" className="ui-block pl-5">
                {t("no_items_found")}
              </Typography>
            )} */}
            </div>
          </div>
        )}
      </>
    );
  }, [selectedHotel, menu, activeCategoryTab, activeSubCategoryTab]);

  if (loading) {
    return (
      <div className="ui-flex orders-tabs-loading">
        <Skeleton parts={["button"]} className="w-100" />
        <Skeleton parts={["button"]} className="w-100 ml-10" />
        <Skeleton parts={["button"]} className="w-100 ml-10" />
      </div>
    );
  }
  return (
    <div className="mb-10">
      {menu && (
        <>
          <InputSearch
            className="ui-transparent w-100"
            placeholder={t("search_for_items")}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <Divider vertical={10} />
        </>
      )}
      {filter.length > 0 && (
        <>
          <Typography size="small" muted>
            {t("search_results")}:
          </Typography>
          <div className="orders-app-search-container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TabButton
                  key={`${item.id}-${item.category.id}`}
                  size="medium"
                  onClick={() => handleAddItem(item)}
                  id={`${item.id}-${item.category.id}`}
                  outline
                  // TODO: bjorn to check if this items' category is inside the operating hours
                  // and add to the existring check
                  disabled={
                    !!voucherSelection &&
                    (voucherSelection.categories.findIndex((i) => i.id === item.category.id) === -1 ||
                      (item.price || item.base_price) > parseFloat(voucherSelection.max_price))
                  }
                >
                  {item.name}
                  <Typography className="ui-block ml-5" muted>{`- ${item.category.name}`}</Typography>
                </TabButton>
              ))
            ) : (
              <Typography size="small" className="ui-block py-10 mb-20 pl-5">
                {t("no_items_found")}
              </Typography>
            )}
          </div>
          <Divider vertical={10} />
        </>
      )}
      {renderMenu}
      {customizeItem && (
        <AddCustomizedItem item={customizeItem.item} type={customizeItem.type} onClose={handleOptionClose} />
      )}
    </div>
  );
};

export { ItemTabs };
