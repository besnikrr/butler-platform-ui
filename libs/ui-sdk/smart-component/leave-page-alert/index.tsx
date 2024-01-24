import React from 'react';
import { Typography, Button, Divider, Modal } from '../../component';
import { useTranslation } from '../../package/localization';

interface ILeavePageAlert {
  modal: boolean;
  setModal: (val: boolean) => void;
  onLeave: () => void;
}

const LeavePageAlert: React.FC<ILeavePageAlert> = ({ modal, setModal, onLeave }): JSX.Element => {
  const { t } = useTranslation();

  return <Modal
    visible={modal}
    onClose={() => undefined}
    style={{ maxWidth: 550 }}
  >
    <Typography h2>{t('Are you sure you want to leave this page?')}</Typography>
    <Divider vertical={20} />
    <Typography p size={"large"}>
      {t('ui_sdk.smart_component.leave_page_alert')}
    </Typography>
    <br />
    <Typography p size={"large"}>
      {t(`Save before you go!`)}
    </Typography>
    <br />
    <div
      className='ui-flex end'
    >

      <Button
        type="submit"
        variant="ghost"
        onClick={(e) => onLeave()}
      >
        {t('Leave')}
			</Button>
			<Button className="ml-10" variant="primary" onClick={() => setModal(false)}>
        {t('Stay')}
      </Button>
    </div>
  </Modal>
}

export {
  LeavePageAlert
};
