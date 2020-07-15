<?php

class SharedCalendar
{
    private $owner_user_id;
    private $shared_user_id;

    /**
     * SharedCalendar constructor.
     * @param $owner_user_id
     * @param $shared_user_id
     */
    public function __construct($owner_user_id, $shared_user_id)
    {
        $this->owner_user_id = $owner_user_id;
        $this->shared_user_id = $shared_user_id;
    }

    public static function selectSharedCalendarBySharedUserId($shared_user_id)
    {
        global $database;
        $stmt = $database->conn->prepare(
            "SELECT owner_user_id, shared_user_id FROM shared_calendars WHERE shared_user_id=?");
        $stmt->bind_param('s', $shared_user_id);
        return self::executeSelect($stmt);
    }

    private static function executeSelect($stmt)
    {
        $stmt->execute();
        $owner_user_id = $shared_user_id = "";
        $stmt->bind_result($owner_user_id, $shared_user_id);
        $result_array = array();
        while ($stmt->fetch()) {
            $result_array[] = new SharedCalendar($owner_user_id, $shared_user_id);
        }
        $stmt->close();
        return $result_array;
    }

    public static function createSharedCalendar($owner_user_id, $shared_user_id)
    {
        global $database;
        // prepare statement
        $stmt = $database->conn->prepare("INSERT INTO shared_calendars (owner_user_id, shared_user_id) values (?, ?)");
        $stmt->bind_param('ss', $owner_user_id, $shared_user_id);
        $res = $stmt->execute();
        $stmt->close();
        return $res;
    }

    /**
     * @return mixed
     */
    public function getOwnerUserId()
    {
        return $this->owner_user_id;
    }

    /**
     * @return mixed
     */
    public function getSharedUserId()
    {
        return $this->shared_user_id;
    }

}