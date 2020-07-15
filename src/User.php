<?php

class User
{
    private $id;
    private $username;
    private $password;

    /**
     * User constructor.
     * @param $id
     * @param $username
     * @param $password
     */
    public function __construct($id, $username, $password)
    {
        $this->id = $id;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * @param $id
     * @return string username
     */
    public static function findUsernameFromId($id)
    {
        return User::selectUserById($id)[0]->getUsername();
    }

    /**
     * Select user
     * @param $id
     * @return array of User
     */
    public static function selectUserById($id)
    {
        global $database;
        $stmt = $database->conn->prepare("SELECT id, username, password FROM users WHERE id=?");
        $stmt->bind_param('i', $id);
        return self::executeSelect($stmt);
    }

    public static function selectUserByUsername($username)
    {
        global $database;
        $stmt = $database->conn->prepare("SELECT id, username, password FROM users WHERE username=?");
        $stmt->bind_param('s', $username);
        return self::executeSelect($stmt);
    }

    private static function executeSelect($stmt)
    {
        $stmt->execute();
        $id = $username = $password = "";
        $stmt->bind_result($id, $username, $password);
        $result_array = array();
        while ($stmt->fetch()) {
            $result_array[] = new User($id, $username, $password);
        }
        $stmt->close();
        return $result_array;
    }

    /**
     * Check if user exists
     * @param $username
     * @param $password
     * @return bool|string user id string or false if user does not exist
     */
    public static function verifyUser($username, $password)
    {
        global $database;
        // escape input
        $username = $database->escapeString($username);
        $password = $database->escapeString($password);
        // prepare statement
        $stmt = $database->conn->prepare("SELECT COUNT(*), id, password FROM users WHERE username=?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $cnt = $db_user_id = $db_password = "";
        $stmt->bind_result($cnt, $db_user_id, $db_password);
        $stmt->fetch();
        $stmt->close();
        if ($cnt == 1 && password_verify($password, $db_password)) {
            // Login succeeded!
            return $db_user_id;
        } else {
            // Login failed; redirect back to the login screen
            return false;
        }
    }

    /**
     * Create user
     * @param $username
     * @param $password
     * @return mixed execution status
     */
    public static function createUser($username, $password)
    {
        global $database;
        $username = $database->escapeString($username);
        $password = $database->escapeString($password);
        $password = password_hash($password, PASSWORD_DEFAULT);
        // prepare statement
        $stmt = $database->conn->prepare("INSERT INTO users (username, password) values (?, ?)");
        $stmt->bind_param('ss', $username, $password);
        $res = $stmt->execute();
        $stmt->close();
        return $res;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return htmlentities($this->username);
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }


}
