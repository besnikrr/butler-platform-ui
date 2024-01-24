import classNames from 'classnames';
import React, { InputHTMLAttributes } from 'react';

import './index.scss';

type RadioBaseProps = InputHTMLAttributes<HTMLInputElement>;

const RadioBase = React.forwardRef<HTMLInputElement, RadioBaseProps>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type="radio"
      className={classNames('ui-radio-input', props.className)}
    />
  );
});

export { RadioBase, RadioBaseProps };
