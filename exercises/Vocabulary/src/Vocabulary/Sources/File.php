<?php

namespace Vocabulary\Sources;

use Monolog\Logger;
use Vocabulary\Core\Interfaces\Source as SourceInterface;
use Vocabulary\Core\Traits\Logging;

/**
 * Provider for read source for vocabulary from text files
 * @example
 *   $source = new File('/path/to/file.ext', ['logLevel' => Logger:ERROR]);
 *   $raw = $source->read(4096, 4096) // return data from file beginning from 4096 byte with 4096 bytes size
 */
class File implements SourceInterface
{
    use Logging;

    private $file;
    private $begin = null;
    private $end = null;
    /**
     * @var Logger
     */
    private $logger;

    public function __construct($resource, $options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->file = $resource;
        $this->logger->debug('Source `File` instantiated');
    }

    /**
     * Get raw data from start to start + length
     * @param int $start - offset from begin file in bytes
     * @param $length - amount of bytes for reading
     * @return string
     */
    public function read($start, $length)
    {
        $this->begin = !$start;

        $handle = fopen($this->file, "r");
        if (!$handle) {
            throw new \Exception("File not opened", 1);
        }
        fseek($handle, $start);
        $result = fread($handle, $length);
        $this->end = feof($handle);
        fclose($handle);

        return $result;
    }

    /**
     * Check that reading from begin of file
     * @return bool|null
     */
    public function isBegin()
    {
        return $this->begin;
    }

    /**
     * Check that reading last data from end of file
     * @return bool|null
     */
    public function isEnd()
    {
        return $this->end;
    }
}
