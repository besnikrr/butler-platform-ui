import React from 'react';
import classNames from 'classnames';
import { ButtonBase, ButtonBaseProps } from '../../primitive';

import './index.scss';

const InputAddon: React.FC<ButtonBaseProps> = (props) => {
  return (
    <ButtonBase {...props} className={classNames('ui-input-addon', props.className)} tabIndex={-1}>
      {props.children}
    </ButtonBase>
  )
}

export default InputAddon
