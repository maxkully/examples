<?php

namespace RightWay\Lib;

class Container {
    private $handlers;

    public function __construct()
    {
        /* Twig config */
        $loader = new \Twig_Loader_Filesystem(__DIR__ . '/../Views');
        $twig = new \Twig_Environment($loader, ['cache' => false, 'debug' => true]);
        $this->handlers['templateEngine'] = $twig;

        /* PDO config */
        $dsn = 'sqlite:/db/goat.db';
        $this->handlers['db'] = new \PDO($dsn, '', '', [\PDO::ATTR_PERSISTENT => true]);
        $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public function __get(string $name)
    {
        return isset($this->handlers[$name]) ? $this->handlers[$name] : null;
    }

    public function __set(string $name, $service)
    {
        if (!isset($this->handlers[$name])) {
            $this->handlers[$name] = $service;
        }
    }
}