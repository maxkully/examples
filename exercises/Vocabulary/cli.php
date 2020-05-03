<?php

use Monolog\Logger;
use Monolog\Handler\ErrorLogHandler;

// DI settings, APP options
require_once('vocabulary.config.php');
require_once('vendor/autoload.php');

// Stop if args doesn't support
if (!isset($argv)) {
    echo "argc and argv disabled" . PHP_EOL;
    exit();
}

set_error_handler(function($errno, $errstr, $errfile, $errline ){
    echo $errfile .' '. $errline . PHP_EOL;
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
});

$logger = new Logger('vocabulary');
$logger->pushHandler(new ErrorLogHandler());

try {
    $command = new CLI\CLI($argv, $options, $logger);
    $command->execute();
} catch (\Exception $e) {
    $logger->error($e->getMessage());
}
