import React from 'react';
import {
    Button,
    useTranslation,
    Modal,
    Typography,
    Divider,
} from '@butlerhospitality/ui-sdk';
import { StatusAlertProp } from '../index.types';

const StatusAlert: React.FC<StatusAlertProp> = function ({
    visible,
    title,
    onClose,
    description,
    ctaLabel,
    onSuccess
  }): JSX.Element {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            onClose={() => onClose(false)}
            style={{ width: 360 }}
        >
            <Typography h2>{title}</Typography>
            <div>
                <Divider />
                <Typography size={'large'}>
                    {description}
                </Typography>
                <div className="ui-flex end mt-30">
                    <Button size="large" variant="ghost" onClick={() => onClose(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        size="large"
                        variant="danger"
                        className="ml-20"
                        onClick={() => {
                            onSuccess();
                            onClose(false);
                        }}
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default StatusAlert
