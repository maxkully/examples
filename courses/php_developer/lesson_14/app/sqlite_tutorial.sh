sudo apt-get install sqlite3 libsqlite3-dev -y

sqlite3 library
.help
.version
.databases
.tables
.header on
.mode column

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
# ERROR

CREATE TABLE `author` (
    `id` INTEGER PRIMARY KEY
);

.schema author

# TEXT
# NUMERIC
# INTEGER
# REAL
# BLOB

ALTER TABLE `author` ADD COLUMN `first_name` TEXT;
ALTER TABLE `author` ADD COLUMN `middle_name` TEXT;
ALTER TABLE `author` ADD COLUMN `last_name` TEXT;
ALTER TABLE `author` ADD COLUMN `enabled` INTEGER; 
ALTER TABLE `author` ADD COLUMN `created_at` INTEGER;
ALTER TABLE `author` ADD COLUMN `updated_at` INTEGER; 
ALTER TABLE `author` ADD COLUMN `deleted_at` INTEGER;

DROP TABLE `author`;

PRAGMA main.application_id;
PRAGMA journal_mode;

sqlite3 sample.db .dump > sample.bak
sqlite3 sample.db < sample.bak

EXPLAIN QUERY PLAN
SELECT (
    SELECT (c.first_name || ' ' || c.last_name) FROM `client` c WHERE c.id = t.client_id LIMIT 1
) as `client`,
(
    SELECT c.title FROM `composition` c WHERE c.id = (SELECT b.composition_id FROM `book` b WHERE b.id = t.book_id)
) as `book`,
(
    SELECT (a.last_name || ' ' || a.first_name) FROM `author` a WHERE a.id = (
        SELECT c.author_id FROM `composition` c WHERE c.id = (
            SELECT b.composition_id FROM `book` b WHERE b.id = t.book_id
        )
    )
) as `author`,
t.expired_at 
  FROM `ticket` t
 WHERE t.`status` = 1
ORDER BY `book`
LIMIT 20;

EXPLAIN QUERY PLAN
    SELECT (cl.first_name || ' ' || cl.last_name) AS `client`,
           c.title as `book`,
           (a.last_name || ' ' || a.first_name) AS `author`,
           t.expired_at
      FROM `ticket` t
INNER JOIN `book` b ON b.id = t.book_id
INNER JOIN `composition` c ON c.id = b.composition_id
INNER JOIN `author` a ON a.id = c.author_id
INNER JOIN `client` cl ON cl.id = t.client_id
     WHERE t.status = 1
  ORDER BY c.title
     LIMIT 20;


DELETE
TRUNCATE
PERSIST
MEMORY
WAL
OFF