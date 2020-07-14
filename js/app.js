const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const calendar_body = document.getElementById("calendar-body");

const month_today = document.getElementById('today-month');
const month_next = document.getElementById('next-month');
const month_prev = document.getElementById('prev-month');

const cur_month = document.getElementById('cur-month');
const cur_year = document.getElementById('cur-year');

const login_link = document.getElementById('login-link');
const signup_link = document.getElementById('signup-link');
const logout_link = document.getElementById('logout-link');

// object to keep track of current month
const month = new Month();

loadDocumentListeners();
loadMonthListeners();
loadNavigationListeners();
loadCalendarListeners();

/**
 * Change month listeners
 */
function loadMonthListeners() {
    // today button
    month_today.addEventListener('click', month.todayMonth);
    // next button
    month_next.addEventListener('click', month.nextMonth);
    // previous button
    month_prev.addEventListener('click', month.prevMonth);
}


/**
 * Navigation bar listeners
 */
function loadNavigationListeners() {
    // login
    login_link.addEventListener('click', () => {
        openModal('login');
    });
    // sign up
    signup_link.addEventListener('click', () => {
        openModal('signup');
    });
    // logout
    logout_link.addEventListener('click', (e) => {
        Ajax.post({logout: true})
            .then(r => {
                // update nav bar
                showLoginActions();
                // update calendar
                Calendar.getCalendar(month.date_object);
            });
        e.preventDefault();
    });
}


/**
 * Calendar listeners
 */
function loadCalendarListeners() {
    // show active cell
    calendar_body.addEventListener('mouseover', (e) => {
        const cell = e.target;
        cell.classList.add('bg-secondary');
    });
    calendar_body.addEventListener('mouseout', (e) => {
        const cell = e.target;
        cell.classList.remove('bg-secondary');
    });
    // click active cell
    calendar_body.addEventListener('mouseup', (e) => {
        const cell = e.target;
        const col = cell.cellIndex;
        const row = cell.parentNode.rowIndex;
        Ajax.post({check_login: true})
            .then(r => {
                if (r.status === true) {
                    openModal('addEvent', col, row);
                } else {
                    openModal('pleaseLogin');
                }
            });
    });
}


/**
 * Document listeners
 */
function loadDocumentListeners() {
    // check login
    document.addEventListener("DOMContentLoaded", () => {
        Ajax.post({check_login: true})
            .then(r => {
                if (r.status === true) {
                    showLogoutActions();
                } else {
                    showLoginActions();
                }
            });
    }, false);
    // set month text
    document.addEventListener("DOMContentLoaded", month.todayMonth, false);

}
