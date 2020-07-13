class Month {

    months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    constructor() {
        this.calendar_date = new Date();
        this.changeMonth = () => {
            calendar_body.innerHTML = getCalendar(this.calendar_date);
            cur_month.innerText = this.month;
            cur_year.innerText = this.year;
        };
        this.todayMonth = () => {
            this.calendar_date = new Date();
            this.changeMonth();
        };
        this.nextMonth = () => {
            let lastMonth = this.calendar_date.getMonth() === 11;
            let nextYear = lastMonth ? this.calendar_date.getFullYear() + 1 : this.calendar_date.getFullYear();
            let nextMonth = lastMonth ? 0 : this.calendar_date.getMonth() + 1;
            this.calendar_date = new Date(nextYear, nextMonth);
            this.changeMonth();
        }
        this.prevMonth = () => {
            let firstMonth = this.calendar_date.getMonth() === 0;
            let prevYear = firstMonth ? this.calendar_date.getFullYear() - 1 : this.calendar_date.getFullYear();
            let prevMonth = firstMonth ? 11 : this.calendar_date.getMonth() - 1;
            this.calendar_date = new Date(prevYear, prevMonth);
            this.changeMonth();
        }
    }

    get year() {
        return this.calendar_date.getFullYear();
    }

    get month() {
        return this.months[this.calendar_date.getMonth()];
    }

}