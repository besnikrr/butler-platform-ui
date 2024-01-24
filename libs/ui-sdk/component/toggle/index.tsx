/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { CSSProperties, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames';

import { Icon } from '../icon';

import './index.scss';
import { CheckboxBase, InputBaseProps } from '../../primitive';
import { useForkRef, useOutsideClick } from '../../util';

interface ToggleProps extends InputBaseProps {
  errorText?: string;
  checkboxStyle?: CSSProperties;
  checkboxClassName?: string;
  label?: string;
  size?: 'default' | 'small';
  icon?: '';
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = 'default',
      errorText,
      style,
      label,
      checkboxClassName,
      ...props
    },
    ref
  ) => {
    const labelRef = React.useRef<HTMLLabelElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleInputRef = useForkRef(inputRef, ref);

    useEffect(() => {
      
      inputRef.current?.addEventListener('change', change);
      return () => {
        inputRef.current?.removeEventListener('change', change);
      };
    }, [inputRef]);

    const change = () => {
      inputRef.current?.checked
        ? labelRef.current?.classList.add('ui-toggle-checked')
        : labelRef.current?.classList.remove('ui-toggle-checked');
    };

    const renderWithIcon = () =>
      checked ? (
        <Icon type="Checkmark" size={size === 'default' ? 14 : 10} />
      ) : (
        <Icon type="Close" size={size === 'default' ? 14 : 10} />
      );

    useEffect(() => {
      change();
    }, [ref]);

    return (
      <div
        ref={labelRef}
        className={classNames(
          'ui-toggle-wrapper',
          {
            'ui-toggle-checked': props.checked,
            'ui-toggle-disabled': props.disabled,
            'ui-toggle-switch': props.type === 'switch',
          },
          props.className
        )}
      >
        {label && <span className="ui-toggle-label">{label}</span>}
        <div className="ui-toggle">
          <div
            className={classNames('ui-toggle-container', {
              'ui-toggle-container-small': size === 'small',
            })}
          >
            <div className="ui-toggle-check" />
            <div className="ui-toggle-uncheck" />
          </div>
          <div
            className={classNames('ui-toggle-circle', {
              'ui-toggle-circle-small': size === 'small',
            })}
          >
            {props?.icon && (
              <span className="ui-toggle-icon">
                {prop?.type === 'default' && renderWithIcon()}
              </span>
            )}
          </div>
          <CheckboxBase {...props} ref={handleInputRef} className={checkboxClassName} />
        </div>
      </div>
    );
  }
);

export { Toggle };
