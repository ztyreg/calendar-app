<?php

require_once("myconfig.php");

class Database
{
    public $conn;

    function __construct()
    {
        $this->openDb();
    }

    /**
     * Open db connection
     */
    public function openDb()
    {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        if ($this->conn->connect_errno) {
            die("Database connection failed badly" . $this->conn->connect_error);
        }
    }

    /**
     * Escape input
     * @param $string
     * @return mixed
     */
    public function escapeString($string)
    {
        return $this->conn->real_escape_string($string);
    }

}

$database = new Database();

