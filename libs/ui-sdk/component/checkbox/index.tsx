import React, {CSSProperties, RefObject, useCallback, useEffect} from 'react';
import classNames from 'classnames';
import { CheckboxBase, CheckboxBaseProps } from '../../primitive';
import { useForkRef } from '../../util';
import { Icon } from '../icon';

import './index.scss';

interface CheckboxProps extends CheckboxBaseProps {
  errorText?: string;
  checkboxStyle?: CSSProperties;
  checkboxClassName?: string;
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  size = 'medium',
  errorText,
  label,
  checkboxClassName,
  ...props
}, ref) => {
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleInputRef = useForkRef(inputRef, ref);

  function change() {
    if (inputRef.current?.checked) {
      labelRef.current?.classList.add('ui-checkbox-checked');
    } else {
      labelRef.current?.classList.remove('ui-checkbox-checked');
    }
  }

  useEffect(() => {
    inputRef.current?.addEventListener('change', change);
    if (inputRef.current?.defaultChecked) {
      labelRef.current?.classList.add('ui-checkbox-checked');
    }
    return () => {
      inputRef.current?.removeEventListener('change', change);
    }
  }, [inputRef]);

  useEffect(() => {
    change();
  }, [ref]);

  return (
    <label ref={labelRef} htmlFor={props.id} className={classNames('ui-checkbox-wrapper', { 'ui-checkbox-checked': props.checked, 'ui-disabled': props.disabled }, props.className)}>
      <span className='ui-checkbox'>
        <CheckboxBase {...props} ref={handleInputRef} className={checkboxClassName} />
        <Icon className='ui-checkmark' type='Checkmark' size={16} />
      </span>
      {label && <span className='ui-checkbox-label'>{label}</span>}
    </label>
  )
});

export { Checkbox, CheckboxProps };
