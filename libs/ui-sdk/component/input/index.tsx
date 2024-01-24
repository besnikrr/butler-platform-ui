import React, { CSSProperties, RefObject } from 'react';
import classNames from 'classnames';
import { InputBase, InputBaseProps } from '../../primitive';
import { Tooltip } from '../tooltip';
import { Icon } from '../icon';
import { useForkRef } from '../../util';

import './index.scss';

interface InputProps extends InputBaseProps {
  error?: string;
  suffixNode?: React.ReactNode;
  prefixNode?: React.ReactNode;
  leftAddon?: React.ReactElement | false | null;
  rightAddon?: React.ReactElement | false | null;
  inputStyle?: CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  ghost?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  size = 'medium',
  error,
  prefixNode,
  suffixNode,
  leftAddon,
  rightAddon,
  style,
  inputStyle,
  wrapperProps,
  ghost,
  ...props
}, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleInputRef = useForkRef(inputRef, ref);

  const suffix = suffixNode ? <span className='ui-input-suffix'>{suffixNode}</span> : null;
  const prefix = prefixNode ? <span className='ui-input-prefix'>{prefixNode}</span> : null;

  const handleClick = (event: any): void => {
    if (inputRef.current && event.currentTarget === event.target) {
      inputRef.current.focus();
    }
    if (wrapperProps?.onClick) {
      wrapperProps.onClick(event);
    }
  };

  return (
    <div
      className={classNames(
        `ui-input-wrapper ui-input-${size}`,
        {
          'ui-disabled': props.disabled,
          'ui-input-error': !!error,
          'ui-input-ghost': ghost,
        },
        props.className,
      )}
      style={style}
      {...wrapperProps}
      onClick={handleClick}
    >
      {leftAddon && React.cloneElement(leftAddon, {
        className: classNames('ui-input-addon-left', leftAddon.props.className),
      })}
      {prefix}
      <InputBase {...props} className='' style={inputStyle} ref={handleInputRef} />
      {suffix}
      {rightAddon && React.cloneElement(rightAddon, {
        className: classNames('ui-input-addon-right', rightAddon.props.className),
      })}
      {
        !!error && (
          <div className='ui-input-addon-right'>
            <Tooltip offset={[0, 25]} content={error} placement='right'>
              <Icon type='Infoi' size={18} />
            </Tooltip>
          </div>
        )
      }
    </div>
  )
});

export { Input, InputProps };
