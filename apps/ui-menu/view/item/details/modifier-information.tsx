import {
  Card,
  Column,
  Link,
  Typography,
} from '@butlerhospitality/ui-sdk';
import { Modifier } from '@butlerhospitality/shared';
import editHeader from './edit-header';
import { EditType } from '../edit';

const renderModifiers = (modifiers: any) => {
  return (
    <Column>
      {modifiers?.map((item: Modifier) =>
        <Typography key={item.id} size='large' p className='mb-5'>{item.name}</Typography>
      )}
    </Column>
  )
}

export default ({ item }: any): JSX.Element => {
  return (
    <Card className="menu-content" page header={editHeader('Modifiers', `/menu/item/manage/${EditType.MODIFIER}/${item.id}`)}>
      {item && item.modifiers?.length ?
        renderModifiers(item.modifiers)
        :
        <Typography muted size='large' p className='mb-5'>No Modifiers</Typography>
      }
    </Card>
  );
};
