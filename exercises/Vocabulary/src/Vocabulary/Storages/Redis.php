<?php

namespace Vocabulary\Storages;

use Vocabulary\Core\Interfaces\Storage as StorageInterface;

/**
 * Provider for store vocabulary in redis storage
 */
class Redis implements StorageInterface
{
    public function __construct()
    {
        throw new \Exception("Not implemented", 1);
    }
}
