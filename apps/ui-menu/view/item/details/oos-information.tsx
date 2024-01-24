import React, { useState } from 'react';
import {
  ButtonBase,
  Card,
  Column,
  Link,
  Modal,
  Typography,
  useTranslation,
} from '@butlerhospitality/ui-sdk';
import { globalDateFormat } from 'libs/ui-sdk/util';
import ItemOOS from '../out-of-stock';


const renderOutOfStockInfo = (out_of_stock: any) => {
  return (
    <Column>
      {out_of_stock?.map((item: any) =>
        <Typography key={item.id} size='large' p className='mb-5'>{item.hub?.name} - {globalDateFormat(item.available_at, true)}</Typography>
      )}
    </Column>
  )
}

export default ({ item, refetchItem }: any): JSX.Element => {
  const { t } = useTranslation();
  const [itemOOS, setItemOOSMeta] = useState<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onClick = () => {
    setItemOOSMeta({ resource: 'item', id: item.id, name: item.name });
    setModalVisible(true);
  }

  return (
    <Card
      className="menu-content"
      page
      header={
        <>
          <Typography h2>Out of Stock</Typography>
          <Link component={ButtonBase} onClick={onClick}>{t('edit')}</Link>
        </>
      }
    >
      {item && item.out_of_stock?.length ?
        renderOutOfStockInfo(item.out_of_stock)
        :
        <Typography muted size='large' p className='mb-5'>No Out of Stock Information</Typography>
      }
      {itemOOS &&
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          style={{ minWidth: 780 }}
        >
          <ItemOOS onSubmitSuccess={() => refetchItem()} meta={itemOOS} onClose={() => setModalVisible(false)} />
        </Modal>
      }
    </Card>
  );
};
