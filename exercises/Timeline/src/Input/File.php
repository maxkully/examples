<?php

namespace GrowFlow\Input;

use GrowFlow\Error\NotImplementedError;

class File extends Input
{
    /**
     * @throws NotImplementedError
     */
    public function load()
    {
        throw new NotImplementedError();
    }
}
