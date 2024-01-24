import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { ButtonBase } from '../../primitive';
import { ComponentSizeProp, SimpleSpread } from '../../util';

import './index.scss'

interface Props {
  size?: ComponentSizeProp;
  variant?: 'secondary' | 'primary' | 'danger' | 'danger-ghost' | 'ghost';
  muted?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
}

type ButtonProps = SimpleSpread<ButtonHTMLAttributes<HTMLButtonElement>, Props>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'primary', size = 'medium', muted, leftIcon, rightIcon, iconOnly, children, ...props }, ref) => {
  return (
    <ButtonBase
      {...props}
      ref={ref}
      size={size}
      className={classNames(`ui-btn-${variant}`, { 'ui-disabled': props.disabled, 'ui-icon-only': iconOnly, 'ui-btn-muted': variant.includes('ghost') && muted }, props.className)}
    >
      {leftIcon && <span className="ui-btn-icon-left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ui-btn-icon-right">{rightIcon}</span>}
    </ButtonBase>
  );
});

Button.displayName = 'Button';

export { Button, ButtonProps };
