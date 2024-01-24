export const cityKeys = {
  all: ["cities"],
  list: (page?: number) => [...cityKeys.all, "list", page],
  details: (id: number | string) => [...cityKeys.all, "details", id],
};
