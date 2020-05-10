<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Monolog\Logger;
use Monolog\Handler\ErrorLogHandler;

final class ParseFileTest extends TestCase
{
    protected $options;

    protected function setUp(): void
    {
        $this->options = require __DIR__ . '/../test.config.php';
    }

    public function testParsingFile()
    {
        $logger = new Logger('vocabulary');
        $logger->pushHandler(new ErrorLogHandler());

        $argv = ['', 'load', 'tests/fixtures/input.txt'];
        $command = new CLI\CLI($argv, $this->options);
        $command->execute();

        $count = 0;
        $files = glob($this->options['storage']['options']['dir'] . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                $count++;
            }
        }
        $this->assertTrue($count > 0);
    }

    protected function tearDown(): void
    {
        $files = glob($this->options['storage']['options']['dir'] . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
    }
}
