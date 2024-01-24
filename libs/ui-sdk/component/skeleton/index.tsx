import React from "react";
import { Divider } from "../divider";

import "./index.scss";

type Part =
  | "field"
  | "table"
  | "labelField"
  | "title"
  | "divider"
  | "text"
  | "header"
  | "block"
  | "filterTable"
  | "cardHeaderAction"
  | "appCard";

interface SkeletonProps {
  parts: string[];
  className?: string;
}

const getSkeleton = (parts: Part | string) => {
  const partArray = parts.split("-");
  const part = partArray[0];
  const partsArray = new Array(parseInt(partArray[1], 10) || 1).fill("");
  switch (part) {
    case "field":
      return (
        <div className="ui-sk ui-skeleton-field">
          <div className="ui-skeleton small" />
        </div>
      );
    case "labelField":
      return partsArray.map((x, idx) => (
        <div key={`skeleton-label-field-${idx}`} className="ui-sk ui-skeleton-label-field">
          <div className="ui-skeleton small" />
          <div className="ui-skeleton" />
        </div>
      ));
    case "button":
      return (
        <div className="ui-sk ui-skeleton-button">
          <div className="ui-skeleton" />
        </div>
      );
    case "buttonSmall":
      return (
        <div className="ui-sk ui-skeleton-button">
          <div className="ui-skeleton small" />
        </div>
      );
    case "table":
      return (
        <div className="ui-sk ui-skeleton-table w-100">
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
        </div>
      );
    case "filterTable":
      return (
        <div className="ui-sk ui-skeleton-table w-100">
          <div className="ui-skeleton-toolbar">
            {partsArray.map((x, idx) => (
              <div key={idx} className="ui-skeleton" />
            ))}
          </div>
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
          <div className="ui-skeleton-row">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
        </div>
      );
    case "title":
      return (
        <div className="ui-sk ui-skeleton-title">
          <div className="ui-skeleton" />
        </div>
      );
    case "text":
      return (
        <div className="ui-sk ui-skeleton-text">
          {partsArray.map((x, idx) => (
            <div key={`skeleton-text-${idx}`} className="ui-skeleton" />
          ))}
        </div>
      );
    case "header":
      return (
        <div className="ui-sk ui-skeleton-header mb-20 ui-flex between pt-10 pl-30 w-100 pr-20">
          <div className="ui-skeleton" />
          <div className="ui-skeleton" />
        </div>
      );
    case "cardHeaderAction":
      return (
        <div className="ui-skeleton-card-header-act ui-flex between w-100">
          <div className="ui-skeleton" />
          <div className="ui-skeleton" />
        </div>
      );
    case "app":
      return (
        <div className="ui-skeleton-card-header-act ui-flex between w-100">
          <div className="ui-skeleton" />
          <div className="ui-skeleton" />
        </div>
      );
    case "divider":
      return <Divider vertical={20} />;
    case "block":
      return partsArray.map((x, idx) => <div key={idx} className="ui-sk ui-skeleton-block ui-skeleton" />);
    case "appCard":
      return (
        <div className="ui-skeleton-row ui-row ui-gutter-10 ui-skeleton-app-card w-100">
          <div className="ui-skeleton-row ui-gutter-10 ui-row-cols-2 ui-row-cols-sm-3 ui-row-cols-md-3 ui-row-cols-lg-4">
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
            <div className="ui-skeleton" />
          </div>
        </div>
      );
    default:
      return <div className="ui-sk ui-skeleton" />;
  }
};

const Skeleton: React.FC<SkeletonProps> = ({ className, parts }) => {
  return (
    <div data-testid="ui-skeleton" className={className}>
      {parts?.map((part) => (
        <span key={Math.random()}>{getSkeleton(part)}</span>
      ))}
    </div>
  );
};

export { Skeleton };
