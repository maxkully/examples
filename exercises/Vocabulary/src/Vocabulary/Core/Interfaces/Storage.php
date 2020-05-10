<?php

namespace Vocabulary\Core\Interfaces;

/**
 * Bunch of methods for working with data storage for parsing words in vocabulary
 */
interface Storage
{
    /**
     * Push word to vocabulary
     * @param String $word
     * @return mixed
     */
    public function push(string $word);

    /**
     * Return number of word appearances in source
     * @param String $word
     * @return mixed
     */
    public function count(string $word);

    /**
     * Remove all words from vocabulary
     * @return mixed
     */
    public function reset();

    /**
     * @param $address
     * @return array of words and appearance count
     */
    public function listing($address);
}
