export const generateRecurringDates = (
    startDate: string,
    frequencyDays: number,
    durationLimitDays = 90
  ): string[] => {
    const result: string[] = [];
  
    // Defensive: check for valid startDate and frequencyDays
    if (!startDate || isNaN(new Date(startDate).getTime()) || !frequencyDays) {
      return result;
    }
  
    const start = new Date(startDate);
    const limit = new Date(start);
    limit.setDate(start.getDate() + durationLimitDays);
  
    while (start <= limit) {
      if (!isNaN(start.getTime())) {
        result.push(new Date(start).toISOString().split("T")[0]);
      }
      start.setDate(start.getDate() + frequencyDays);
    }
  
    return result;
  };
