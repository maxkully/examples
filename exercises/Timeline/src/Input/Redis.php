<?php

namespace GrowFlow\Input;

use GrowFlow\Error\NotImplementedError;

class Redis extends Input
{
    /**
     * @throws NotImplementedError
     */
    public function load()
    {
        throw new NotImplementedError();
    }
}
