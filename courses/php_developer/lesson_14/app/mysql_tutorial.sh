# STEP 1. Install mysql-server. Prompt root password
sudo apt-get install mysql-server-5.6
# STEP 2. Prepare user and database
# Open mysql as root
mysql -u root -ppassword
# Create databse
CREATE DATABASE library
# Create user
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
# Grant privileges
GRANT ALL PRIVILEGES ON library.* TO 'admin'@'localhost' WITH GRANT OPTION;
# Commit changes
FLUSH PRIVILEGES;
exit
# Open mysql for user
mysql -u admin -ppassword library
# Check that used `library` db
SELECT DATABASE();

# STEP 3. Create table
CREATE TABLE `composition` (`id` BIGINT);
SHOW TABLES;
# STEP 4. Delete tables
DROP TABLE `composition`;
# STEP 5. Alter table
CREATE TABLE `composition` (`id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT);
ALTER TABLE `composition` ADD COLUMN (
    `author_id` BIGINT NULL,
    `title` VARCHAR(300) NULL,
    `code` VARCHAR(60) NULL, 
    `enabled` TINYINT NOT NULL DEFAULT 1, 
    `published_at` TIMESTAMP NULL, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL);
DESCRIBE `composition`;

INSERT INTO `composition` (`title`, `code`, `enabled`) VALUES ( (SELECT SHA1(CONCAT(MD5(RAND()), SHA1(RAND())))), (SELECT SHA1(CONCAT(MD5(RAND()), SHA1(RAND())))), 1 );
DELETE FROM `composition`;
TRUNCATE `composition`;
INSERT INTO `composition` (`title`, `code`, `enabled`) VALUES ( (SELECT SHA1(CONCAT(MD5(RAND()), SHA1(RAND())))), (SELECT SHA1(CONCAT(MD5(RAND()), SHA1(RAND())))), 1 );

CREATE TABLE `author` (
    `id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(300),
    `middle_name` VARCHAR(300),
    `last_name` VARCHAR(300),
    `enabled` TINYINT DEFAULT 1, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL
);
DESCRIBE `author`;

CREATE TABLE `publisher` (
    `id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(300),
    `legal_name` VARCHAR(300),
    `brand_name` VARCHAR(300),
    `enabled` TINYINT DEFAULT 1, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL
);
DESCRIBE `publisher`;

CREATE TABLE `book` (
    `id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `composition_id` BIGINT NULL,
    `publisher_id` BIGINT NULL,
    `enabled` TINYINT DEFAULT 1, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL
);
DESCRIBE `book`;

CREATE TABLE `client` (
    `id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(300),
    `middle_name` VARCHAR(300),
    `last_name` VARCHAR(300),
    `enabled` TINYINT DEFAULT 1, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL
);
DESCRIBE `client`;

CREATE TABLE `ticket` (
    `id` BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `client_id` BIGINT NULL,
    `book_id` BIGINT NULL,
    `status` TINYINT DEFAULT 1,
    `expired_at` TIMESTAMP NULL,
    `returned_at` TIMESTAMP NULL, 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP, 
    `deleted_at` TIMESTAMP NULL
);
DESCRIBE `ticket`;
