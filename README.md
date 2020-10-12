# Calendar App (Currently only Supported by Chrome and Firefox)

[comment]: <> (## Login Credentials)

[comment]: <> (URL: http://3.22.235.98/cse330/module5/calendar/index.php)

[comment]: <> (**(Please use Chrome or Firefox since it uses some ES6 features)**)

[comment]: <> (Tester Accounts:)
[comment]: <> (* Username 222 (password: 222))
[comment]: <> (* Username 333 (password: 333))
[comment]: <> (* Feel free to create new accounts)


## Features

Calendar View
* The calendar is displayed as a table grid with days as the columns and weeks as the rows, one month at a time 
* The user can view different months as far in the past or future as desired 

User and Event Management
* Events can be added, modified, and deleted 
* Events have a title, date, and time 
* Users can log into the site, and they cannot view or manipulate events associated with other users 
* All actions are performed over AJAX, without ever needing to reload the page 
* Refreshing the page does not log a user out 

Best Practices 
* Code is well formatted and easy to read, with proper commenting 
* If storing passwords, they are stored salted and hashed 
* All AJAX requests that either contain sensitive information or modify something on the server are performed via POST, not GET 
* Safe from XSS attacks; that is, all content is escaped on output 
* Safe from SQL Injection attacks 
* CSRF tokens are passed when adding/editing/deleting events 
* Session cookie is HTTP-Only 
* Page passes the W3C validator 

Other features:
* The calendar always starts with Monday and ends with Sunday.
So the user can also edit the last few days of the previous month and the first few days of the next month
* Users can see the calendar even if they are not logged in. In this case, they can view but not edit events
* **Today** button to jump to today
* If the user tries to create an event by clicking a table cell, the event date will be automatically filled
* Users can add description to events and see the description if they click on an event
* Users can share calendar with other users
