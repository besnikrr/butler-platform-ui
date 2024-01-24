export const programCategoryKeys = {
  all: ["program-categories"],
  list: (page: number) => [...programCategoryKeys.all, "list", page],
  details: (id: number | string) => [...programCategoryKeys.all, "details", id],
};
