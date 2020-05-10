<?php

namespace CLI\Commands;

use Monolog\Logger;
use Vocabulary\Core\Interfaces\Storage;
use Vocabulary\Core\Traits\Logging;
use Vocabulary\Vocabulary;

/**
 * Parse large files for making vocabulary
 */
class Count
{
    use Logging;

    private $word;

    /**
     * @var Storage
     * Provider of storage for vocabulary
     */
    private $storage;
    /**
     * @var array
     * Configuration (see `vocabulary.config.php`)
     */
    private $options;
    /**
     * @var Logger
     */
    private $logger;

    /**
     * Load constructor.
     * @param $inputs
     * @param $options
     */
    public function __construct($inputs, $options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->word = strtolower(array_shift($inputs));
        $storage = $options['storage'];
        $this->storage = new $storage['provider']($storage['options']);
        $this->options = $options;
        $this->logger->debug('Command `Listing` instantiated');
    }

    /**
     * @throws \Exception
     */
    public function start()
    {
        echo 'Word `' . $this->word . '` occurs ' . $this->storage->count($this->word) . ' times' . PHP_EOL;
    }
}
