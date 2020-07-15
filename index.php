<?php
require_once('src/header.php');


// Get POST data in JSON format
$data = json_decode(file_get_contents('php://input'), true);

// get events in a range of days
if (isset($data['view_calendar'])) {
    $username = $data['username'];
    $start_date = $data['event_start_date'];
    $end_date = $data['event_end_date'];
    $response = [];
    $user_id = User::findIdByUsername($username);
    $events = Event::selectEventByUserDateRange($user_id, $start_date, $end_date);
    foreach ($events as $event) {
        $event_arr = [];
        $event_arr['date'] = $event->getDate();
        $event_arr['title'] = $event->getTitle();
        $event_arr['time'] = $event->getTime();
        $response[] = $event_arr;
    }
    respondJson($response);
}

if (isset($data['select_shared_calendars'])) {
    $response = [];
    $shared_calendars = SharedCalendar::selectSharedCalendarBySharedUserId($session->getUserId());
    $shared_arr = array();
    foreach ($shared_calendars as $shared_calendar) {
        $shared_arr[] = User::findUsernameById($shared_calendar->getOwnerUserId());
    }
    if (empty($shared_arr)) {
        $response = ['status' => false];
    } else {
        $response = ['status' => true, 'shared_calendars' => $shared_arr];
    }
    respondJson($response);
}

// share calendar
if (isset($data['share_username'])) {
    $response = [];
    $share_username = $data['share_username'];
    $owner_user = User::selectUserById($session->getUserId());
    $shared_user = User::selectUserByUsername($share_username);
    if (empty($shared_user)) {
        $response = ['status' => false, 'message' => 'User does not exist'];
    } else {
        $owner_user_id = $owner_user[0]->getId();
        $shared_user_id = $shared_user[0]->getId();
        if ($owner_user_id == $shared_user_id) {
            $response = ['status' => false, 'message' => 'Cannot share calendar with yourself'];
        } else {
            $status = SharedCalendar::createSharedCalendar($owner_user_id, $shared_user_id);
            if ($status) {
                $response = ['status' => true];
            } else {
                $response = ['status' => false, 'message' => 'Failed to share calendar'];
            }
        }
    }
    respondJson($response);
}

// delete event
if (isset($data['delete_event'])) {
    $nth = $data['nth'];
    $event_date = $data['event_date'];
    $event = Event::selectEventByUserDateNth($session->getUserId(), $event_date, $nth)[0];
    $event_id = $event->getId();
    $status = Event::deleteEvent($event_id);
    $response = [];
    if ($status) {
        $response = ['status' => true];
    } else {
        $response = ['status' => false, 'message' => 'Failed to delete event'];
    }
    respondJson($response);
}

// update event
if (isset($data['update_event'])) {
    $nth = $data['nth'];
    $new_event_date = $data['new_event_date'];
    $event_title = $data['event_title'];
    $event_date = $data['event_date'];
    $event_time = $data['event_time'];
    $event_description = $data['event_description'];
    $event = Event::selectEventByUserDateNth($session->getUserId(), $event_date, $nth)[0];
    $event_id = $event->getId();
    $response = [];
    if (empty($event_title)) {
        $response = ['status' => false, 'message' => 'Title cannot be empty!'];
    } elseif (empty($event_date)) {
        $response = ['status' => false, 'message' => 'Date cannot be empty!'];
    } elseif (empty($event_time)) {
        $response = ['status' => false, 'message' => 'Time cannot be empty!'];
    } else {
        $status = Event::updateEvent(
            $event_id, $event_title, $new_event_date, $event_time, $event_description);
        if ($status) {
            $response = ['status' => true];
        } else {
            $response = ['status' => false, 'message' => 'Failed to update event'];
        }
    }
    respondJson($response);
}

// edit event
if (isset($data['select_event_date_nth'])) {
    $event_date = $data['event_date'];
    $nth = $data['nth'];
    $response = [];
    $events = Event::selectEventByUserDateNth($session->getUserId(), $event_date, $nth);
    $event = $events[0];
    $response['date'] = $event->getDate();
    $response['title'] = $event->getTitle();
    $response['time'] = $event->getTimeMinutes();
    $response['description'] = $event->getDescription();
    respondJson($response);
}

// new event
if (isset($data['new_event'])) {
    $event_title = $data['event_title'];
    $event_date = $data['event_date'];
    $event_time = $data['event_time'];
    $event_description = $data['event_description'];
    $response = [];
    if (empty($event_title)) {
        $response = ['status' => false, 'message' => 'Title cannot be empty!'];
    } elseif (empty($event_date)) {
        $response = ['status' => false, 'message' => 'Date cannot be empty!'];
    } elseif (empty($event_time)) {
        $response = ['status' => false, 'message' => 'Time cannot be empty!'];
    } else {
        $status = Event::createEvent(
            $session->getUserId(), $event_title, $event_date, $event_time, $event_description);
        if ($status) {
            $response = ['status' => true];
        } else {
            $response = ['status' => false, 'message' => 'Failed to create event'];
        }
    }
    respondJson($response);
}

