<?php

class Event
{
    private $id;
    private $user_id;
    private $title;
    private $date;
    private $time;
    private $description;

    /**
     * Event constructor.
     * @param $id
     * @param $user_id
     * @param $title
     * @param $date
     * @param $time
     * @param $description
     */
    public function __construct($id, $user_id, $title, $date, $time, $description)
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->title = $title;
        $this->date = $date;
        $this->time = $time;
        $this->description = $description;
    }

    /**
     * Select event
     * @param $user_id
     * @param $date
     * @param $nth
     * @return array
     */
    public static function selectEventByUserDateNth($user_id, $date, $nth)
    {
        return array(self::selectEventByUserDate($user_id, $date)[$nth]);
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
            "SELECT id, user_id, title, date, time, description FROM events WHERE user_id=? AND date=? ORDER BY time");
        $stmt->bind_param('ss', $user_id, $date);
        return self::executeSelect($stmt);
    }

    public static function selectEventByUserDateRange($user_id, $start_date, $end_date)
    {
        global $database;
        $stmt = $database->conn->prepare(
            "SELECT id, user_id, title, date, time, description FROM events WHERE user_id=? AND date BETWEEN ? AND ? ORDER BY time");
        $stmt->bind_param('sss', $user_id, $start_date, $end_date);
        return self::executeSelect($stmt);
    }

    private static function executeSelect($stmt)
    {
        $stmt->execute();
        $id = $user_id = $title = $date = $time = $description = "";
        $stmt->bind_result($id, $user_id, $title, $date, $time, $description);
        $result_array = array();
        while ($stmt->fetch()) {
            $result_array[] = new Event($id, $user_id, $title, $date, $time, $description);
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
        $description = $database->escapeString($description);
        // prepare statement
        $stmt = $database->conn->prepare(
            "INSERT INTO events (user_id, title, date, time, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $user_id, $title, $date, $time, $description);
        $res = $stmt->execute();
        $stmt->close();
        return $res;
    }

    /**
     * Update event
     * @param $id
     * @param $title
     * @param $date
     * @param $time
     * @param $description
     */
    public static function updateEvent($id, $title, $date, $time, $description)
    {
        global $database;
        $title = $database->escapeString($title);
        $description = $database->escapeString($description);
        // prepare statement
        $stmt = $database->conn->prepare(
            "UPDATE events SET title=?, date=?, time=?, description=? WHERE id=?;");
        $stmt->bind_param('sssss', $title, $date, $time, $description, $id);
        $res = $stmt->execute();
        $stmt->close();
        return $res;
    }

    public static function deleteEvent(int $id)
    {
        global $database;
        $stmt = $database->conn->prepare("DELETE FROM events WHERE id=?");
        $stmt->bind_param('s', $id);
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

    /**
     * @return mixed
     */
    public function getTimeMinutes()
    {
        return substr($this->time, 0, 5);
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }


}
