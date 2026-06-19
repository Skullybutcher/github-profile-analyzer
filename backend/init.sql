-- Initialize GitHub Profile Analyzer Database
-- Run this script with: mysql -u root -p < init.sql

CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS analyses (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  displayName VARCHAR(255),
  avatarUrl VARCHAR(500),
  bio TEXT,
  htmlUrl VARCHAR(500),
  company VARCHAR(255),
  location VARCHAR(255),
  blog VARCHAR(500),
  twitterUsername VARCHAR(255),
  joinedAt VARCHAR(255),
  accountAgeYears DECIMAL(5,2),
  publicRepos INT,
  followers INT,
  following INT,
  engagementScore INT,
  dominantLanguage VARCHAR(50),
  totalStars INT,
  totalForks INT,
  tractionRating VARCHAR(100),
  reposPerYear DECIMAL(8,2),
  languagesJson JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification
SELECT 'Database initialized successfully!' as message;
SHOW TABLES;
DESCRIBE analyses;
