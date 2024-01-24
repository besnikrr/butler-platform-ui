import React from 'react';
import classNames from 'classnames';
import { ComponentSizeProp } from '../../util';

import './index.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xsmall' | ComponentSizeProp;
  header?: React.ReactNode;
  page?: boolean;
  headerClassName?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ page, header, size, headerClassName, ...props}, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={classNames('ui-card', { [`ui-card-${size}`]: size, 'ui-card-page': page }, props.className)}
    >
      {
        header && (
          <div className={classNames('ui-card-header', headerClassName)}>
            {header}
          </div>
        )
      }
      {props.children}
    </div>
  )
});

export { Card };
