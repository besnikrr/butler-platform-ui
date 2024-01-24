import { MealPeriod, OperatingWeekDays, WEEK_DAYS } from "@butlerhospitality/shared";

const getTimeRange = () => {
  const start = "6:30 AM";
  const end = "11:30 PM";
  const cadence = 30;

  const sTime = new Date();
  const eTime = new Date();

  const splitStart = start.split(/:| /);
  const splitEnd = end.split(/:| /);

  sTime.setHours(splitStart[2] === "AM" ? +splitStart[0] : +splitStart[0] + 12, +splitStart[1] - cadence, 0, 0);
  eTime.setHours(splitEnd[2] === "AM" ? +splitEnd[0] : +splitEnd[0] + 12, +splitEnd[1] - cadence, 0, 0);

  const holder = [];

  while (sTime <= eTime) {
    sTime.setTime(sTime.getTime() + cadence * 60 * 1000);
    let repHours = sTime.getHours();
    const repMinutes = sTime.getMinutes();
    let repDT = "AM";
    if (repHours >= 12) {
      repDT = "PM";
      if (repHours > 12) repHours -= 12;
    }

    holder.push(`${repHours}:${repMinutes == 0 ? "00" : repMinutes} ${repDT}`);
  }

  return holder.map((time) => ({ value: time, key: time, content: time }));
};

const genDefaultOperatingHours = (isActive: boolean, startTime: string, endTime: string, isAvailable: boolean) => {
  const operatingHours: OperatingWeekDays = {
    isAvailable,
  };
  Object.values(WEEK_DAYS).forEach((day) => {
    operatingHours[day] = {
      isActive,
      startTime,
      endTime,
    };
  });
  return operatingHours;
};

const getDefaultOperatingHours = (categories: MealPeriod[]): { [key: string]: { [key: string]: string } } => {
  const result: OperatingWeekDays = {};
  categories.forEach((period: MealPeriod) => {
    if (!MealPeriod[period]) {
      throw new Error(`Provided period/category ${period} does not exist in ${MealPeriod}`);
    }
    switch (period) {
      case MealPeriod.Breakfast:
        result[period] = genDefaultOperatingHours(true, "06:30 AM", "11:30 AM", true);
        break;
      case MealPeriod.Lunch_Dinner:
        result[period] = genDefaultOperatingHours(true, "11:30 AM", "11:30 PM", true);
        break;
      case MealPeriod.Convenience:
        result[period] = genDefaultOperatingHours(true, "06:30 AM", "11:30 PM", true);
        break;
      default:
        result[period] = genDefaultOperatingHours(true, "06:30 AM", "11:30 PM", true);
        break;
    }
  });
  return result;
};

const categoryOrder = ["Breakfast", "Lunch_Dinner", "Convenience"];

export { getTimeRange, getDefaultOperatingHours, categoryOrder };
