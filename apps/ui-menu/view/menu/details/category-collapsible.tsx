import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Collapsible, ButtonBase, Typography, Grid, Row, Column, Image, useTranslation, Badge } from '@butlerhospitality/ui-sdk';

interface CategoryCollapsibleProps {
  className?: string;
  category: any;
}

const CategoryCollapsible: React.FC<CategoryCollapsibleProps> = ({ className, category }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [sortedSubcategories, setSortedSubcategories] = useState<string[]>([]);

  const onTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const dataId = event.currentTarget.getAttribute('data-id');
    if (dataId) {
      setActiveTab(dataId);
    }
  }

  const onToggleCategory = (open: boolean) => {
    const firstTab = Object.keys(category.subcategories)[0];
    setActiveTab(open ? activeTab : firstTab);
  }

  useEffect(() => {
    console.log(category);
    
    const sorted = Object.keys(category.subcategories).sort((a, b) => {
      return category.subcategories[a].sort_order - category.subcategories[b].sort_order;
    });
    setSortedSubcategories(sorted);
    setActiveTab(sorted[0]);
  }, [])

  return (
    <Collapsible title={category.name} className={className} onToggle={onToggleCategory} open>
      <div className='ui-flex'>
        <div className='menu-ordered-list ui-border-right p-10'>
          {
            sortedSubcategories.map((subKey: string) => {
              const subCategory = category.subcategories[subKey];
              return (
                <ButtonBase
                  className={classNames('ui-flex w-100 px-20 menu-sub-order-item ui-rounded', { 'active': activeTab === subKey })}
                  data-id={subKey}
                  onClick={onTabClick}
                  key={subKey}
                >
                  {subCategory.name}
                </ButtonBase>
              )
            })
          }
        </div>
        <div className='p-20 w-100'>
          {
            activeTab &&
            <Grid gutter={0}>
              <Row colsLg={2} colsXl={3} colsXxl={4} gutter={5}>
                {
                  (Object.keys(category.subcategories[activeTab].items) || []).length > 0 ?
                    (Object.keys(category.subcategories[activeTab].items) || []).map((itemKey) => {
                      const item = category.subcategories[activeTab].items[itemKey];
                      const hasNewPrice = item.price && item.price !== item.base_price;
                      return (
                        <Column key={item.id}>
                          <div className='ui-rounded p-10 ui-flex w-100 ui-border'>
                            <Image alt={item.name} src={`${item?.image_base_url}/image/400x400/${item.image}`} width={57} height={57} className={classNames('menu-item-card-image ui-rounded mr-10', {
                              'item-86-opacity': item.item86
                            })} />
                            <div className='menu-item-card-content w-100'>
                              <div className="menu-item-card-header ui-flex between v-start">
                                <Typography size='large' muted={item.item86} className='ui-flex mb-5'>{item.name}</Typography>
                                {item.item86 && 
                                  <Badge size="small" className='menu-inactive-badge item86-badge' >
                                    {t('item_86')}
                                </Badge>}
                              </div>
                              <div className='menu-item-card-body'>
                                <Typography className={classNames('mt-10 pr-5', { 'ui-text-line': hasNewPrice })} muted={hasNewPrice}>${Number(item.base_price).toFixed(2)}</Typography>
                                {
                                  hasNewPrice &&
                                  <Typography muted={item.item86}>${Number(item.price)?.toFixed(2)}</Typography>
                                }
                              </div>
                              <div className="menu-item-card-footer ui-flex between w-100 v-end">
                                <Typography size='small' muted={item.item86}>{item.suggested_items?.length ? item.suggested_items?.length : t('no')} {t('sugessted_items')}</Typography>
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
          }
        </div>
      </div>
    </Collapsible>
  );
}

export { CategoryCollapsible };
