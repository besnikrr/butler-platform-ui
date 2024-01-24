export const BASE_APP_ROUTE = "voucher";
export const BASE_PROGRAM_ROUTE = "programs";
export const BASE_CODE_ROUTE = "codes";
export const BASE_HOTEL_PROGRAM_ROUTE = "hotel-programs";

export const LIST = "list";
export const PROGRAM_LIST = LIST;
export const CODE_LIST = LIST;
export const HOTEL_PROGRAM_LIST = LIST;

export const PROGRAM_EDIT_DETAILS = "edit-details";
export const PROGRAM_EDIT_CONFIGS = "edit-configs";
export const PROGRAM_DETAILS = "details";
export const PROGRAM_CREATE = "create";

export const start = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}`,
  title: "Program List",
};

export const programList = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}`,
  title: "Program List",
};

export const programEditDetails = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}/edit/details`,
  title: "Program edit details",
};

export const programEditConfigs = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}/edit/configs`,
  title: "Program edit configs",
};

export const programDetails = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}/details`,
  title: "Program details",
};

export const programCreate = {
  path: `/${BASE_APP_ROUTE}/${BASE_PROGRAM_ROUTE}/create/hotel`,
  title: "Program create",
};

export const codeList = {
  path: `/${BASE_APP_ROUTE}/${BASE_CODE_ROUTE}/active`,
  title: "Code list",
};

export const hotelProgramList = {
  path: `/${BASE_APP_ROUTE}/${BASE_HOTEL_PROGRAM_ROUTE}/list`, // todo: remove /list from tenant service
  title: "Hotel program list",
};
