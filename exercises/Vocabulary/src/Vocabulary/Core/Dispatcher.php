<?php

namespace Vocabulary\Core;

use Monolog\Logger;
use Vocabulary\Core\Traits\Logging;

/**
 * Dispatcher
 *
 * @example
 *   $dispatcher = new Dispatcher($options);
 *   $address = $dispatcher->dispatch('lorem');
 */
class Dispatcher
{
    use Logging;

    /**
     * @var Logger
     */
    private $logger;
    private $options;

    public function __construct($options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->options = $options;
    }

    /**
     * @param string $word
     * @return int
     */
    public function dispatch($word)
    {
        return crc32($word) % $this->options['capacity'];
    }
}
