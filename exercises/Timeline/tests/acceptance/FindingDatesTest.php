<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use GrowFlow\Calendar\Calendar;
use GrowFlow\Calendar\Timeline;

final class FindingDatesTest extends TestCase
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

    public function testFindingForExample()
    {
        $this->input = $this->fixtures->get('input_one');
        $this->subject->denormalize($this->input);

        $finds = [
            [1, '2019-02-05', '2019-03-15', 100],
            [1, '2019-02-15', '2019-03-15', 200],
            [1, '2019-02-25', '2019-03-15', 200],
            [1, '2019-02-25', '2019-03-05', 100],
            [1, '2019-02-25', '2019-02-28', 130],
        ];

        echo Timeline::displayInput($this->subject->schedule->input[1]);
        echo Timeline::displayOutput($this->subject->schedule->output[1]);


        foreach ($finds as $dates) {
            $result = $this->subject->schedule->findFromInput($dates[0], $dates[1], $dates[2]);
            $this->assertEquals($dates[3], $result['price'], "For $dates[1], $dates[2]: " . print_r($result, true));

            $result = $this->subject->schedule->findFromOutput($dates[0], $dates[1], $dates[2]);
            $this->assertEquals(1, count($result), "For $dates[1], $dates[2]: ". Timeline::displayOutput($result));
            $result = array_pop($result);
            $this->assertEquals($dates[3], $result['price'], "For $dates[1], $dates[2]: ". Timeline::displayOutput([$result]));
        }
    }

    public function testFindingForHotfix()
    {
        $this->input = $this->fixtures->get('input_hotfix');
        $this->subject->denormalize($this->input);

        $deliveries = [];
        $orders = [];
        foreach ($this->subject->schedule->output as $posId => $output) {
            echo Timeline::displayInput($this->subject->schedule->input[$posId]);
            echo Timeline::displayOutput($output);

            foreach ($output as $pos) {
                if (!in_array($pos['order_date_from'], $orders)) {
                    $orders[] = $pos['order_date_from'];
                }

                if (!in_array($pos['delivery_date_from'], $orders)) {
                    $deliveries[] = $pos['delivery_date_from'];
                }
            }
        }

        foreach ($orders as $orderDate) {
            foreach ($deliveries as $deliveryDate) {
                $result = $this->subject->schedule->findFromOutput($posId, $orderDate, $deliveryDate);
                $this->assertEquals(1, count($result), "For $orderDate, $deliveryDate: ". Timeline::displayOutput($result));
                $result = array_pop($result);
                $this->assertEquals($this->subject->schedule->findFromInput($posId, $orderDate, $deliveryDate)['price'], $result['price'], "For $orderDate, $deliveryDate: ". Timeline::displayOutput([$result]));
            }
        }
    }

    protected function tearDown()
    {
        parent::tearDown();
        unset($this->subject);
    }
}
