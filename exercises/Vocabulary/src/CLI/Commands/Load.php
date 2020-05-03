<?php

namespace CLI\Commands;

use Monolog\Logger;
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
     * @var mixed
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
        $this->logger->debug('Ispum count => '. $vocabulary->count('ipsum'));
        $this->logger->debug('Listing => '. print_r($vocabulary->listing('a2.wbv'), 1));
    }

    /**
     * @return bool
     */
    private function isFileExists()
    {
        return file_exists($this->file);
    }
}
