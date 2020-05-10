<?php

namespace Vocabulary\Core\Interfaces;

/**
 * Bunch of methods for working with data storage for parsing words in vocabulary
 */
interface Dispatcher
{
    public function dispatch($word);
}
