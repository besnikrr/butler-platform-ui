const PAGE_SIZE = 10;
export const getTotalPages = (total: number) => {
  return Math.ceil(total / PAGE_SIZE) || 1;
};
