<?php
require '../db.php';
$token = $_GET['token'] ?? '';
$stmt = $pdo->prepare("SELECT id, nick FROM users WHERE token=? LIMIT 1");
$stmt->execute([$token]);
$user = $stmt->fetch();

if ($user) {
    echo json_encode(['status'=>'ok','user_id'=>$user['id'],'username'=>$user['nick']]);
} else {
    echo json_encode(['status'=>'error']);
} 
