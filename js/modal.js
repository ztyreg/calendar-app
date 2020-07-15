const modal = document.getElementById('modal');
const modal_title = document.getElementById('modalLabel');
const modal_body = document.getElementById('modalBody');
const modal_footer = document.getElementById('modalFooter');

function openModal(type, ...args) {
    $("#modal").modal("toggle")
    switch (type) {
        case 'about':
            about();
            break;
        case 'share':
            share();
            break;
        case 'addEvent':
            addEvent(args[0], args[1]);
            break;
        case 'editEvent':
            editEvent(args[0], args[1], args[2]);
            break;
        case 'login':
            login();
            break;
        case 'signup':
            signup();
            break;
        case 'pleaseLogin':
            pleaseLogin();
            break;
        default:
            emptyModal();
            break;
    }
}

function share() {
    modal_title.innerText = 'Share Calendar';
    modal_body.innerHTML = `
    <div class="form-group">
      <label for="share-username">Who do you want to share with?</label>
      <input type="password" class="form-control" name="password" id="share-username" placeholder="Enter their username">
    </div>
    <div class="alert alert-primary" role="alert" id="alert" hidden></div>
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <input type="submit" id="share-submit" class="btn btn-primary" value="Submit"/>
    `;
    const submit_button = document.getElementById('share-submit');
    const alert_banner = document.getElementById('alert');
    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        const share_username = document.getElementById('share-username').value;
        // post login request
        Ajax.post({share_username})
            .then(r => {
                if (r.status === false) {
                    // login error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // hide modal
                    $('#modal').modal('hide');
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });
    });
}

function about() {
    modal_title.innerText = 'About';
    modal_body.innerHTML = `
This is a web calendar app.
<ul>
<li>To create an account, click on <strong>sign up</strong></li>
<li> To create an event, click on the cell
<li> To edit an event, click on the event title
<li> To share you calendar, click on actions -> share</li>
</ul>
Tester accounts: 
<ol>
<li>Username: 222 (password: 222)</li>
<li>Username: 333 (password: 333)</li>
</ol>
    © Ethan Zheng 2020 All Rights Reserved
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>
    `;
}

function pleaseLogin() {
    modal_title.innerText = 'Please login';
    modal_body.innerHTML = `
    Please login to edit events!
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>
    `;
}

function login() {
    modal_title.innerText = 'Login';
    modal_body.innerHTML = `
    <div class="form-group">
      <label for="login-username">Username</label>
      <input type="text" class="form-control" name="username" id="login-username" placeholder="Enter username">
    </div>
    <div class="form-group">
      <label for="login-password">Password</label>
      <input type="password" class="form-control" name="password" id="login-password" placeholder="Enter password">
    </div>
    <div class="alert alert-primary" role="alert" id="alert" hidden></div>
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <input type="submit" id="login-submit" class="btn btn-primary" value="Submit"/>
    `;

    const submit_button = document.getElementById('login-submit');
    const alert_banner = document.getElementById('alert');
    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        const login_username = document.getElementById('login-username').value;
        const login_password = document.getElementById('login-password').value;
        // post login request
        Ajax.post({login_username, login_password})
            .then(r => {
                if (r.status === false) {
                    // login error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // login successful
                    // hide modal
                    $('#modal').modal('hide');
                    // update nav bar
                    Navigation.showLogoutActions();
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });
    });
}

function signup() {
    modal_title.innerText = 'Sign Up';
    modal_body.innerHTML = `
    <div class="form-group">
      <label for="signup-username">Username</label>
      <input type="text" class="form-control" id="signup-username" placeholder="Enter username" required>
    </div>
    <div class="form-group">
      <label for="signup-password">Password</label>
      <input type="password" class="form-control" id="signup-password" placeholder="Enter password">
    </div>
    <div class="alert alert-primary" role="alert" id="alert" hidden></div>
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <input type="submit" id="signup-submit" class="btn btn-primary" value="Submit"/>
    `;

    const submit_button = document.getElementById('signup-submit');
    const alert_banner = document.getElementById('alert');
    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        const signup_username = document.getElementById('signup-username').value;
        const signup_password = document.getElementById('signup-password').value;
        // post sign-up request
        Ajax.post({signup_username, signup_password})
            .then(r => {
                if (r.status === false) {
                    // sign-up error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // successful
                    $('#modal').modal('hide');
                }
            });
    });
}

function emptyModal() {
    modal_title.innerText = '';
    modal_body.innerHTML = '';
    modal_footer.innerHTML = '';
}

