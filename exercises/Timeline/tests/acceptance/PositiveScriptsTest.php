<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\Calendar;

final class PositiveScriptsTest extends TestCase
{
    protected $fixtures;
    protected $subject;
    protected $input;
    protected $expected;

    protected function setUp()
    {
        $this->fixtures = Fixtures::instance();
        $this->subject = new Calendar();
    }

    public function testExampleDenormalize()
    {
        $this->input = $this->fixtures->get('input_example');
        $this->expected = $this->fixtures->get('output_example');

        $this->assertEquals($this->expected, $this->subject->denormalize($this->input));
    }

    protected function tearDown()
    {
        parent::tearDown();
        unset($this->subject);
    }
}
