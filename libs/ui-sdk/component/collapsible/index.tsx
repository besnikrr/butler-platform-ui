import React, { useState } from 'react';
import classNames from 'classnames';
import { ButtonBase } from '../../primitive';
import { Icon } from '../icon';
import { Typography } from '../typography';

import './index.scss';

interface CollapsibleProps {
  className?: string;
  title: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

const Collapsible: React.FC<CollapsibleProps> = (props) => {
  const [open, setOpen] = useState<boolean>(!!props.open);

  const toggle = () => {
    setOpen(!open);
    if (props.onToggle) {
      props.onToggle(!open);
    }
  };

  return (
    <div className={classNames('ui-collapsible', { 'open': open }, props.className)}>
      <ButtonBase type='button' onClick={toggle} className='ui-collapsible-toolbar w-100 ui-flex between v-center px-20'>
        <Typography size='large'>{props.title}</Typography>
        <Icon type={open ? 'ArrowUp' : 'ArrowDown'} size={18} />
      </ButtonBase>
      <div className='ui-collapsible-body'>
        {props.children}
      </div>
    </div>
  );
}

export { Collapsible };
