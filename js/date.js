/**
 * Get date of first Monday before 1st
 * @param date
 * @returns {Date}
 */
function firstMonday(date) {
    const first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
    return new Date(first_day_of_month.getTime() - (first_day_of_month.getDay() - 1) * DAY_IN_MILLISECONDS);
}