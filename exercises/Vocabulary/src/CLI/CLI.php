<?php

namespace CLI;

use Monolog\Logger;
use Vocabulary\Core\Traits\Logging;

/**
 * Class CLI
 *
 * Provides tools for executing vocabulary project commands
 * @example
 *   if (!isset($argv)) {
 *     echo "argc and argv disabled" . PHP_EOL;
 *     exit();
 *   }
 *   $cli = new CLI($argv, ['logLevel'=>Logger:DEBUG]);
 *   $cli->execute()
 */
class CLI
{
    use Logging;

    /**
     * @var string
     * Command name
     * @example php cli.php <command>
     */
    private $command;
    /**
     * @var array
     * List of arguments
     */
    private $inputs = [];
    /**
     * @var array
     * Project configuration from `vocabulary.config.php`
     */
    private $options;
    /**
     * @var Logger
     */
    private $logger;

    /**
     * CLI constructor.
     * @param array $arguments - list of arguments from command line
     * @param array $options - list of attributes from config file
     */
    public function __construct($arguments, $options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->command = $arguments[1];
        if (isset($arguments[2]) && $arguments[2]) {
            $this->inputs = array_slice($arguments, 2);
        }

        $this->options = $options;
        $this->logger->info('CLI instantiated');
    }

    /**
     * @throws \Exception - unexpected command from command line
     */
    public function execute()
    {
        $this->logger->info('Execute CLI command: ' . $this->command);
        $handler = Factory::instance($this->command, $this->inputs, $this->options);
        $handler->start();
    }
}
