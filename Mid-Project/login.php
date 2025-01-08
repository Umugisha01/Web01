<?php
header('Content-Type: application/json');

// Database configuration
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user_auth";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];

// Query the database
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["message" => "Login successful!"]);
} else {
    echo json_encode(["error" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
