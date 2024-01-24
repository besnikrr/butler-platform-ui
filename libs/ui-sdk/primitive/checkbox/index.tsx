import classNames from 'classnames';
// import { useForkRef } from 'libs/ui-sdk/util';
import React, { InputHTMLAttributes, useEffect, useRef } from 'react';

import './index.scss';

type CheckboxBaseProps = InputHTMLAttributes<HTMLInputElement>;

const CheckboxBase = React.forwardRef<HTMLInputElement, CheckboxBaseProps>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      className={classNames('ui-checkbox-input', props.className)}
    />
  );
});

export { CheckboxBase, CheckboxBaseProps };
