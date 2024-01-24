import React from 'react';
import classNames from 'classnames';

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul className={classNames('ui-list', props.className)}>
      {props.children}
    </ul>
  )
}

export { List };
