import { VoucherTypeLower } from '@butlerhospitality/shared';
import {
  Icon,
  Tooltip,
  Typography,
  useTranslation,
} from '@butlerhospitality/ui-sdk';

export default (): JSX.Element => {
  const { t } = useTranslation();

  const content = (
    <>
      <div className="ui-border-bottom pb-10 pt-10">
        <div className="mb-10">
          <Typography>{VoucherTypeLower.PRE_FIXE}</Typography>
        </div>
        <div className='mt-5'>
          <Typography p muted>
            {t('PRE_FIXE_DESCRIPTION')}
          </Typography>
        </div>
      </div>
      <div className="ui-border-bottom pb-10 pt-10">
        <div className="mb-10">
          <Typography>{VoucherTypeLower.DISCOUNT}</Typography>
        </div>
        <div className='mt-5'>
          <Typography p muted>
            {t('DISCOUNT_DESCRIPTION')}
          </Typography>
        </div>
      </div>
      <div className="pb-10 pt-10">
        <div className="mb-10">
          <Typography>{VoucherTypeLower.PER_DIEM}</Typography>
        </div>
        <div className='mt-5'>
          <Typography p muted>
            {t('PER_DIEM_DESCRIPTION')}
          </Typography>
        </div>
      </div>
    </>
  );

  return (
    <Tooltip
      className="voucher-type-tooltip"
      content={content}
      placement="right"
    >
      <Icon className="ml-5" type="Infoi" size={16} />
    </Tooltip>
  );
};
