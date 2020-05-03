<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\PositionsCollection;

final class PositionsCollectionTest extends TestCase
{
    protected $input;
    protected $expected;
    protected $subject;

    protected function setUp()
    {
        $fixtures = Fixtures::instance();
        $this->input = $fixtures->get('input_example');
        $this->expected = $fixtures->get('output_example');
        $this->subject = new PositionsCollection($this->input);
    }

    public function testAdd() {
        $this->assertEquals(2, count($this->subject->collection));
    }
}
