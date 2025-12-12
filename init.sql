-- init.sql
CREATE DATABASE IF NOT EXISTS messageboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE messageboard_db;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (name, message) VALUES
('Admin', 'ยินดีต้อนรับสู่ Message Board!'),
('Alice', 'ทดสอบฝากข้อความจาก Alice');
