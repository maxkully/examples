<?php

namespace GrowFlow\Input;

use GrowFlow\Error\NotImplementedError;

class Db extends Input
{
    /**
     * @throws NotImplementedError
     */
    public function load()
    {
        throw new NotImplementedError();
    }
}
