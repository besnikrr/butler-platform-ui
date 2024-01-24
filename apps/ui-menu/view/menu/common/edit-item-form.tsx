import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Typography,
  Divider,
  Input,
  Link,
  ButtonBase,
  Chip,
  Button,
  Icon,
  useTranslation,
  Grid,
  Row,
  Column,
  Checkbox,
  InputSearch
} from "@butlerhospitality/ui-sdk";


let suggestedItemsToSelectAll = {};
const EditItemForm = ({ itemEditing, categoryId, menuState, activeTab, close, onSave }: any): JSX.Element => {
  const { t } = useTranslation();
  const [suggestedItemsToSelect, setSuggestedItemsToSelect] = useState<any>({});
  const [suggestedItems, setSuggestedItems] = useState<string[]>(itemEditing.suggested_items || []);
  const [editActive, setEditActive] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [isPopular, setIsPopular] = useState(itemEditing.is_popular || false);
  const [isFavorite, setIsFavorite] = useState(itemEditing.is_favorite || false);
  const [price, setPrice] = useState<any>({
    price: itemEditing.price,
    base_price: itemEditing.base_price,
    hasNewPrice: itemEditing.price && Number(itemEditing.price) !== Number(itemEditing.base_price)
  });
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    const suggestedItemsMap: any = {};
    Object.keys(menuState.addedItems[categoryId].subcategories).forEach((subcategoryId: string) => {
      Object.keys(menuState.addedItems[categoryId].subcategories[subcategoryId].items).forEach((itemId: string) => {
        suggestedItemsMap[itemId] = menuState.addedItems[categoryId].subcategories[subcategoryId].items[itemId];
      });
    });
    suggestedItemsToSelectAll = suggestedItemsMap;
    setSuggestedItemsToSelect(suggestedItemsMap);
  }, [menuState.addedItems]);

  const saveItem = () => {
    delete itemEditing.price;
    onSave({
      ...itemEditing,
      ...(price.hasNewPrice && price.price ? { price: price.price } : {}),
      base_price: price.base_price,
      subcategory: activeTab,
      category: categoryId,
      suggested_items: suggestedItems,
      is_favorite: isFavorite,
      is_popular: isPopular,
    });
  }

  const add = (itemId: any) => {
    setSuggestedItems([...(suggestedItems || []), itemId]);
  }

  const remove = (itemId: any) => {
    setSuggestedItems(suggestedItems.filter((id: any) => id !== itemId));
  }

  const savePrice = () => {
    if (Number(newPrice) === itemEditing.price) {
      setPriceError(t('same_price_error'));
    } else if (Number(newPrice) < (itemEditing.base_price || itemEditing.price)) {
      setPriceError(t('lower_price_error'));
    } else {
      setPrice({
        price: Number(newPrice),
        base_price: Number(itemEditing.base_price) || Number(itemEditing.price),
        hasNewPrice: (Number(itemEditing.base_price) || Number(itemEditing.price)) !== Number(newPrice)
      });
      setEditActive(false);
    }
  }

  const handlePriceInputChange = (e: any) => {
    setNewPrice(e.currentTarget.value);
    setPriceError(null);
  }

  const searchSuggestedItemsToSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredSuggestedItemsToSelect: any = {};
    Object.values(suggestedItemsToSelectAll).forEach((item: any) => {
      if (item.name.toLowerCase().includes(e.currentTarget.value.toLowerCase()))
        filteredSuggestedItemsToSelect[item.id] = item;
    });
    setSuggestedItemsToSelect(filteredSuggestedItemsToSelect);
  }

  return (
    <div className='ui-flex w-100 column'>
      <Typography h2>{itemEditing.name}</Typography>

      <Grid className='mt-30' gutter={0}>
        <Row>
          <Column>
            <Checkbox
              label={t('is_popular')}
              checked={isPopular}
              onChange={(event) => { setIsPopular(event.target.checked) }}
            />
          </Column>
          <Column>
            <Checkbox
              label={t('is_favorite')}
              checked={isFavorite}
              onChange={(event) => { setIsFavorite(event.target.checked) }}
            />
          </Column>
        </Row>
      </Grid>

      <Divider vertical={30} />

      <Typography className='mb-20' p>{t('item_price')}</Typography>
      <div className='ui-flex v-center'>
        <Typography className={classNames('mr-10', { 'ui-text-line': price.hasNewPrice })} muted={price.hasNewPrice}>${Number(price.base_price).toFixed(2)}</Typography>
        {
          price.hasNewPrice &&
          <Typography className='mr-20'>${Number(price.price)?.toFixed(2)}</Typography>
        }
        {
          editActive ?
            <div className='ui-flex v-center'>
              <Input style={{ width: 100 }} placeholder='$0.00' step={1} min='0.00' type='number' error={priceError || ''} onChange={handlePriceInputChange} />
              <Link className='ml-10' component={ButtonBase} onClick={savePrice} size='medium'>{t('save')}</Link>
            </div>
            :
            <Link component={ButtonBase} onClick={() => setEditActive(true)} size='medium'>{t('edit')}</Link>
        }
      </div>
      <Divider vertical={30} />
      <Typography className='mb-30' p>{t('sugessted_items')}</Typography>
      <div className='menu-item-suggested-list ui-flex column v-start'>
        {
          suggestedItems.length > 0 ?
            <div className='menu-selected-chips'>
              {
                suggestedItems.map((itemId: any) => {
                  if (!suggestedItemsToSelect[itemId]) return null;
                  return (
                    <Chip key={itemId} onClose={() => remove(itemId)}>{suggestedItemsToSelect[itemId].name}</Chip>
                  )
                })
              }
            </div>
            :
            <Typography muted>{t('no_sugessted_items')}</Typography>
        }
        <div className='mb-20' />
        <Divider vertical={15} />
        <InputSearch className='mb-20' placeholder={t('search')} onChange={searchSuggestedItemsToSelect} />
        <div className='menu-suggested-chips w-100 ui-flex column v-start pl-10'>
          {
            Object.values(suggestedItemsToSelect).map((item: any, index: number) => {
              if (item.id === itemEditing.id) return null;
              if (suggestedItems.includes(item.id)) return null;
              return (
                <div key={item.id} className='menu-select-chip-wrapper w-100'>
                  <Divider vertical={15} />
                  <div className='w-100 ui-flex v-center between'>
                    <Typography className='mr-20'>{item.name}</Typography>
                    <Button onClick={() => add(item.id)} size='small' variant='ghost' iconOnly><Icon type='Plus' size={20} /></Button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <Divider vertical={30} />
      <div className='ui-flex end'>
        <Button variant='ghost' onClick={close} size='medium'>{t('cancel')}</Button>
        <Button className='ml-10' size='medium' onClick={saveItem}>{t('save')}</Button>
      </div>
    </div>
  )
}

export default EditItemForm;
