import React from 'react';
import classNames from 'classnames';
import { ButtonBase } from '../../primitive';
import { Icon } from '../icon';

import './index.scss';

interface ChipProps {
  className?: string;
  size?: 'small' | 'medium' | 'large'; // TODO: implement sizing
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Chip: React.FC<ChipProps> = ({ className, children, onClose, size = 'medium', style }) => {
  return (
    <div
      className={classNames(
        'ui-chip',
        { [`ui-chip-${size}`]: size !== 'medium' },
        className
      )}
      style={style}
    >
      {children}
      {onClose && (
        <ButtonBase onClick={onClose}>
          <Icon type="Close" size={14} />
        </ButtonBase>
      )}
    </div>
  );
};

export { Chip, ChipProps };
