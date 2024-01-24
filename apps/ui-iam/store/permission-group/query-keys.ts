export const permissionGroupKeys = {
  all: ["permission-groups"],
  list: (page?: number) => [...permissionGroupKeys.all, "list", page],
  details: (id: number | string) => [...permissionGroupKeys.all, "details", id],
};
