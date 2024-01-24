import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Collapsible, ButtonBase, Icon, Typography, Grid, Row, Column, Link, Divider, Table, TableHead, TableRow, TableCell, TableBody, ActionButton, Image, Modal, Button, Chip, Input, useTranslation } from '@butlerhospitality/ui-sdk';
import EditItemForm from './edit-item-form';
import SortableSubcategoryList from './sortable-subcategory-list';

interface CategoryCollapsibleProps {
  className?: string;
  categoryId: string;
  updateItems: any;
  removeItem?: any;
  addItem?: any;
  menuState?: any;
  reorderSubcategory?: any;
  itemEdit?: boolean
}

const CategoryCollapsible: React.FC<CategoryCollapsibleProps> = ({
  className,
  categoryId,
  updateItems,
  removeItem,
  addItem,
  reorderSubcategory,
  menuState,
  itemEdit
}) => {
  const { t } = useTranslation();

  const [addedItems, setAddedItems] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [itemEditing, setItemEditing] = useState<any | null>(null);
  const [itemsToSelect, setItemsToSelect] = useState<any[]>([]);
  const [categorySubcategories, setCategorySubcategories] = useState<any>({});
  const [sortedSubcategories, setSortedSubcategories] = useState<string[]>([]);

  useEffect(() => {
    const sorted = Object.keys(menuState.categories[categoryId].subcategories).sort((a, b) => {
      return menuState.categories[categoryId].subcategories[a].sort_order - menuState.categories[categoryId].subcategories[b].sort_order;
    });
    setActiveTab(sorted[0]);
  }, []);

  useEffect(() => {
    const sorted = Object.keys(menuState.categories[categoryId].subcategories).sort((a, b) => {
      return menuState.categories[categoryId].subcategories[a].sort_order - menuState.categories[categoryId].subcategories[b].sort_order;
    });
    setCategorySubcategories(menuState.categories[categoryId]?.subcategories || {});
    setSortedSubcategories(sorted);
  }, [categoryId, menuState]);

  useEffect(() => {
    if (!activeTab) return;
    setItemsToSelect(menuState.categories[categoryId]?.subcategories[activeTab]?.items || []);
    setAddedItems(
      menuState.addedItems[categoryId]?.subcategories[activeTab]?.items || {}
    );
  }, [activeTab, menuState.addedItems]);

  const onTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const dataId = event.currentTarget.getAttribute('data-id');
    if (dataId) {
      setActiveTab(dataId);
    }
  }

  const removeItemEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    const itemId = e.currentTarget.getAttribute('data-id');
    if (!itemId || !activeTab) return;
    removeItem({
      ...addedItems[itemId],
      subcategory: activeTab,
      category: categoryId
    });
  };

  const editItem = (item: any) => {
    setItemEditing(item);
  }

  const onEditItem = (data: any) => {
    updateItems(data);
    setItemEditing(null);
  }

  const onSubcategoryReorder = (data: any) => {
    reorderSubcategory({
      category: categoryId,
      subcategories: data
    });
  }

  return (
    <Collapsible title={menuState.categories[categoryId].name} className={className} open>
      <div className='ui-flex'>
        <SortableSubcategoryList onReorder={onSubcategoryReorder} sortedSubcategoriesInput={sortedSubcategories} onTabClick={onTabClick} activeTab={activeTab || ''} subcategories={categorySubcategories} />
        <div className='p-20 w-100'>
          {
            activeTab &&
            <>
              <Typography h2>{menuState.categories[categoryId].subcategories[activeTab]?.name}</Typography>
              <Typography size='large' className='ui-flex mt-30 mb-20'>{t('added_items')}</Typography>
              <Grid gutter={0}>
                <Row colsLg={2} colsXl={3} colsXxl={4} gutter={5}>
                  {
                    (Object.keys(addedItems) || []).length > 0 ?
                      Object.keys(addedItems).map((itemKey: string) => {
                        const item = addedItems[itemKey];
                        const hasNewPrice = item.price && item.price !== item.base_price;
                        return (
                          <Column key={item.id}>
                            <div className='ui-rounded p-10 ui-flex w-100 ui-border'>
                              <Image alt={item.name} src={`${item?.image_base_url}/image/400x400/${item.image}`} width={57} height={57} className='menu-item-card-image ui-rounded mr-10' />
                              <div className='menu-item-card-content w-100 ui-flex between column'>
                                <div className="menu-item-card-header ui-flex between v-start">
                                  <Typography size='large'>{item.name}</Typography>
                                  <ButtonBase data-id={item.id} onClick={removeItemEvent}>
                                    <Icon type='Close' size={20} />
                                  </ButtonBase>
                                </div>
                                <div className='menu-item-card-body'>
                                  <Typography className={classNames('mt-10 pr-5', { 'ui-text-line': hasNewPrice })} muted={hasNewPrice}>${Number(item.base_price).toFixed(2)}</Typography>
                                  {
                                    hasNewPrice &&
                                    <Typography className='mt-10'>${Number(item.price)?.toFixed(2)}</Typography>
                                  }
                                </div>
                                <div className="menu-item-card-footer ui-flex between w-100 v-end">
                                  {itemEdit && <Typography muted>{item.suggested_items?.length ? item.suggested_items?.length : t('no')} {t('sugessted_items')}</Typography>}
                                  {itemEdit && <Link component={ButtonBase} onClick={() => editItem(item)} size='medium'>{t('edit')}</Link>}
                                </div>
                              </div>
                            </div>
                          </Column>
                        )
                      })
                      :
                      <Typography muted>{t('no_items_added')}</Typography>
                  }
                </Row>
              </Grid>
              <Divider vertical={30} />
              <Typography size='large' className='ui-flex mb-30'>{t('add_items')}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell as='th' style={{ width: 50 }}></TableCell>
                    <TableCell as='th' style={{ width: 60 }}></TableCell>
                    <TableCell as='th' style={{ width: 250 }}>{t('item_name')}</TableCell>
                    <TableCell as='th'>{t('price')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    Object.keys(addedItems).length !== itemsToSelect.length ?
                      itemsToSelect.map((item: any) => {
                        if (addedItems[item.id]) return null;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <ActionButton onClick={() => addItem({ ...item, price: null, base_price: item.price, subcategory: activeTab, subcategory_name: menuState.categories[categoryId].subcategories[activeTab].name, category: categoryId })}>
                                <Icon type='Plus' size={20} />
                              </ActionButton>
                            </TableCell>
                            <TableCell>
                              <Image alt={item.name} src={`${item?.image_base_url}/image/400x400/${item.image}`} width={35} height={35} />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>${Number(item.price)?.toFixed(2)}</TableCell>
                          </TableRow>
                        )
                      })
                      :
                      <tr>
                        <td style={{ height: 45 }} colSpan={4} className='text-center py-10'>
                          <Typography muted>{t('no_more_items_to_add')}</Typography>
                        </td>
                      </tr>
                  }
                </TableBody>
              </Table>
            </>
          }
        </div>
      </div>
      <Modal
        visible={itemEditing}
        onClose={() => setItemEditing(null)}
        style={{ width: 500 }}
      >
        {itemEditing &&
          <EditItemForm itemEditing={itemEditing} menuState={menuState} categoryId={categoryId} activeTab={activeTab} close={() => setItemEditing(null)} onSave={onEditItem} />
        }
      </Modal>
    </Collapsible>
  );
}

export { CategoryCollapsible };
