import React from "react";
import classNames from "classnames";

export type GridBreakpoints = "sm" | "md" | "lg" | "xl" | "xxl";
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

export type GridProps = {
  gutter?: Gutters;
  type?: "fluid" | GridBreakpoints;
} & React.AllHTMLAttributes<HTMLDivElement>;

const Grid: React.FC<GridProps> = ({
  type = "fluid",
  gutter,
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        `${type ? `ui-container-${type}` : "ui-container"}`,
        { [`ui-gutter-${gutter}`]: !!gutter || gutter === 0 },
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
