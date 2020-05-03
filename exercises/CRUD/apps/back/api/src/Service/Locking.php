<?php

namespace BDT\Service;

use Predis\Client as Redis;
use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\LockInterface;
use Symfony\Component\Lock\Store\RedisStore;

class Locking {
    static private $instance;

    static public function instance(): self
    {
        if (!self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private $factory;

    private function __construct()
    {
        $redis = new Redis(getenv('REDIS_DSN'));
        $redis->connect();
        $this->factory = new LockFactory(new RedisStore($redis));
    }

    public function create($name, $ttl = 30): LockInterface
    {
        return $this->factory->createLock($name, $ttl);
    }
}
