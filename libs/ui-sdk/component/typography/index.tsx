import React from "react";
import classNames from "classnames";

import "./index.scss";

type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;
interface Props {
  muted?: boolean;
  size?: "small" | "large";
  h1?: boolean;
  header?: boolean;
  h2?: boolean;
  title?: boolean;
  p?: boolean;
  paragraph?: boolean;
  span?: boolean;
  label?: boolean;
  className?: string;
  bold?: boolean;
}
export type TypographyProps = SimpleSpread<
  React.AllHTMLAttributes<
    | HTMLSpanElement
    | HTMLHeadingElement
    | HTMLParagraphElement
    | HTMLLabelElement
  >,
  Props
>;

const Typography: React.FC<TypographyProps> = ({
  muted,
  size,
  className,
  h1,
  header,
  h2,
  title,
  p,
  paragraph,
  span,
  label,
  bold,
  ...props
}) => {
  let as = "span";
  if (h1 || header) as = "h1";
  if (h2 || title) as = "h2";
  if (p || paragraph) as = "p";
  if (span) as = "span";
  if (label) as = "label";

  return React.createElement(as, {
    ...props,
    className: classNames(
      "ui-typography",
      `ui-${as}`,
      {
        "ui-typography-muted": muted,
        "ui-typography-bold": bold,
        [`ui-typography-${size}`]: size,
      },
      className
    ),
  });
};

export { Typography };
