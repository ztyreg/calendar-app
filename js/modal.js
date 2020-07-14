const modal = document.getElementById('modal');
const modal_title = document.getElementById('modalLabel');
const modal_body = document.getElementById('modalBody');
const modal_footer = document.getElementById('modalFooter');

function openModal(type, ...args) {
    $("#modal").modal("toggle")
    switch (type) {
        case 'addEvent':
            addEvent(args);
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

function pleaseLogin() {
    modal_title.innerText = 'Please login';
    modal_body.innerHTML = `
    Please login to edit events!
    `;
    modal_footer.innerHTML = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-primary" data-dismiss="modal">Confirm</button>
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
        const login_username = document.getElementById('login-username').value;
        const login_password = document.getElementById('login-password').value;
        // post login request
        Ajax.post({login_username, login_password})
            .then(r => {
                if (r.status === false) {
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    // hide modal
                    $('#modal').modal('hide');
                    // update nav bar
                    showLogoutActions();
                    // update calendar
                    Calendar.getCalendar(month.date_object);
                }
            });
        e.preventDefault();
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
        const signup_username = document.getElementById('signup-username').value;
        const signup_password = document.getElementById('signup-password').value;
        // post sign-up request
        Ajax.post({signup_username, signup_password})
            .then(r => {
                if (r.status === false) {
                    alert_banner.innerText = `Error: ${r.message}`;
                    alert_banner.hidden = false;
                    setTimeout(() => {
                        alert_banner.hidden = true
                    }, 3000);
                } else {
                    $('#modal').modal('hide');
                }
            });
        e.preventDefault();
    });
}

function emptyModal() {
    modal_title.innerText = '';
    modal_body.innerHTML = '';
    modal_footer.innerHTML = '';
}

function addEvent(args) {
    console.log(args);
    modal_title.innerText = 'New Event';
    modal_body.innerHTML = `<form>
  <fieldset>
    <div class="form-group">
      <label for="exampleInputEmail1">Title</label>
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>

    <div class="form-group">
      <label for="exampleTextarea">Example textarea</label>
      <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
    </div>
</form>`;
}
