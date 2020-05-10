<?php

namespace CLI\Commands;

use Monolog\Logger;
use Vocabulary\Core\Interfaces\Storage;
use Vocabulary\Core\Traits\Logging;
use Vocabulary\Vocabulary;

/**
 * Parse large files for making vocabulary
 */
class Load
{
    use Logging;

    private $file;
    /**
     * @var mixed
     * Provider for handling source data
     */
    private $source;
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
        $this->file = array_shift($inputs);

        $source = $options['source'];
        $this->source = new $source['provider']($this->file, $source['options']);

        $storage = $options['storage'];
        $this->storage = new $storage['provider']($storage['options']);
        if (isset($options['reset']) && $options['reset']) {
            $this->storage->reset();
        }

        $this->options = $options;
        $this->logger->debug('Command `Load` instantiated');
    }

    /**
     * @throws \Exception
     */
    public function start()
    {
        $this->logger->info('Start loading');
        $this->logger->debug('File ' . $this->file);
        if (!$this->isFileExists()) {
            throw new \Exception('File with name `' . $this->file . '` does not exist');
        }
        $vocabulary = new Vocabulary($this->file, $this->source, $this->storage, $this->options['vocabulary']);
        $vocabulary->load();
    }

    /**
     * @return bool
     */
    private function isFileExists()
    {
        return file_exists($this->file);
    }
}
