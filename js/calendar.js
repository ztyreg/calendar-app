class Calendar {

    constructor() {
    }

    /**
     * Get calendar HTML
     * @param date
     */
    static getCalendar(date) {
        Ajax.post({check_login: true})
            .then(r => {
                let calendar = document.getElementById('calendar');
                // the first cell is first monday
                let cur_date = firstMonday(date);
                if (r.status === true) {
                    Ajax.post({event_date: Calendar.formatDate(new Date())}).then(events => {
                        let daily = cur_date.getDate().toString();
                        events.forEach((value) => {
                            console.log(value);
                            daily += `<br>${value.title}`;
                        });
                        calendar.rows[1].cells[0].innerHTML = daily;
                    });
                    for (let i = 0; i < 6; i++) {
                        // skip table title
                        for (let j = 0; j < 7; j++) {
                            // next date
                            cur_date = new Date(cur_date.getTime() + DAY_IN_MILLISECONDS);
                        }
                    }
                } else {
                    for (let i = 1; i < 7; i++) {
                        // skip table title
                        for (let j = 0; j < 7; j++) {
                            calendar.rows[i].cells[j].innerHTML = cur_date.getDate().toString();
                            // next date
                            cur_date = new Date(cur_date.getTime() + DAY_IN_MILLISECONDS);
                        }
                    }
                }
            });

    }

    /**
     * Format date to that used in MySQL
     * @param date
     * @returns {string}
     */
    static formatDate(date) {
        return date.getFullYear() + '-' +
            (date.getMonth() < 9 ? '0' : '') +
            (date.getMonth() + 1) + '-' +
            date.getDate();
    }


}
