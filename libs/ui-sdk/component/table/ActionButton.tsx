import classNames from 'classnames';
import React from 'react';
import { Button } from '../button';
import { ButtonBaseProps } from '../../primitive/button';

interface ActionButtonProps extends ButtonBaseProps{
  className?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(({ className, ...props }, ref) => {
  return (
    <Button {...props} ref={ref} size='small' variant='ghost' muted className={classNames('ui-action-btn', className)} iconOnly>
      {props.children}
    </Button>
  );
});

export default ActionButton;
