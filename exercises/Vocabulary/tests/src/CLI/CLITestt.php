<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class CLITestt extends TestCase
{
    protected $input;
    protected $expected;
    protected $subject;

    protected function setUp(): void
    {
        // @todo
    }

    public function testOk()
    {
        $this->assertEquals(true, true);
    }
}
