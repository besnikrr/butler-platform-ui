import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import { Icon, InputProps, ButtonBase, Input } from '@butlerhospitality/ui-sdk';
import { useForkRef } from 'libs/ui-sdk/util';

import './index.scss';

const InputCounter = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const forkRef = useForkRef(ref, inputRef);
  return (
    <Input
      {...props}
      ref={forkRef}
      className={classNames('ui-input-counter', className)}
      type="number"
      size="small"
      min={0}
      leftAddon={
        <ButtonBase
          className="ui-input-counter-button"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.stepDown();
              // trigger onChange
              inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }}
        >
          <Icon type="Minus" size={16} />
        </ButtonBase>
      }
      rightAddon={
        <ButtonBase
          className="ui-input-counter-button"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.stepUp();
              // trigger onChange
              inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }}
        >
          <Icon type="Plus" size={16} />
        </ButtonBase>
      }
    />
  );
});

export { InputCounter };
