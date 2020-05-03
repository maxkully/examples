<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\Calendar;

final class CalendarTest extends TestCase
{
    protected $input;
    protected $expected;
    protected $subject;

    protected function setUp()
    {
        $fixtures = Fixtures::instance();
        $this->input = $fixtures->get('input_example');
        $this->expected = $fixtures->get('output_example');
        $this->subject = new Calendar();
    }

    public function testDenormalize()
    {
        $this->assertEquals($this->expected, $this->subject->denormalize($this->input));
    }
}
