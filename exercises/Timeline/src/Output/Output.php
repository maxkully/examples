<?php

namespace GrowFlow\Output;

abstract class Output implements IOutput
{
    protected $format;

    public function __construct($format)
    {
        $this->format = $format;
    }
}
