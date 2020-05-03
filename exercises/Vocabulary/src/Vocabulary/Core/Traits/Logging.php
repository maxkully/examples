<?php

namespace Vocabulary\Core\Traits;

use Monolog\Logger;
use Monolog\Handler\ErrorLogHandler;

/**
 * Trait Logging
 * Used for inject logging functionality to another classes
 * @example
 *   use Logging;
 *   $this->logger = $this->loggerInit(Logger:DEBUG);
 *   $this->logger->info('Message');
 */
trait Logging
{
    private function loggerInit($logLevel)
    {
        $logger = new Logger('vocabulary');
        $logger->pushHandler(new ErrorLogHandler());

        return $logger;
    }
}
