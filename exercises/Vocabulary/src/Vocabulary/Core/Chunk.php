<?php

namespace Vocabulary\Core;

use Monolog\Logger;
use Vocabulary\Core\Interfaces\Source;
use Vocabulary\Core\Traits\Logging;

/**
 * Chunk of data entity
 * @example
 *   $chunk = new Chunk('/path/to/file.ext', $source);
 *   $chunk->getContent(0, 4096) // return reading 4096 bytes from 0 position in file.ext
 */
class Chunk
{
    use Logging;

    private $file;
    /**
     * @var Source
     */
    private $source;
    /**
     * @var Logger
     */
    private $logger;
    public $lastChunk;
    public $firstChunk;

    public function __construct($file, $source)
    {
        // @todo place logLevel to ENV
        $this->logger = $this->loggerInit('DEBUG');
        $this->file = $file;
        $this->source = $source;
        $this->lastChunk = false;
        $this->firstChunk = false;
        $this->logger->debug('Chunk instantiated');
    }

    /**
     * @param int $start Start point in file
     * @param int $length Length of chunk (in bytes)
     * @return array
     * @throws \Exception
     */
    public function getContent($start, $length)
    {
        try {
            $result = $this->source->read($start, $length);
            $result = mb_strtolower(preg_replace("/[^\p{Cyrillic}a-z0-9 ]/ui", '', $result));

            $this->firstChunk = $this->source->isBegin();
            $this->lastChunk = $this->source->isEnd();

            return explode(' ', $result);
        } catch (\Exception $e) {
            // @todo make named exceptions
            throw new \Exception($e->getMessage());
        }
    }
}
