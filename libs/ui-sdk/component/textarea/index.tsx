import classNames from 'classnames';
import React from 'react';
import { TextareaBase, TextareaBaseProps } from '../../primitive';

import './index.scss';

interface TextareaProps extends TextareaBaseProps {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return (
    <TextareaBase
      {...props}
      ref={ref}
      className={classNames('ui-textarea', props.className)}
      rows={props?.rows || 4}
    >
      {props.children}
    </TextareaBase>
  );
});

export { Textarea };
