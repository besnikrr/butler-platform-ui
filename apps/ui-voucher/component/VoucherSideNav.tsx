import { useHistory, useLocation } from 'react-router-dom';
import {
  Typography,
  Button,
  Icon,
  useTranslation
} from '@butlerhospitality/ui-sdk';

const VoucherSideNav = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const getActive = (path: string[], exact?: boolean) => {
    const locationPath = location.pathname.replace('/voucher', '');
    if (exact) {
      return path.includes(locationPath) ? 'primary' : 'ghost';
    }
    const found = path.find(p => locationPath.startsWith(p));
    return found ? 'primary' : 'ghost';
  };

  return (
    <>
      <div className='network-sidebar-header'>
        <Typography h1>Voucher</Typography>
        <Button variant='ghost' iconOnly onClick={() => {
          history.push('/');
        }}><Icon type='Union' size={40} /></Button>
      </div>
      <div className='network-sidebar-wrapper'>
        <Button
          onClick={() => history.push('/voucher/hotel-programs/list')}
          className='primary w-100'
        >
          {t('HOTELS')}
        </Button>
      </div>
    </>
  )
}

export default VoucherSideNav
