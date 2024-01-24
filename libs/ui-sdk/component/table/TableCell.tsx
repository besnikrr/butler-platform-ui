import React from "react";
import classNames from "classnames";
import { BaseTableCell, BaseTableCellProps } from "../../primitive";

interface TableProps extends BaseTableCellProps {
  size?: "medium" | "large";
  wrapperClassName?: string;
}

const TableCell: React.FC<TableProps> = ({
  children,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <BaseTableCell
      {...props}
      className={classNames("ui-table-cell", className)}
    >
      <div className={classNames("ui-td-wrapper", wrapperClassName)}>
        {children}
      </div>
    </BaseTableCell>
  );
};

export default TableCell;
