import { Typography } from '../../component/typography';
import classNames from 'classnames';
import React from 'react';

import './index.scss';

interface FormControlProps {
  className?: string;
  label?: string;
  htmlFor?: string;
  vertical?: boolean;
}

const FormControl: React.FC<FormControlProps> = (props) => {
  return (
    <div className={classNames(
      'ui-form-control',
      { 'ui-form-control-vertical': props.vertical },
      props.className
    )}>
      <div className={classNames('ui-form-control-label', { ['text-right']: !props.vertical })}>
        <Typography as='label' htmlFor={'123'}>{props.label}</Typography>
      </div>
      <div className='ui-form-control-input'>
        {props.children}
      </div>
    </div>
  );
}

export { FormControl };
