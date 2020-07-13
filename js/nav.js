function showLoginActions() {
    login_link.hidden = false;
    signup_link.hidden = false;
    logout_link.hidden = true;
}

function showLogoutActions() {
    login_link.hidden = true;
    signup_link.hidden = true;
    logout_link.hidden = false;
}