<?php
session_start();
require 'db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $pdo->prepare("SELECT id, nick, password FROM users WHERE email=? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    $token = bin2hex(random_bytes(32));
    $pdo->prepare("UPDATE users SET token=? WHERE id=?")->execute([$token, $user['id']]);

    setcookie("auth_token", $token, time()+60*60*24*7, "/", ".c6t.ru", true, true);

    $redirect = $_GET['redirect'] ?? 'https://forum-alexandrovsk.c6t.ru';
    header("Location: $redirect");
    exit;
}

echo "Неверный логин или пароль";
