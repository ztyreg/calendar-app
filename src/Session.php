<?php

class Session
{
    function __construct()
    {
        session_start();
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
    public function isSignedIn()
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