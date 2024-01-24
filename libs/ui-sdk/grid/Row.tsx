import React from "react";

import classNames from "classnames";

export type Gutters =
  | 0
  | 5
  | 10
  | 15
  | 20
  | 25
  | 30
  | 35
  | 40
  | 45
  | 50
  | 55
  | 60;
type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;
type ColsInRow = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Props = {
  gutter?: Gutters;
  gutterY?: Gutters;
  cols?: ColsInRow;
  colsSm?: ColsInRow;
  colsMd?: ColsInRow;
  colsLg?: ColsInRow;
  colsXl?: ColsInRow;
  colsXxl?: ColsInRow;
};

export type RowProps = SimpleSpread<
  React.AllHTMLAttributes<HTMLDivElement>,
  Props
>;

function generateRowClasses(props: RowProps): string[] {
  const classes = [];
  if (props.cols) {
    classes.push(`${props.cols}`);
  }

  if (props.colsSm) {
    classes.push(`sm-${props.colsSm}`);
  }

  if (props.colsMd) {
    classes.push(`md-${props.colsMd}`);
  }

  if (props.colsLg) {
    classes.push(`lg-${props.colsLg}`);
  }

  if (props.colsXl) {
    classes.push(`xl-${props.colsXl}`);
  }

  if (props.colsXxl) {
    classes.push(`xxl-${props.colsXxl}`);
  }

  return classes.map((c) => `ui-row-cols-${c}`);
}

const Row: React.FC<RowProps> = ({
  gutter,
  gutterY,
  cols,
  colsSm,
  colsMd,
  colsLg,
  colsXl,
  colsXxl,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        "ui-row",
        { [`ui-gutter-${gutter}`]: !!gutter || gutter === 0 },
        { [`ui-gutter-y-${gutterY}`]: !!gutterY || gutterY === 0 },
        ...generateRowClasses({
          cols,
          colsSm,
          colsMd,
          colsLg,
          colsXl,
          colsXxl,
        }),
        props.className
      )}
    >
      {children}
    </div>
  );
};

export default Row;
