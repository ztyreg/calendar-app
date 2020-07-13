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

let month = new Month();

loadEventListeners();

calendar_body.addEventListener('mouseup', (e) => {
    const cell = e.target;
    const col = cell.cellIndex;
    const row = cell.parentNode.rowIndex;
    openModal('addEvent', col, row);
});

calendar_body.addEventListener('mouseover', (e) => {
    const cell = e.target;
    cell.classList.add('bg-light');
});

calendar_body.addEventListener('mouseout', (e) => {
    const cell = e.target;
    cell.classList.remove('bg-light');
});


function loadEventListeners() {
    document.addEventListener("DOMContentLoaded", checkLogin, false);
    document.addEventListener("DOMContentLoaded", month.todayMonth, false);
    month_today.addEventListener('click', month.todayMonth);
    month_next.addEventListener('click', month.nextMonth);
    month_prev.addEventListener('click', month.prevMonth);
    login_link.addEventListener('click', () => {
        openModal('login');
    });
    signup_link.addEventListener('click', () => {
        openModal('signup');
    });
    logout_link.addEventListener('click', (e) => {
        Ajax.post({logout: true})
            .then(r => {
                showLoginActions();
            });
        e.preventDefault();
    });
}

function checkLogin() {
    Ajax.post({check_login: true})
        .then(r => {
            if (r.status === true) {
                showLogoutActions();
            } else {
                showLoginActions();
            }
        });
}