import classNames from 'classnames';
import React from 'react';

import './index.scss';

interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
  vertical?: number;
  dashed?: boolean;
}

const Divider: React.FC<DividerProps> = ({ vertical = 20, className, style, dashed }) => {
  return (
    <div
      className={classNames('ui-divider', { 'dashed': dashed }, className)}
      style={{ marginTop: vertical, marginBottom: vertical, ...style }}
    />
  );
}

export { Divider };
