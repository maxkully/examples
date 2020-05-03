<?php

namespace GrowFlow;

use GrowFlow\Error\InitError;

class Kernel
{
    private $services = [];

    /**
     * Kernel constructor.
     *
     * @throws InitError
     */
    public function __construct()
    {
        $this->init();
    }

    public function __get($name)
    {
        return $this->services[$name];
    }

    public function register($name, $service)
    {
        $this->services[$name] = $service;
    }

    /**
     * @throws InitError
     */
    private function init()
    {
        try {
            // @todo: make it autoload
            $this->services['logger'] = require(__DIR__ . '/../initializers/logger.php');
            $this->services['calendar'] = require(__DIR__ . '/../initializers/calendar.php');
            $this->services['input'] = require(__DIR__ . '/../initializers/input.php');
            $this->services['output'] = require(__DIR__ . '/../initializers/output.php');
        } catch (\Exception $e) {
            throw new InitError($e);
        }
    }
}
