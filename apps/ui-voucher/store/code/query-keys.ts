export const codeKeys = {
  all: ["code"],
  list: (page: number) => [...codeKeys.all, "list", page],
  details: (id: number | string) => [...codeKeys.all, "details", id],
};
