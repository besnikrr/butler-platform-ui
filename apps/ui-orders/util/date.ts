const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getDayNameFromIndex = (dayIndex: number): string => {
  return days[dayIndex];
};

export const removeDayAbbreviations = (time: string): string => {
  return time ? time.replace(/ AM| PM/g, "") : "";
};
