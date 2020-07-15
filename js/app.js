const calendar_body = document.getElementById("calendar-body");

const month_today = document.getElementById('today-month');
const month_next = document.getElementById('next-month');
const month_prev = document.getElementById('prev-month');

const cur_month = document.getElementById('cur-month');
const cur_year = document.getElementById('cur-year');

const about_link = document.getElementById('about-link');
const login_link = document.getElementById('login-link');
const signup_link = document.getElementById('signup-link');
const logout_link = document.getElementById('logout-link');
const share_link = document.getElementById('share-calendar');

const new_event = document.getElementById('new-event');

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
    // about
    about_link.addEventListener('click', () => {
        openModal('about');
    });
    // login
    login_link.addEventListener('click', () => {
        openModal('login');
    });
    // sign up
    signup_link.addEventListener('click', () => {
        openModal('signup');
    });
    // share calendar
    share_link.addEventListener('click', () => {
        openModal('share');
    });
    // logout
    logout_link.addEventListener('click', (e) => {
        Ajax.post({logout: true})
            .then(r => {
                // update nav bar
                Navigation.showLoginActions();
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
        if (cell.classList.contains('event-banner')) {
            cell.classList.remove('bg-light');
        }
        cell.classList.add('bg-secondary');
    });
    calendar_body.addEventListener('mouseout', (e) => {
        const cell = e.target;
        cell.classList.remove('bg-secondary');
        if (cell.classList.contains('event-banner')) {
            cell.classList.add('bg-light');
        }
    });
    // click active cell
    calendar_body.addEventListener('mouseup', (e) => {
        const click_target = e.target;
        if (click_target.classList.contains('event-banner')) {
            // event clicked, edit event
            const cell = click_target.parentNode;
            const col = cell.cellIndex;
            const row = cell.parentNode.rowIndex;
            const id = parseInt(click_target.id[3]);
            Ajax.post({check_login: true})
                .then(r => {
                    if (r.status === true) {
                        openModal('editEvent', row, col, id);
                    } else {
                        openModal('pleaseLogin');
                    }
                });
        } else {
            // date clicked, create new event
            const col = click_target.cellIndex;
            const row = click_target.parentNode.rowIndex;
            Ajax.post({check_login: true})
                .then(r => {
                    if (r.status === true) {
                        openModal('addEvent', row, col);
                    } else {
                        openModal('pleaseLogin');
                    }
                });
        }
    });
    new_event.addEventListener('click', (e) => {
        openModal('addEvent', 1, 0);
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
                    Navigation.showLogoutActions();
                } else {
                    Navigation.showLoginActions();
                }
            });
    }, false);
    // set month text
    document.addEventListener("DOMContentLoaded", month.todayMonth, false);

}
