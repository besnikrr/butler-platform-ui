import classNames from 'classnames';
import React from 'react';

interface FormGroupProps {
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = (props) => {
  return (
    <div className={classNames('ui-form-group', props.className)}>
      {props.children}
    </div>
  );
}

export { FormGroup };
