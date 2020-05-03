<?php

// @todo: prepare logs to ELK stack
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

// Create the logger
$logger = new Logger('gfl');

$level = Logger::getLevels()[strtoupper($_ENV['LOG_LEVEL'] ?? 'info')];
$logFile = $_ENV['LOG_PATH'] ?? __DIR__ . '/../log/gfc.log';

$logger->pushHandler(new StreamHandler($logFile, $level));

return $logger;
