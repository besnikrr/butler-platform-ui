import React from 'react';
import classNames from 'classnames';
import { BaseTableRow, BaseTableRowProps } from '../../primitive';

interface TableProps extends BaseTableRowProps {
  size?: 'medium' | 'large';
  noHover?: boolean;
}

const TableRow: React.FC<TableProps> = ({
  noHover = false,
  ...props
}) => {
  return (
    <BaseTableRow {...props} className={classNames({ 'ui-tr-nohover': noHover })}>{props.children}</BaseTableRow>
  );
}

export default TableRow;
