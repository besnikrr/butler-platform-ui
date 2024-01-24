import { useContext } from "react";
import { BreadcrumbContext } from "./Wrapper";

const useBreadcrumbs = () => useContext(BreadcrumbContext);

export default useBreadcrumbs;
