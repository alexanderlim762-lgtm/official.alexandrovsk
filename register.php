<?php
require 'db.php';

$email = $_POST['reg-email'] ?? '';
$nick  = $_POST['reg-nick'] ?? '';
$password = $_POST['reg-password'] ?? '';
$avatar = $_FILES['reg-avatar'] ?? null;

if ($email && $nick && $password) {
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $filename = '';
    if ($avatar && $avatar['tmp_name']) {
        $ext = pathinfo($avatar['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        move_uploaded_file($avatar['tmp_name'], "uploads/$filename");
    }

    $stmt = $pdo->prepare("INSERT INTO users (email,nick,password,avatar) VALUES (?,?,?,?)");
    $stmt->execute([$email,$nick,$hash,$filename]);

    echo "Регистрация успешна. Можете войти.";
}
