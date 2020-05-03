<?php

namespace BDT\Service;

use Predis\Client as Redis;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Cache\Adapter\RedisAdapter;

class Cache {
    static private $instance;

    static public function instance(Redis $client): self
    {
        if (!self::$instance) {
            self::$instance = new self($client);
        }

        return self::$instance;
    }

    /** @var RedisAdapter */
    private $cache;


    private $client;

    private function __construct(Redis $client)
    {
        $this->cache = new RedisAdapter($client);
    }

    public function get($key, $callback)
    {
        try {
            return $this->cache->get($key, $callback);
        } catch (InvalidArgumentException $e) {
            return $callback();
        }
    }

    /**
     * @param $key
     * @throws InvalidArgumentException
     */
    public function delete($key) {
        $this->cache->delete($key);
    }
}
