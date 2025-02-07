<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
    
    // Your email address where you want to receive messages
    $to = "your-email@example.com";
    
    // Prepare email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message";
    
    // Email headers
    $headers = "From: $name <$email>";
    
    // Send email
    if(mail($to, $subject, $email_content, $headers)) {
        // Redirect back with success message
        header("Location: index.html?status=success");
    } else {
        // Redirect back with error message
        header("Location: index.html?status=error");
    }
}
?> 