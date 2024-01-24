export const programKeys = {
  all: ["program"],
  list: (page: number) => [...programKeys.all, "list", page],
  details: (id: number | string) => [...programKeys.all, "details", id],
};
