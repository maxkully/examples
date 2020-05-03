<?php

namespace GrowFlow\Output;

use GrowFlow\Formatter\Formatter;

class Std extends Output
{
    public function store(array $data)
    {
        /** @var Formatter $src */
        $src = new $this->format($data);
        echo $src->dump();
    }
}
