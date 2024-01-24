export const userKeys = {
  all: ["users"],
  list: (page?: number) => [...userKeys.all, "list", page],
  details: (id: number | string) => [...userKeys.all, "details", id],
};
