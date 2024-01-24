import React from 'react';
import { BaseTableHead, BaseTableHeadProps } from '../../primitive';

interface TableProps extends BaseTableHeadProps {
  size?: 'medium' | 'large';
}

const TableHead: React.FC<TableProps> = (props) => {
  return (
    <BaseTableHead>{props.children}</BaseTableHead>
  );
}

export default TableHead;
