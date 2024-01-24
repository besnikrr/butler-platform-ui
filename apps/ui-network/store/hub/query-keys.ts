export const hubKeys = {
  all: ["hubs"],
  list: (page?: number) => [...hubKeys.all, "list", page],
  details: (id: number | string) => [...hubKeys.all, "details", id],
};
