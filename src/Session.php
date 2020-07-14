<?php

class Session
{
    function __construct()
    {
        // prevent cookies from being read by JS
        ini_set("session.cookie_httponly", 1);

        session_start();

        // check use agent consistency
        $previous_ua = @$_SESSION['useragent'];
        $current_ua = $_SERVER['HTTP_USER_AGENT'];
        if (isset($_SESSION['useragent']) && $previous_ua !== $current_ua) {
            die("Session hijack detected");
        } else {
            $_SESSION['useragent'] = $current_ua;
        }
    }

    /**
     * Login user
     * @param int $user_id
     */
    public function login(int $user_id)
    {
        if ($user_id) {
            // login
            $_SESSION['user_id'] = $user_id;
            // generate CSRF token
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
        }
    }

    /**
     * Logout user
     */
    public function logout()
    {
        unset($_SESSION['user_id']);
        unset($_SESSION['token']);
    }

    /**
     * Verify session CSRF token
     * @param string $token
     * @return bool
     */
    public function verifyToken(string $token)
    {
        if (!hash_equals($token, $_SESSION['token'])) {
            die("Request forgery detected");
        }
        return true;
    }

    /**
     * Return login status
     * @return bool
     */
    public function checkLogin()
    {
        return isset($_SESSION['user_id']);
    }

    /**
     * Get session CSRF token
     * @return string
     */
    public function getToken(): string
    {
        return $_SESSION['token'];
    }

    /**
     * Get user id
     * @return mixed
     */
    public function getUserId()
    {
        return $_SESSION['user_id'];
    }

}

$session = new Session();