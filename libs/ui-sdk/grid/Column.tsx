import React from "react";
import classNames from "classnames";
// import { generateColumnClasses } from '../../../utils/generateGridClasses';

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

export type BreakpointsValue =
  | "auto"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
type Offsets = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Props = {
  [key in GridBreakpoints]?: BreakpointsValue | true;
} & {
  size?: BreakpointsValue;
  offset?: Offsets;
  offsetSm?: Offsets;
  offsetMd?: Offsets;
  offsetLg?: Offsets;
  offsetXl?: Offsets;
  offsetXxl?: Offsets;
  pull?: Offsets;
  pullSm?: Offsets;
  pullMd?: Offsets;
  pullLg?: Offsets;
  pullXl?: Offsets;
  pullXxl?: Offsets;
};

export type ColumProps = SimpleSpread<
  React.AllHTMLAttributes<HTMLDivElement>,
  Props
>;

function generateColumnClasses(props: ColumProps): string[] {
  const classes = [];
  if (props.size) {
    classes.push(`col-${props.size}`);
  }

  if (props.sm && ["string", "number"].includes(typeof props.sm)) {
    classes.push(`col-sm-${props.sm}`);
  }

  if (props.md && ["string", "number"].includes(typeof props.md)) {
    classes.push(`col-md-${props.md}`);
  }

  if (props.lg && ["string", "number"].includes(typeof props.lg)) {
    classes.push(`col-lg-${props.lg}`);
  }

  if (props.xl && ["string", "number"].includes(typeof props.xl)) {
    classes.push(`col-xl-${props.xl}`);
  }

  if (props.xxl && ["string", "number"].includes(typeof props.xxl)) {
    classes.push(`col-xxl-${props.xxl}`);
  }

  if (props.offset) {
    classes.push(`offset-${props.offset}`);
  }

  if (props.offsetSm) {
    classes.push(`offset-sm-${props.offsetSm}`);
  }

  if (props.offsetMd) {
    classes.push(`offset-md-${props.offsetMd}`);
  }

  if (props.offsetLg) {
    classes.push(`offset-lg-${props.offsetLg}`);
  }

  if (props.offsetXl) {
    classes.push(`offset-xl-${props.offsetXl}`);
  }

  if (props.offsetXxl) {
    classes.push(`offset-xxl-${props.offsetXxl}`);
  }

  if (props.pull) {
    classes.push(`pull-${props.pull}`);
  }

  if (props.pullSm) {
    classes.push(`pull-sm-${props.pullSm}`);
  }

  if (props.pullMd) {
    classes.push(`pull-md-${props.pullMd}`);
  }

  if (props.pullLg) {
    classes.push(`pull-lg-${props.pullLg}`);
  }

  if (props.pullXl) {
    classes.push(`pull-xl-${props.pullXl}`);
  }

  if (props.pullXxl) {
    classes.push(`pull-xxl-${props.pullXxl}`);
  }

  return classes.map((c) => `ui-${c}`);
}

const Column: React.FC<ColumProps> = ({
  size,
  md,
  sm,
  lg,
  xl,
  xxl,
  offset,
  offsetSm,
  offsetMd,
  offsetLg,
  offsetXl,
  offsetXxl,
  pull,
  pullSm,
  pullMd,
  pullLg,
  pullXl,
  pullXxl,
  children,
  ...props
}) => {
  const colClassName = (): string => {
    let defaultClassName = "ui-col";
    if (sm && typeof sm === "boolean") defaultClassName = "ui-col-sm";
    if (md && typeof md === "boolean") defaultClassName = "ui-col-md";
    if (lg && typeof lg === "boolean") defaultClassName = "ui-col-lg";
    if (xl && typeof xl === "boolean") defaultClassName = "ui-col-xl";
    if (xxl && typeof xxl === "boolean") defaultClassName = "ui-col-xxl";
    return defaultClassName;
  };
  return (
    <div
      {...props}
      className={classNames(
        colClassName(),
        generateColumnClasses({
          size,
          md,
          sm,
          lg,
          xl,
          xxl,
          offset,
          offsetSm,
          offsetMd,
          offsetLg,
          offsetXl,
          offsetXxl,
          pull,
          pullSm,
          pullMd,
          pullLg,
          pullXl,
          pullXxl,
        }),
        props.className
      )}
    >
      {children}
    </div>
  );
};

export default Column;
