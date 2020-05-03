<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\Timeline;

final class TimelineTest extends TestCase
{
    protected $input;
    protected $expected;
    protected $subject;

    protected function setUp()
    {
        $fixtures = Fixtures::instance();
        $this->input = $fixtures->get('input_one');
        $this->expected = $fixtures->get('output_one');
        $this->subject = new Timeline($this->input[0]['position_id']);
        foreach ($this->input as $payload) {
            $this->subject->insert($payload);
        }
    }

    public function testInsert() {
        $timeline = $this->subject->build();
        $this->assertEquals(count($this->expected), count($timeline));
    }

    public function testStaticBeforeDay() {
        $input = '2020-03-01';
        $expected = '2020-02-29';
        $this->assertEquals($expected, Timeline::beforeDay($input));
    }
}
