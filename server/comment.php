<?php
include 'db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method == 'GET') {
        // Получение комментариев для новости
        if (isset($_GET['news_id'])) {
            $stmt = $pdo->prepare("SELECT * FROM comments WHERE news_id = ?");
            $stmt->execute([$_GET['news_id']]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo json_encode(['error' => 'News ID required']);
        }
    } elseif ($method == 'POST') {
        // Добавление нового комментария
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['news_id']) && isset($data['content'])) {
            $stmt = $pdo->prepare("INSERT INTO comments (news_id, content) VALUES (?, ?)");
            $stmt->execute([$data['news_id'], $data['content']]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Invalid input']);
        }
    } elseif ($method == 'DELETE') {
        // Удаление комментария
        parse_str(file_get_contents('php://input'), $data);

        if (isset($data['id'])) {
            $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'ID required']);
        }
    } else {
        echo json_encode(['error' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
