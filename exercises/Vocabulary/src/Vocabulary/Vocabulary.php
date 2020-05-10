<?php

namespace Vocabulary;

use Monolog\Logger;
use Vocabulary\Core\Chunk;
use Vocabulary\Core\Interfaces\Storage;
use Vocabulary\Core\Traits\Logging;

/**
 * Vocabulary entity with loading and reading methods
 */
class Vocabulary
{
    use Logging;

    private $blockSize = 1024;
    private $file;
    private $source;
    /**
     * @var Storage
     */
    private $storage;
    /**
     * @var Logger
     */
    private $logger;

    /**
     * Vocabulary constructor.
     * @param $file
     * @param $source
     * @param $storage
     * @param $options
     */
    public function __construct($file, $source, $storage, $options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->file = $file;
        $this->source = $source;
        $this->storage = $storage;
        if ($options && (int)$options['blockSize']) {
            $this->blockSize = $options['blockSize'];
        }

        $this->logger->debug('Vocabulary instantiated');
    }

    /**
     * Load data by chunks
     * @throws \Exception
     */
    public function load(): void
    {
        $chunk = new Chunk($this->file, $this->source);
        $start = 0;
        $tail = '';
        while (!$chunk->lastChunk) {
            try {
                $content = $chunk->getContent($start, $this->blockSize);

                if (!$chunk->firstChunk) {
                    $head = array_shift($content);
                    $this->storage->push($tail . $head);
                }

                if (!$chunk->lastChunk) {
                    $tail = array_pop($content);
                }

                foreach ($content as $word) {
                    $this->storage->push($word);
                }

                $start += $this->blockSize;
            } catch (\Exception $e) {
                $this->logger->error($e->getMessage());
                // @todo use named exception
                throw new \Exception('Fail parsing file with error: ' . $e->getMessage());
            }
        }

        /**
         * @todo support forking
         *
        for ($i = 0; $i < $this->source->threads; $i++) {
            $pid = pcntl_fork();
            if ($pid == -1) { //fork failed. May be extreme OOM condition
                exit('pcntl_fork failed');
            } elseif ($pid) { //parent process
                $this->readers[] = $pid;
            } else { // child process
                print_r($chunk->getContent(0, 100));
                exit();
            }
        }
        foreach ($chunk->getContent(0, 4096) as $word) {
            $this->storage->push($word);
        }
        while (!empty($this->readers)) {    //wait for all children to complete
            foreach ($this->readers as $key => $pid) {
                $status = null;
                $res = pcntl_waitpid($pid, $status, WNOHANG);
                if ($res == -1 || $res > 0) {   //if the process has already exited
                    unset($this->readers[$key]);
                }
            }
            sleep(1);
        }
       */
    }

    /**
     * @param string $word
     * @return int
     */
    public function count($word): int
    {
        return $this->storage->count($word);
    }

    /**
     * @param string $address
     * @return mixed
     */
    public function listing($address)
    {
        return $this->storage->listing($address);
    }
}
