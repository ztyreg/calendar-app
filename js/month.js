class Month {

    months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    constructor() {
        // set date to first day of month
        this.cur_month = new Date(new Date().getFullYear(), new Date().getMonth());
        /**
         * Update month text
         */
        this.changeMonth = () => {
            Calendar.getCalendar(this.cur_month);
            cur_month.innerText = this.month;
            cur_year.innerText = this.year.toString();
        };
        /**
         * Change month to today
         */
        this.todayMonth = () => {
            this.cur_month = new Date(new Date().getFullYear(), new Date().getMonth());
            this.changeMonth();
        };
        /**
         * Change to next month
         */
        this.nextMonth = () => {
            let lastMonth = this.cur_month.getMonth() === 11;
            let nextYear = lastMonth ? this.cur_month.getFullYear() + 1 : this.cur_month.getFullYear();
            let nextMonth = lastMonth ? 0 : this.cur_month.getMonth() + 1;
            this.cur_month = new Date(nextYear, nextMonth);
            this.changeMonth();
        }
        /**
         * Change to previous month
         */
        this.prevMonth = () => {
            let firstMonth = this.cur_month.getMonth() === 0;
            let prevYear = firstMonth ? this.cur_month.getFullYear() - 1 : this.cur_month.getFullYear();
            let prevMonth = firstMonth ? 11 : this.cur_month.getMonth() - 1;
            this.cur_month = new Date(prevYear, prevMonth);
            this.changeMonth();
        }
    }

    get year() {
        return this.cur_month.getFullYear();
    }

    get month() {
        return this.months[this.cur_month.getMonth()];
    }

    get date_object() {
        return this.cur_month;
    }

}