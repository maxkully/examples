<?php

namespace Vocabulary\Sources;

use Vocabulary\Core\Interfaces\Source as SourceInterface;

/**
 * Provider for read source for vocabulary from database
 */
class Db implements SourceInterface
{
    public function __construct()
    {
        throw new \Exception("Not implemented", 1);
    }
}
