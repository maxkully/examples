<?php

namespace Vocabulary\Storages;

use Monolog\Logger;
use Vocabulary\Core\Dispatcher;
use Vocabulary\Core\Interfaces\Storage as StorageInterface;
use Vocabulary\Core\Traits\Logging;

/**
 * Provider for store vocabulary in simple files using native PHP serializer
 * @example
 *   $storage = new File(['logLevel' => Logger:ERROR]);
 *   $storage->push('word') // put word to vocabulary or increment word appearance
 *   $storage->count('word') // return count of word appearance in parsed text
 *   $storage->reset() // clear vocabulary
 */
class File implements StorageInterface
{
    use Logging;

    /**
     * @var string used directory
     */
    private $dir;
    /**
     * @var string File extension for vocabulary chunks
     */
    private $extension;
    /**
     * @var Logger
     */
    private $logger;

    private $dispatcher;

    /**
     * File constructor.
     * @param $options
     *   - ['logLevel']
     */
    public function __construct($options)
    {
        $this->logger = $this->loggerInit($options['logLevel']);
        $this->logger->debug('Storage `File` instantiated ');
        $this->dispatcher = new Dispatcher($options);

        $this->dir = $options['dir'];
        $this->extension = $options['extension'];

        if (!$this->dir) {
            $this->dir = __DIR__;
        }

        if (!$this->extension) {
            $this->extension = '.wbv';
        }
    }

    /**
     * Place word to vocabulary and increment it appearance
     * @param String $word
     */
    public function push($word): void
    {
        $this->logger->debug('Push word ' . $word);
        $content = $this->load($this->dispatch($word));

        if (!isset($content[$word])) {
            $content[$word] = 0;
        }
        $content[$word]++;

        $this->store($this->dispatch($word), $content);
    }

    /**
     * Clear vocabulary
     */
    public function reset(): void
    {
        $files = glob($this->dir . '/*');
        foreach ($files as $file) {
            unlink($file);
        }
    }

    /**
     * Get word appearance
     * @param String $word
     * @return int|mixed
     */
    public function count($word)
    {
        $content = $this->load($this->dispatch($word));
        if (!$content) {
            return 0;
        }

        return $content[$word] ?? 0;
    }

    /**
     * Get all words placed at address
     * @param $address
     * @return mixed
     */
    public function listing($address)
    {
        return $this->load($address);
    }

    /**
     * Return name of file where word placed of will be placed
     * @param $word
     * @return string
     */
    private function dispatch($word): string
    {
        $address = $this->dispatcher->dispatch($word);
        // WiseBits Vocabulary (wbv)
        return $address . $this->extension;
    }

    /**
     * Load all words from address
     * @param $address
     * @return mixed
     */
    private function load($address)
    {
        $file = $this->ensureFile($address);
        return unserialize(file_get_contents($file));
    }

    /**
     * Restore content by address
     * @param string $address
     * @param array $content
     * @return bool
     */
    private function store($address, $content): bool
    {
        $file = $this->ensureFile($address);
        return file_put_contents($file, serialize($content));
    }

    /**
     * @param string $address
     * @todo Security issue, check directory safety before creation
     * @todo make exceptions handling
     * @return string full path to file
     */
    private function ensureFile($address): string
    {
        if (!is_dir($this->dir)) {
            $this->logger->debug('Create file '. $this->dir);
            mkdir($this->dir, 0775, true);
        }

        $file = $this->dir . DIRECTORY_SEPARATOR . $address;
        if (!file_exists($file)) {
            touch($file);
        }

        return $file;
    }
}
