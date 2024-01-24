import React from 'react';
import classNames from 'classnames';

type BaseTableProps = React.HTMLAttributes<HTMLTableElement>;
const BaseTable: React.FC<BaseTableProps> = function (props) {
  return (
    <table {...props} className={classNames('ui-table', props.className)}>
      {props.children}
    </table>
  );
};

type BaseTableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;
const BaseTableHead: React.FC<BaseTableHeadProps> = function (props) {
  return (
    <thead {...props} className={classNames('ui-thead', props.className)}>
      {props.children}
    </thead>
  );
};

type BaseTableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
const BaseTableRow: React.FC<BaseTableRowProps> = function (props) {
  return (
    <tr {...props} className={classNames('ui-trow', props.className)}>
      {props.children}
    </tr>
  );
};

type BaseTableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
const BaseTableBody: React.FC<BaseTableBodyProps> = function (props) {
  return (
    <tbody {...props} className={classNames('ui-tbody', props.className)}>
      {props.children}
    </tbody>
  );
};

interface BaseTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  as?: 'td' | 'th';
  colspan?: number;
}
const BaseTableCell: React.FC<BaseTableCellProps> = function ({
  as = 'td',
  colspan,
  ...props
}) {
  return React.createElement(as, {
    ...props,
    colSpan: colspan,
    className: classNames('ui-table-cell', `ui-${as}`, props.className),
  });
};

export {
  // components
  BaseTable,
  BaseTableHead,
  BaseTableBody,
  BaseTableRow,
  BaseTableCell,
  // props
  BaseTableProps,
  BaseTableHeadProps,
  BaseTableBodyProps,
  BaseTableRowProps,
  BaseTableCellProps,
};
