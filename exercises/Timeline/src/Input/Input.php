<?php

namespace GrowFlow\Input;

use GrowFlow\Formatter\Formatter;

abstract class Input implements IInput
{
    protected $format;

    public function __construct($format)
    {
        $this->format = $format;
    }
}