// get events in a range of days
if (isset($data['event_start_date'])) {
    $start_date = $data['event_start_date'];
    $end_date = $data['event_end_date'];
    $response = [];
    $events = Event::selectEventByUserDateRange($session->getUserId(), $start_date, $end_date);
    foreach ($events as $event) {
        $event_arr = [];
        $event_arr['date'] = $event->getDate();
        $event_arr['title'] = $event->getTitle();
        $event_arr['time'] = $event->getTime();
        $response[] = $event_arr;
    }
    respondJson($response);
}

// get events in one day
if (isset($data['event_date'])) {
    $date = $data['event_date'];
    $response = [];
    $events = Event::selectEventByUserDate($session->getUserId(), $date);
    foreach ($events as $event) {
        $event_arr = [];
        $event_arr['title'] = $event->getTitle();
        $event_arr['time'] = $event->getTime();
        $response[] = $event_arr;
    }
    respondJson($response);
}

// check login
if (isset($data['check_login'])) {
    $response = ['status' => $session->checkLogin()];
    respondJson($response);
}

// logout
if (isset($data['logout'])) {
    $session->logout();
    $response = ['status' => true];
    respondJson($response);
}

// login
if (isset($data['login_username'])) {
    $username = $data['login_username'];
    $password = $data['login_password'];
    if ($user_id = User::verifyUser($username, $password)) {
        $session->login($user_id);
        $response = ['status' => true];
    } else {
        $response = ['status' => false, 'message' => 'Username or password is incorrect'];
    }
    respondJson($response);
}

// sign up
if (isset($data['signup_username'])) {
    $username = trim($data['signup_username']);
    $password = trim($data['signup_password']);
    $response = array();
    if (empty($username)) {
        $response = ['status' => false, 'message' => 'Username cannot be empty'];
    } elseif (empty($password)) {
        $response = ['status' => false, 'message' => 'Password cannot be empty'];
    } else {
        $status = User::createUser($username, $password);
        if ($status) {
            $response = ['status' => true];
        } else {
            $response = ['status' => false, 'message' => 'User already exists'];
        }
    }
    respondJson($response);
}

function respondJson($response)
{
    ob_end_clean();
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <title>Calendar</title>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#calendar">Calendar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#calendar">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item"><a class="nav-link" id="about-link" data-toggle="modal" data-target="#modal">About</a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                   aria-haspopup="true" aria-expanded="false">
                    Actions
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" id="share-calendar" data-toggle="modal" data-target="#modal">Share
                        calendar</a>
                </div>
            </li>
        </ul>
        <ul class="navbar-nav navbar-right" id="user-actions">
            <li class="nav-item">
                <a class="nav-link" id="login-link" data-toggle="modal" data-target="#modal" hidden>Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="signup-link" data-toggle="modal" data-target="#modal" hidden>Sign up</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="logout-link" hidden>Logout</a>
            </li>
        </ul>
    </div>
</nav>

<div class="container-fluid">
    <div class="row">
        <div class="col-3 bg-light" style="max-width: 300px">
            <div class="row mt-3">
                <div class="col">
                    <h1 class="year-heading">
                        <span id="cur-year">Year</span>
                    </h1>
                    <h1 class="month-heading">
                        <span id="cur-month">Month</span>
                    </h1>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <h3 class="choose-month">
                        <button id="prev-month" class="btn btn-secondary">&lt;</button>
                        <button id="today-month" class="btn btn-secondary">Today</button>
                        <button id="next-month" class="btn btn-secondary">&gt;</button>
                    </h3>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <button id="new-event" class="btn btn-secondary">New event</button>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <h5>Shared with me</h5>
                    <div id="shared-withme"></div>
                </div>
            </div>
        </div>
        <div class="col-9">
            <div class="row mt-3">
                <div class="col">
                    <h1 id="app-name-landscape">My Calendar</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table border mt-3" id="calendar">
                        <thead id="calendar-head">
                        <tr>
                            <th class="border weekday">MON</th>
                            <th class="border weekday">TUE</th>
                            <th class="border weekday">WED</th>
                            <th class="border weekday">THU</th>
                            <th class="border weekday">FRI</th>
                            <th class="border weekday">SAT</th>
                            <th class="border weekday">SUN</th>
                        </tr>
                        </thead>
                        <tbody id="calendar-body">
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        <tr>
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                            <td class="border event-cell" style="width: 14.285%; height: 100%">
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog" id="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">Title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="modalForm" method="post">
                <fieldset>
                    <div class="modal-body" id="modalBody">
                    </div>
                    <div class="modal-footer" id="modalFooter">
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>


<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
        integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
        crossorigin="anonymous"></script>
<script src="js/html.js"></script>
<script src="js/nav.js"></script>
<script src="js/ajax.js"></script>
<script src="js/modal.js"></script>
<script src="js/calendar.js"></script>
<script src="js/month.js"></script>
<script src="js/app.js"></script>
</body>
</html>
