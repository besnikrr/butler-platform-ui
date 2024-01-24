import React from 'react';
import { BaseTableBody, BaseTableBodyProps } from '../../primitive';

interface TableProps extends BaseTableBodyProps {
  size?: 'medium' | 'large';
}

const TableBody: React.FC<TableProps> = (props) => {
  return (
    <BaseTableBody>{props.children}</BaseTableBody>
  );
}

export default TableBody;
