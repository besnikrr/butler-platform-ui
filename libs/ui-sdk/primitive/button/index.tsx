import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import { ComponentSizeProp, SimpleSpread } from '../../util';

import './index.scss'

interface Props {
  size?: ComponentSizeProp;
  variant?: 'secondary' | 'primary' | 'danger' | 'danger-ghost' | 'ghost';
}

type ButtonBaseProps = SimpleSpread<ButtonHTMLAttributes<HTMLButtonElement>, Props>;

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(({ size, variant = 'primary', children, ...props }, ref) => {
  return (
    <button
      {...props}
      style={props.style}
      ref={ref}
      type={props.type || 'button'}
      className={classNames('ui-btn', { [`ui-btn-${size}`]: size }, props.className)}
      role="button"
    >
      {children}
    </button>
  );
});

export { ButtonBase, ButtonBaseProps };
