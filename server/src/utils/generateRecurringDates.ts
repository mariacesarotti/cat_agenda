export const generateRecurringDates = (
    startDate: string,
    frequencyDays: number,
    durationLimitDays = 90
  ): string[] => {
    const result: string[] = [];
  
    const start = new Date(startDate);
    const limit = new Date(start);
    limit.setDate(start.getDate() + durationLimitDays);
  
    while (start <= limit) {
      result.push(new Date(start).toISOString().split("T")[0]);
      start.setDate(start.getDate() + frequencyDays);
    }
  
    return result;
  };
  