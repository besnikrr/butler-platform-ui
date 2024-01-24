import React from 'react';
import {
  Card,
  Column,
  Typography,
} from '@butlerhospitality/ui-sdk';
import editHeader from './edit-header';
import { EditType } from '../edit';

export default ({ item }: any): JSX.Element => {
  return (
    <Card className="menu-content" page header={editHeader('Categories', `/menu/item/manage/${EditType.CATEGORY}/${item.id}`)}>
      {
        item.categories.map((category: any, index: number) => (
          <Typography data-testid={`menu-item-subcategory-${index}`} size='large' p className='mb-5' key={`menu-item-subcategory-${index}`}>{category.name}</Typography>
        ))
      }
    </Card>
  );
};
