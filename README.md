-- База данных
database = news_website



-- Создание таблицы news
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    content TEXT,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views INT DEFAULT 0,
    likes INT DEFAULT 0
);

-- Создание таблицы comments
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    news_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);
