<?php
$host = "localhost";       // Server hostname
$username = "root";        // Default username for XAMPP
$password = "";            // Default password for XAMPP (leave empty)
$dbname = "user_auth";     // Database name

// Create a connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
