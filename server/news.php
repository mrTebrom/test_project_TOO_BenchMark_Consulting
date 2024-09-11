<?php
// news.php
include 'db.php';



header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['id'])) {
        // Получение новости по ID
        $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $news = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($news) {
            // Обновление просмотров
            $pdo->prepare("UPDATE news SET views = views + 1 WHERE id = ?")->execute([$_GET['id']]);
            echo json_encode($news);
        } else {
            echo json_encode(['error' => 'News not found']);
        }
    } else {
        // Получение списка новостей
        $stmt = $pdo->query("SELECT id, title, image, cardTitle, cardDescription, created_at, views, likes, SUBSTRING(content, 1, 100) as content FROM news");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} elseif ($method == 'POST') {
    // Добавление новой новости
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("INSERT INTO news (title, image, content, author, cardTitle, cardDescription) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['title'], $data['image'], $data['content'], $data['author'], $data['cardTitle'], $data['cardDescription']]);

    echo json_encode(['success' => true]);
} elseif ($method == 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && is_numeric($data['id'])) {
        if (isset($data['action']) && $data['action'] === 'like') {
            // Лайк новости
            $stmt = $pdo->prepare("UPDATE news SET likes = likes + 1 WHERE id = ?");
            $stmt->execute([$data['id']]);
        } elseif (isset($data['action']) && $data['action'] === 'unlike') {
            // Удаление лайка новости
            $stmt = $pdo->prepare("UPDATE news SET likes = GREATEST(likes - 1, 0) WHERE id = ?");
            $stmt->execute([$data['id']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            exit;
        }

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or missing ID']);
    }
} elseif ($method == 'PUT') {
    // Обновление существующей новости
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && is_numeric($data['id'])) {
        $stmt = $pdo->prepare("UPDATE news SET title = ?, image = ?, content = ?, author = ?, cardTitle = ?, cardDescription = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['image'],
            $data['content'],
            $data['author'],
            $data['cardTitle'],
            $data['cardDescription'],
            $data['id']
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'News updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'News not found or no changes']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or missing ID']);
    }
} elseif ($method == 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true); // Парсим JSON тело

    if (isset($data['id']) && is_numeric($data['id'])) {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$data['id']]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'News deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'News not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Некорректный или отсутствующий ID']);
    }
}



