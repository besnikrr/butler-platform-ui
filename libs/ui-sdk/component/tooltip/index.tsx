import React from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import classNames from 'classnames';
import { Card } from '../card';

import './index.scss';

interface TooltipProps extends TippyProps {
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = (
  {
    children,
    className,
    content,
    ...props
  }
) => {
  return (
    <Tippy
      {...props}
      className={classNames('ui-tooltip-wrapper', className)}
      content={
        <Card
          size='small'
          style={{
            width: 'auto',
            zIndex: 99,
            padding: '5px 10px',
          }}
          className={classNames(
            'ui-tooltip',
            `ui-arrow-left`,
          )}
        >
          <span>
            {content}
          </span>
        </Card>
      }
    >
      {children}
    </Tippy>
  );
};

export { Tooltip };