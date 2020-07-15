class Calendar {

    static NUM_CALENDAR_DATES = 7 * 6;
    static DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

    constructor() {
    }

    /**
     * Get calendar HTML
     * @param date
     * @param calendar
     */
    static getCalendar(date, calendar) {
        // check login status
        Ajax.post({check_login: true})
            .then(r => {
                // get calendar element
                // the first cell is first monday
                let cur_date = Calendar.firstMonday(date);
                if (r.status === true) {
                    // if logged in, show events
                    // post current start and end date
                    Ajax.post({
                        event_start_date: Calendar.formatDate(Calendar.firstMonday(date)),
                        event_end_date: Calendar.formatDate(Calendar.addDay(date, Calendar.NUM_CALENDAR_DATES - 1))
                    })
                        // get events in the date range
                        .then(events => {
                            Calendar.buildCalendar(events, calendar, cur_date);
                        });
                } else {
                    // if not logged in, only show dates
                    for (let i = 1; i < 7; i++) {
                        // skip table title
                        for (let j = 0; j < 7; j++) {
                            // print date
                            calendar.rows[i].cells[j].innerHTML = cur_date.getDate().toString();
                            // next date
                            cur_date = Calendar.addDay(cur_date, 1);
                        }
                    }
                }
            });
    }

    static viewCalendar(date, calendar, username) {
        // the first cell is first monday
        let cur_date = Calendar.firstMonday(date);
        // post current start and end date
        Ajax.post({
            view_calendar: true,
            username,
            event_start_date: Calendar.formatDate(Calendar.firstMonday(date)),
            event_end_date: Calendar.formatDate(Calendar.addDay(date, Calendar.NUM_CALENDAR_DATES - 1))
        })
            // get events in the date range
            .then(events => {
                Calendar.buildCalendar(events, calendar, cur_date);
            });
    }

    static buildCalendar(events, calendar, cur_date) {
        for (let i = 1; i < 7; i++) {
            // skip table title
            for (let j = 0; j < 7; j++) {
                // print date
                let daily = cur_date.getDate().toString();
                // add events
                // 1. first filter events of the day
                let events_of_day = events.filter(event => {
                    if (event.hasOwnProperty('date')) {
                        return event.date === Calendar.formatDate(cur_date);
                    }
                });
                // 2. then append to cell
                events_of_day.forEach((event, index) => {
                    daily += `<div class="event-banner bg-light" id="evt${index}">&bull; ${event.title}</div>`;
                });
                // show cell content
                calendar.rows[i].cells[j].innerHTML = daily;
                // next date
                cur_date = Calendar.addDay(cur_date, 1);
            }
        }
    }

    /**
     * Return date format used in MySQL
     * @param date
     * @returns {string}
     */
    static formatDate(date) {
        return date.toISOString().slice(0, 10);
    }

    /**
     * Get date of first Monday before 1st
     * @param date
     * @returns {Date}
     */
    static firstMonday(date) {
        const first_day_of_month = new Date(date.getFullYear(), date.getMonth(), 1);
        return new Date(first_day_of_month.getTime() -
            (first_day_of_month.getDay() - 1) * Calendar.DAY_IN_MILLISECONDS);
    }

    /**
     * Returns the number of days in a month
     * 1 indexed
     * @param month
     * @param year
     * @returns {number}
     */
    static daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    static lastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    static addDay(date, n) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
    }

    static addDayArr(date, row, col) {
        const n = (row - 1) * 7 + col;
        return Calendar.addDay(date, n);
    }


}
