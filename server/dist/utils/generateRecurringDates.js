"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecurringDates = void 0;
const generateRecurringDates = (startDate, frequencyDays, durationLimitDays = 90) => {
    const result = [];
    const start = new Date(startDate);
    const limit = new Date(start);
    limit.setDate(start.getDate() + durationLimitDays);
    while (start <= limit) {
        result.push(new Date(start).toISOString().split("T")[0]);
        start.setDate(start.getDate() + frequencyDays);
    }
    return result;
};
exports.generateRecurringDates = generateRecurringDates;
