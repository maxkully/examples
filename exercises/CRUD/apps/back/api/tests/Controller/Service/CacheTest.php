<?php

namespace BDT\Tests\Service;

use BDT\Service\Cache;
use PHPUnit\Framework\TestCase;
use Predis\Client as Redis;

class CacheTest extends TestCase {
    /** @var Cache */
    private $subject;
    private $redisClient;

    protected function setUp(): void
    {
        $this->redisClient = new Redis(getenv('REDIS_DSN'));
        $this->redisClient->connect();
        $this->subject = Cache::instance($this->redisClient);
    }

    public function testGet() {
        $actual = $this->subject->get('test', function () {
            return 'test';
        });
        $expected = $this->redisClient->get('test');
        $this->assertEquals(unserialize($expected), $actual);
    }

    public function testDelete() {
        $this->subject->get('test', function () {
            return 'b';
        });
        $this->subject->delete('test');
        $expected = $this->redisClient->get('test');
        $this->assertNull($expected);
    }
}