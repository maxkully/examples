<?php

namespace Vocabulary\Storages;

use Vocabulary\Core\Interfaces\Storage as StorageInterface;

/**
 * Provider for store vocabulary in database
 */
class Db implements StorageInterface
{
    public function __construct()
    {
        throw new \Exception("Not implemented", 1);
    }
}
