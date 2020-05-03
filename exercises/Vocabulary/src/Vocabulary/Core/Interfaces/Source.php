<?php

namespace Vocabulary\Core\Interfaces;

/**
 * Bunch of methods for working with data source
 */
interface Source
{
    /**
     * Read chunk of data from source
     * @param $start - point for begin to get chunk
     * @param $length - amount of data in chunk
     * @return string - raw content of chunk
     */
    public function read($start, $length);

    /**
     * Check that current chunk is first
     * @return bool
     */
    public function isBegin();

    /**
     * Check that current chunk is last
     * @return bool
     */
    public function isEnd();
}
