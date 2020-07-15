class Navigation {

    static showLoginActions() {
        login_link.hidden = false;
        signup_link.hidden = false;
        logout_link.hidden = true;
        shared_withme.innerText = '';
    }

    static showLogoutActions() {
        login_link.hidden = true;
        signup_link.hidden = true;
        logout_link.hidden = false;
        showSharedCalendars();
    }
}
