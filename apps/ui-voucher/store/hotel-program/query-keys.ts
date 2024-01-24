export const hotelProgramKeys = {
  all: ["hotel-program"],
  list: (page: number) => [...hotelProgramKeys.all, "list", page],
  details: (id: number | string) => [...hotelProgramKeys.all, "details", id],
};
