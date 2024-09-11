<?php
// upload.php
header("Access-Control-Allow-Origin: *"); // Замените * на конкретный домен, если хотите ограничить доступ (например, 'http://localhost:3000')

// Разрешить методы запросов
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");

// Разрешить специальные заголовки
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image'])) {
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);

        // Перемещаем файл в целевую директорию
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            // Возвращаем относительный путь для использования на фронтенде
            echo json_encode(["message" => "File uploaded successfully", "path" => $target_file]);
        } else {
            echo json_encode(["message" => "Failed to upload file"]);
        }
    } else {
        echo json_encode(["message" => "No file received"]);
    }
}
