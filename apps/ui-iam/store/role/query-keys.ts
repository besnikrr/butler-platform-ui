export const roleKeys = {
  all: ["roles"],
  list: (page?: number) => [...roleKeys.all, "list", page],
  details: (id: number | string) => [...roleKeys.all, "details", id],
};
