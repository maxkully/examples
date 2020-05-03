<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\Calendar;

final class NegativeScriptsTest extends TestCase
{
    protected $fixtures;
    protected $input;
    protected $expected;
    protected $subject;

    protected function setUp()
    {
        $this->fixtures = Fixtures::instance();
        $this->subject = new Calendar();
    }

    public function testEmptyInputData()
    {
        $this->input = [];
        $this->expected = [];
        $this->assertEquals($this->expected, $this->subject->denormalize($this->input));
    }

    public function testIncorrectInputData()
    {
        $this->input = $this->fixtures->get('input_incorrect');
        $this->expected = $this->fixtures->get('output_one');
        $output = $this->subject->denormalize($this->input);
        $this->assertEquals($this->expected, $output);
    }
}
