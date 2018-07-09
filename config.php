<?php
/* Database credentials.  */
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'mylists');
//define('DB_PASSWORD', '');
define('DB_PASSWORD', '7fUu4z23DNXM');
define('DB_NAME', 'mylists');
 
/* Attempt to connect to MySQL database */
$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
?>