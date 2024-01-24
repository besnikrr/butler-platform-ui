export const userKeys = {
  all: ["network-users"],
  list: (page?: number) => [...userKeys.all, "list", page],
  details: (id: number | string) => [...userKeys.all, "details", id],
};
