import React, {useEffect, useState} from 'react';
import { CategoryOnMenu, MULTIPLY_OPTION, priceMultiplierValidator, SubcategoryOnMenu } from '@butlerhospitality/shared';
import { useForm } from 'react-hook-form';

import {
  Button,
  Checkbox,
  Column,
  Divider,
  Grid,
  Input,
  Option,
  Row,
  Select,
  Typography,
  useTranslation
} from '@butlerhospitality/ui-sdk';
import { yupResolver } from '@hookform/resolvers/yup';

interface ItemPriceMultiply {
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
  item: {
    id: string;
    name: string;
    price: number;
  };
}

interface CategoryPriceMultiply {
  id: string;
  name: string;
}

const PriceMultiplier = ({ menuState, closeModal }: any): JSX.Element => {
  const { t } = useTranslation();
  const [allItems, setAllItems] = useState<ItemPriceMultiply[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemPriceMultiply[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryPriceMultiply[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors}
  } = useForm<any>({
    resolver: yupResolver(priceMultiplierValidator),
    defaultValues: {}
  });

  useEffect(() => {
    const setItemsAndCategories = () => {
      const itemsToSet: ItemPriceMultiply[] = [];
      const categoriesToSet: CategoryPriceMultiply[] = [];

      if (menuState.addedItems) {
        Object.keys(menuState.addedItems).forEach(categoryId => {
          const menuCategory = menuState.addedItems[categoryId] as CategoryOnMenu;
          categoriesToSet.push({id: categoryId, name: menuCategory.name});

          Object.keys(menuCategory.subcategories).forEach(subId => {
            const subCategory = menuCategory.subcategories[subId] as SubcategoryOnMenu;

            Object.keys(subCategory.items).forEach(item => {
              itemsToSet.push({
                categoryId: categoryId,
                subcategoryId: subId,
                subcategoryName: subCategory.items[item].subcategory_name || subCategory.name,
                item: {
                  id: item,
                  name: subCategory.items[item].name,
                  price: subCategory.items[item].price
                }
              });
            })
          })
        });
        setAllItems(itemsToSet);
        setFilteredItems(itemsToSet);
        setCategories(categoriesToSet);
      }
    }
    setItemsAndCategories();

  }, [menuState.addedItems]);

  const onSubmit = async (data: any) => {
    const amount = +data.amount;

    if (!Array.isArray(data.checkedItems)) {
      data.checkedItems = [data.checkedItems];
    }

    data.checkedItems.forEach((itemWithCategory: string) => {
      const checkedItem = JSON.parse(itemWithCategory) as ItemPriceMultiply;

      const item = menuState.addedItems[checkedItem.categoryId].subcategories[checkedItem.subcategoryId].items[checkedItem.item.id];
      
      let itemPrice = +item.price || +item.base_price; 

      switch(data.action) {
        case MULTIPLY_OPTION.ADD:
          itemPrice += amount;
          break;
        case MULTIPLY_OPTION.SUBTRACT:
          if (item.price - amount >= item.base_price) {
            itemPrice -= amount;
          }
          break;
        case MULTIPLY_OPTION.MULTIPLY:
          itemPrice *= amount;
          break;
        default:
          break;
      }

      if(itemPrice !== item.base_price) {
        item.price = itemPrice;
      } else {
        item.price = item.base_price;
      }
    });

    closeModal();
  }

  const renderSelectCategories = (categories: any) => {
    if (categories.length) {
      return (categories || []).map((item: CategoryPriceMultiply) => <Option key={item.id} value={item.id}>{item.name}</Option>)
    }
  }

  useEffect(() => {
    if (selectAll) {
      if (activeCategory) {
        const itemsToSet: string[] = allItems.filter(item => item.categoryId === activeCategory).map(item => JSON.stringify(item));
        setValue('checkedItems', itemsToSet);
      } else {
        setValue('checkedItems', allItems.map(item => JSON.stringify(item)));
      }


    } else {
      setValue('checkedItems', null);
    }
  }, [selectAll])

  useEffect(() => {
    if (activeCategory) {
      const filtered = allItems.filter((item) => item.categoryId === activeCategory);
      setFilteredItems(filtered);
    } else {
      setFilteredItems(allItems);
    }
  }, [activeCategory])



  return (
    <div className='menu-price-multiplier'>
      <Typography h2>{t('price_multiplier')}</Typography>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Row>
            <Column cols={6}>
              <Typography className='mb-10'>{t('menu_items')}</Typography>

              <div className='mt-10 mb-10'>
                <Select 
                    value=""
                    selectProps={{onChange: (event: any) => {
                      setActiveCategory(event.target.value);
                      setSelectAll(false);
                      setValue('checkedItems', null);
                    }}}
                  >
                  <Option disabled hidden>{t('filter_by_categories')}</Option>
                  <Option value="">{t('all')}</Option>
                  {renderSelectCategories(categories || [])}
                </Select>
              </div>
            </Column>
            <Column cols={6}>
              <Typography>{t('adjust_item_prices_by')}</Typography>
                <div className='ui-flex price-options mt-10'>
                  <Select 
                    value=""
                    selectProps={{ ...register('action') }}
                    error={errors?.action?.message}
                  >
                    <Option value="" disabled hidden>{t('action')}</Option>
                    <Option value={MULTIPLY_OPTION.ADD}>{t('add')}</Option>
                    <Option value={MULTIPLY_OPTION.SUBTRACT}>{t('subtract')}</Option>
                    <Option value={MULTIPLY_OPTION.MULTIPLY}>{t('multiply')}</Option>
                  </Select>
                  <Input 
                    className='ml-10' 
                    placeholder={t('amount')} 
                    type='number' 
                    {...register('amount')} 
                    error={errors?.amount?.message}
                  />
                </div>
            </Column>
            </Row>
            <Row >
              <Column cols={12}>
                <div className='checkboxes'>
                  <Checkbox onChange={(event) => {setSelectAll(event.target.checked)}} key='all' checked={selectAll} value='all' className='my-5 w-100 mb-20' label={t('select_all_items')} />
                  {
                    (filteredItems.length ? filteredItems : allItems).map((item, index) => {
                      {
                        return (
                          <Checkbox {...register('checkedItems')} key={index + '' + item.item.id} value={JSON.stringify(item)} className='my-5 w-100' label={item.item.name + ' - ' +(item.subcategoryName)} />
                        );
                      }
                    })
                  }
                </div>
              </Column>
            </Row>
        </Grid>
        <Divider vertical={30} />
        <div className='ui-flex v-center end'>
          <Button size="large" variant="ghost" onClick={closeModal}>{t('cancel')}</Button>
          <Button disabled={!watch('checkedItems')?.length} className='ml-10' type='submit'>{t('continue')}</Button>
        </div>
      </form>

    </div>
  );
}

export default PriceMultiplier;
