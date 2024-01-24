export const hotelKeys = {
  all: ["hotels"],
  list: (page?: number) => [...hotelKeys.all, "list", page],
  details: (id: number | string) => [...hotelKeys.all, "details", id],
};
