import React from 'react';
import classNames from 'classnames';
import { BaseTable, BaseTableProps } from '../../primitive';

interface TableProps extends BaseTableProps {
  size?: 'medium' | 'large';
}

const Table: React.FC<TableProps> = ({ size = 'medium', ...props}) => {
  return (
    <div className='ui-table-container'>
      <BaseTable
        {...props}
        className={classNames(`ui-table-${size}`)}
      >
        {props.children}
      </BaseTable>
    </div>
  );
}

export default Table;
