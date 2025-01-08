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

$firstName = $data["firstName"];
$middleName = isset($data["middleName"]) ? $data["middleName"] : null;
$lastName = $data["lastName"];
$phoneNumber = $data["phoneNumber"];
$email = $data["email"];

// Insert into database
$sql = "INSERT INTO users (first_name, middle_name, last_name, phone_number, email) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $firstName, $middleName, $lastName, $phoneNumber, $email);

if ($stmt->execute()) {
    echo json_encode(["message" => "User signed up successfully!"]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
