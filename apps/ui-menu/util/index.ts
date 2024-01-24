import { parseISO } from "date-fns";
import format from "date-fns/format";
import parse from "date-fns/parse";

const PAGE_SIZE = 10;
const parseDateFormat = "MM-dd-yyyy";
const parseDateFormatDB = "yyyy-MM-dd";

export const getTotalPages = (total: number, pageSize = PAGE_SIZE) => {
  return Math.ceil(total / pageSize) || 1;
};

export const convertTimeToMinutes = (time: string) => {
  const splitTime = time.split(":");

  const hours = Number(splitTime[0]) * 60;
  const minutes = Number(splitTime[1]);

  return hours + minutes;
};

export const parseDateToString = (date?: string) => {
  if (!date) return null;
  return format(parse(date, parseDateFormat, new Date()), parseDateFormatDB);
};

export const formatStringDate = (
  date?: string,
  parseFormat = parseDateFormat
) => {
  if (!date) return null;
  return format(parse(date, parseDateFormatDB, new Date()), parseFormat);
};

export const parseDateToISOString = (date?: string) => {
  if (!date) return "";
  return format(parseISO(date), parseDateFormat);
};
