<?php
// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the submitted form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);

    // Display the data on the server
    echo "<h1>Form Submitted Successfully</h1>";
    echo "<p><strong>Name:</strong> $name</p>";
    echo "<p><strong>Email:</strong> $email</p>";

    // Optionally, log or process the data further
    // Example: Save to a database, send an email, etc.
} else {
    echo "<p>No data received. Please submit the form again.</p>";
}
?>
