<?php

class Event
{
    private $id;
    private $user_id;
    private $title;
    private $date;
    private $time;

    /**
     * Event constructor.
     * @param $id
     * @param $user_id
     * @param $title
     * @param $date
     * @param $time
     */
    public function __construct($id, $user_id, $title, $date, $time)
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->title = $title;
        $this->date = $date;
        $this->time = $time;
    }


    /**
     * Select event
     * @param $user_id
     * @param $date
     * @return array
     */
    public static function selectEventByUserDate($user_id, $date)
    {
        global $database;
        $stmt = $database->conn->prepare(
            "SELECT id, user_id, title, date, time FROM events WHERE user_id=? AND date=? ORDER BY time");
        $stmt->bind_param('ss', $user_id, $date);
        return self::executeSelect($stmt);
    }

    public static function selectEventByUserDateRange($user_id, $start_date, $end_date)
    {
        global $database;
        $stmt = $database->conn->prepare(
            "SELECT id, user_id, title, date, time FROM events WHERE user_id=? AND date BETWEEN ? AND ? ORDER BY time");
        $stmt->bind_param('sss', $user_id, $start_date, $end_date);
        return self::executeSelect($stmt);
    }

    private static function executeSelect($stmt)
    {
        $stmt->execute();
        $id = $user_id = $title = $date = $time = "";
        $stmt->bind_result($id, $user_id, $title, $date, $time);
        $result_array = array();
        while ($stmt->fetch()) {
            $result_array[] = new Event($id, $user_id, $title, $date, $time);
        }
        $stmt->close();
        return $result_array;
    }


    /**
     * Create event
     * @param $user_id
     * @param $title
     * @param $date
     * @param $time
     * @param $description
     * @return mixed execution status
     */
    public static function createEvent($user_id, $title, $date, $time, $description)
    {
        global $database;
        $title = $database->escapeString($title);
        // prepare statement
        $stmt = $database->conn->prepare(
            "INSERT INTO events (user_id, title, date, time, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $user_id, $title, $date, $time, $description);
        return $stmt->execute();
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
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return htmlentities($this->title);
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @return mixed
     */
    public function getTime()
    {
        return $this->time;
    }


}
