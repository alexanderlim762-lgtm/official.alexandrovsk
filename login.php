<?php
session_start();
require 'db.php'; // подключение к БД

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Проверка в БД
$stmt = $pdo->prepare("SELECT id, nick, password FROM users WHERE email=? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    // Создаем токен для форума
    $token = bin2hex(random_bytes(32));

    $pdo->prepare("UPDATE users SET token=? WHERE id=?")
        ->execute([$token, $user['id']]);

    setcookie(
        "auth_token",
        $token,
        time()+60*60*24*7,
        "/",
        ".c6t.ru",
        true,
        true
    );

    // Редирект на форум
    header("Location: https://forum-alexandrovsk.c6t.ru");
    exit;
}

echo "Неверный логин или пароль";
