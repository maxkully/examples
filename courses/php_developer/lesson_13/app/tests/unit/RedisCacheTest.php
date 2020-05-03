<?php

class RedisCacheTest extends \Codeception\Test\Unit
{
    /**
     * @var \UnitTester
     */
    protected $tester;

    private $subject;
    
    protected function _before()
    {
        $this->subject = new RedisCache();
    }

    protected function _after()
    {
    }

    // tests
    public function testSomeFeature()
    {
        $this->assertTrue($this->subject->get('test'), 'test');

    }
}