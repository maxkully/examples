<?php

namespace CLI\Commands;

use Monolog\Logger;
use Vocabulary\Core\Traits\Logging;

/**
 * Create fixture files for testing vocabulary parser
 */
class Fixture
{
    use Logging;
    /**
     * @var string
     * Directory for placing created file
     */
    private $dir;
    /**
     * @var string
     * Name of generated file
     */
    private $file;
    /**
     * @var int
     * Count of generated paragraphs
     */
    private $iterations;
    /**
     * @var Logger
     */
    private $logger;

    /**
     * Fixture constructor.
     * @param $inputs
     * @param $options
     * @throws \Exception
     */
    public function __construct($inputs, $options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->iterations = (int)array_shift($inputs);
        $this->dir = $options['fixtures_dir'];
        if (!$this->dir) {
            throw new \Exception('Directory does not set up');
        }
        if (!is_dir($this->dir)) {
            $this->logger->debug('Create directory '. $this->dir);
            mkdir($this->dir, 0775, true);
        }

        if (!$this->iterations) {
            $this->iterations = 10;
        }

        $this->file = $this->dir . DIRECTORY_SEPARATOR . 'fixture.txt';
        $this->logger->debug('Fixture loaded with file ' . $this->file);
    }

    /**
     * Start generation
     */
    public function start()
    {
        $this->logger->info('Start generate fixture');
        if (file_exists($this->file)) {
            unlink($this->file);
        }

        $content = strip_tags(file_get_contents('http://loripsum.net/api'));
        for ($i = 0; $i < $this->iterations; $i++) {
            file_put_contents($this->file, $content, FILE_APPEND);
        }
    }
}
