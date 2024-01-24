import React, { LiHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  selected?: boolean;
  disabled?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ selected, disabled, ...props}): JSX.Element => {
  return (
    <li {...props} className={classNames('ui-list-item', { 'ui-list-item-selected': disabled ? false : selected, 'ui-disabled': disabled })}>
      {props.children}
    </li>
  )
}
export {
  ListItem
};
