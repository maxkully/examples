<?php

namespace RightWay\Lib;

class Request {
    public function __construct()
    {
        // here must be parsing http request
    }

    public function __get() {
        return 'default';
    }
}