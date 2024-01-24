import React from 'react';
import classNames from 'classnames';
import { Input, InputProps } from '../input';
import { InputBaseProps } from '../../primitive';
import InputAddon from '../input-addon';
import { Icon } from '../icon';
import { useForkRef } from '../../util';

import './index.scss';

interface InputPasswordProps extends InputBaseProps {
  passwordToggle?: InputProps;
  error?: string;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(({ passwordToggle = true, ...props }, ref) => {
  // const handleInputRef = useForkRef(inputRef, ref);
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  }

  return (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      className={classNames('ui-input-password', props.className)}
      rightAddon={
        passwordToggle && (
          <InputAddon disabled={props.disabled} onClick={togglePasswordVisibility}>
            <Icon type={showPassword ? 'EyeCrossed' : 'EyeOpen'} size={20} />
          </InputAddon>
        )
      }
    />
  )
});

export { InputPassword };