function addEvent(row, col) {
    modal_title.innerText = 'New Event';
    modal_body.innerHTML = `<form>
  <fieldset>
    <div class="form-group">
      <label for="event-title">Title</label>
      <input type="text" class="form-control" id="event-title" placeholder="Enter title">
    </div>
    <div class="form-group">
      <label for="event-date">Date</label>
      <input type="date" class="form-control" id="event-date" placeholder="">
    </div>
    <div class="form-group">
      <label for="event-time">Time</label>
      <input type="time" class="form-control" id="event-time" placeholder="">
    </div>
    <div class="form-group">
      <label for="event-description">Description (optional)</label>
      <textarea class="form-control" id="event-description" rows="3"></textarea>
    </div>
    <div class="alert alert-primary" role="alert" id="alert" hidden></div>
</form>`;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <input type="submit" id="newevent-submit" class="btn btn-primary" value="Submit"/>
    `;
    const submit_button = document.getElementById('newevent-submit');
    const alert_banner = document.getElementById('alert');
    // auto fill date
    let date_clicked;
    date_clicked = Calendar.addDayArr(Calendar.firstMonday(month.date_object), row, col);
    document.getElementById('event-date').valueAsDate = date_clicked;
    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        // get form values
        const event_title = document.getElementById('event-title').value;
        const event_date = document.getElementById('event-date').value;
        const event_time = document.getElementById('event-time').value;
        const event_description = document.getElementById('event-description').value;
        // form validation
        if (!event_title || !event_date || !event_time) {
            // field empty
            if (!event_title) {
                alert_banner.innerText = `Error: Title cannot be empty`;
            } else if (!event_date) {
                alert_banner.innerText = `Error: Date cannot be empty`;
            } else if (!event_time) {
                alert_banner.innerText = `Error: Time cannot be empty`;
            }
            alert_banner.hidden = false;
            setTimeout(() => {
                alert_banner.hidden = true
            }, 3000);
            return;
        }
        // post new event request
        Ajax.post({new_event: true, event_title, event_date, event_time, event_description})
            .then(r => {
                if (r.status === false) {
                    // error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // successful
                    $('#modal').modal('hide');
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });
    });
}

function editEvent(row, col, nth) {
    modal_title.innerText = 'Edit Event';
    modal_body.innerHTML = `<form>
  <fieldset>
    <div class="form-group">
      <label for="event-title">Title</label>
      <input type="text" class="form-control" id="event-title" placeholder="Enter title">
    </div>
    <div class="form-group">
      <label for="event-date">Date</label>
      <input type="date" class="form-control" id="event-date" placeholder="">
    </div>
    <div class="form-group">
      <label for="event-time">Time</label>
      <input type="time" class="form-control" id="event-time" placeholder="">
    </div>
    <div class="form-group">
      <label for="event-description">Description (optional)</label>
      <textarea class="form-control" id="event-description" rows="3"></textarea>
    </div>
    <div class="form-group">
    <div class="alert alert-primary" role="alert" id="alert" hidden></div>
</form>`;
    modal_footer.innerHTML = `
    <button class="btn btn-outline-danger mr-auto" id="editevent-delete">Delete</button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <input type="submit" id="editevent-submit" class="btn btn-primary" value="Submit"/>
    `;
    const submit_button = document.getElementById('editevent-submit');
    const delete_button = document.getElementById('editevent-delete');
    const alert_banner = document.getElementById('alert');
    // auto fill date
    let date_clicked;
    date_clicked = Calendar.addDayArr(Calendar.firstMonday(month.date_object), row, col);
    const event_title_input = document.getElementById('event-title');
    const event_date_input = document.getElementById('event-date');
    const event_time_input = document.getElementById('event-time');
    const event_description_input = document.getElementById('event-description');
    event_date_input.valueAsDate = date_clicked;
    const event_date = document.getElementById('event-date').value;
    // get event details
    Ajax.post({select_event_date_nth: true, event_date, nth})
        .then(r => {
            event_title_input.value = Html.htmlDecode(r.title);
            event_time_input.value = r.time;
            event_description_input.value = Html.htmlDecode(r.description);
        });
    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        // get form values
        const event_title = document.getElementById('event-title').value;
        const new_event_date = document.getElementById('event-date').value;
        const event_time = document.getElementById('event-time').value;
        const event_description = document.getElementById('event-description').value;
        // form validation
        if (!event_title || !new_event_date || !event_time) {
            // field empty
            if (!event_title) {
                alert_banner.innerText = `Error: Title cannot be empty`;
            } else if (!new_event_date) {
                alert_banner.innerText = `Error: Date cannot be empty`;
            } else if (!event_time) {
                alert_banner.innerText = `Error: Time cannot be empty`;
            }
            alert_banner.hidden = false;
            setTimeout(() => {
                alert_banner.hidden = true
            }, 3000);
            return;
        }
        // post new event request
        Ajax.post({
            update_event: true,
            nth, new_event_date, event_title, event_date, event_time, event_description
        })
            .then(r => {
                if (r.status === false) {
                    // error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // successful
                    $('#modal').modal('hide');
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });
    });
    delete_button.addEventListener('click', (e) => {
        e.preventDefault();
        // post new event request
        Ajax.post({delete_event: true, nth, event_date})
            .then(r => {
                if (r.status === false) {
                    // error
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // successful
                    $('#modal').modal('hide');
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });

    });
}
