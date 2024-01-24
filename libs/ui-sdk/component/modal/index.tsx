import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import noScroll from 'no-scroll';
import { Card } from '../../component/card';
import { ComponentSizeProp } from '../../util';

import './index.scss';

interface ModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
  hideBackdrop?: boolean;
  bodyCardSize?: ComponentSizeProp;
}

const Modal: React.FC<ModalProps> = ({ visible, onClose, children, style, hideBackdrop, bodyCardSize = 'medium' }) => {
  useEffect(() => {
    if (visible) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      noScroll.off();
    }
  });

  useEffect(() => {
    const onEscPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onEscPress);
    return (): void => {
      document.removeEventListener('keydown', onEscPress);
    };
  }, [onClose]);

  if (!visible) return null;
  return (
    ReactDOM.createPortal(
      <div className='ui-modal-root'>
        {!hideBackdrop && <div className='ui-modal-backdrop' onClick={onClose} />}
        <div className='ui-modal-wrapper' style={style}>
          <Card className='ui-modal' size={bodyCardSize}>
            {children}
          </Card>
        </div>
      </div>,
      document.body,
    )
  );
}

export { Modal };
