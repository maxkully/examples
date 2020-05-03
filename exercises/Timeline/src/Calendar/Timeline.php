<?php

/**
 *
 */

namespace GrowFlow\Calendar;

use SplMinHeap;
use SplMaxHeap;

// @todo: need refactoring!

/**
 * Class Timeline
 * @package GrowFlow\Calendar
 */
class Timeline extends SplMinHeap
{
    /**
     * @var int
     */
    private $pId;

    /**
     * @var array
     */
    private $chain;

    /**
     * @var SplMaxHeap
     */
    private $orders;

    /**
     * @var SplMaxHeap
     */
    private $deliveries;

    /**
     * @param $date
     * @return false|string
     */
    public static function beforeDay($date)
    {
        if (!$date) {
            return '';
        }

        return date('Y-m-d', strtotime("-1 days", strtotime($date)));
    }

    /**
     * @param $output
     * @return string
     */
    public static function displayOutput($output)
    {
        $str = PHP_EOL . "  od_from  |    od_to   |   dd_from  |    dd_to   | price" . PHP_EOL;
        foreach ($output as $item) {
            $str .= $item["order_date_from"] . " | " . ($item["order_date_to"] ? $item['order_date_to'] : str_repeat(' ', 10)) . " | " .
                $item["delivery_date_from"] . " | " . ($item["delivery_date_to"] ? $item['delivery_date_to'] : str_repeat(' ', 10)) . " | " . $item["price"] . PHP_EOL;
        }

        return $str;
    }

    /**
     * @param $input
     * @return string
     */
    public static function displayInput($input)
    {
        $str = PHP_EOL . "  od_from  |   dd_from  |   price   | pos_id" . PHP_EOL;
        foreach ($input as $item) {
            $str .= $item["order_date_from"] . " | " . $item["delivery_date_from"] . " |   " . $item["price"] . "  | " . $item['position_id'] . PHP_EOL;
        }

        return $str;
    }

    /**
     * Timeline constructor.
     * @param int $positionId
     */
    public function __construct($positionId)
    {
        $this->pId = $positionId;
        $this->chain = [];
        $this->orders = new SplMaxHeap();
        $this->deliveries = new SplMaxHeap();
    }

    /**
     * @param mixed $payload
     * - position_id
     * - order_date_from
     * - delivery_date_from
     * - price
     */
    public function insert($payload)
    {
        if (!$this->validate($payload)) {
            return;
        }

        $this->orders->insert([strtotime($payload['order_date_from']), $payload]);
        $this->deliveries->insert([strtotime($payload['delivery_date_from']), $payload]);
    }

    /**
     * Define possible delivery_date_to and order_date_to
     * @return array
     */
    public function build()
    {
        $positions = [];
        // Define possible delivery_date_to and combine with order_date_to
        $deliveries = $this->chainDeliveries();

        foreach ($deliveries as $tDlvr => $delivery) {
            // save top to output
            $positions[] = [
                'position_id' => $this->pId,
                'order_date_from' => $delivery[4],
                'order_date_to' => '',
                'delivery_date_from' => $delivery[0],
                'delivery_date_to' => $delivery[1],
                'price' => $delivery[2],
            ];

            $candidates = [];
            foreach ($deliveries as $tDlvr2 => $delivery2) {
                // remove saved positions to from candidates
                if ($tDlvr2 >= $tDlvr) {
                    continue;
                }

                // filter candidates list by saved positions delivery date from (save less than top ddf)
                if ($delivery[3] > $delivery2[3]) {
                    $candidates[] = $delivery2;
                }
            }

            $dateFrom = $delivery[4];
            $candidateEmpty = !count($candidates);
            while (!$candidateEmpty) {
                // remove top from candidates
                $candidate = array_shift($candidates);
                // save top to positions
                $positions[] = [
                    'position_id' => $this->pId,
                    'order_date_from' => $candidate[4],
                    'order_date_to' => self::beforeDay($dateFrom),
                    'delivery_date_from' => $delivery[0],
                    'delivery_date_to' => $delivery[1],
                    'price' => $candidate[2],
                ];
                $dateFrom = $candidate[4];
                $tmp = [];
                foreach ($candidates as $cnd) {
                    // filter candidates list by top delivery date from (save less than top ddf)
                    if ($candidate[3] > $cnd[3]) {
                        $tmp[] = $cnd;
                    }
                }
                $candidates = $tmp;
                $candidateEmpty = !count($candidates);
            }
        }

        usort($positions, function ($first, $second) {
            return $first['order_date_from'] >= $second['order_date_from'];
        });

        return $positions;
    }

    private function validate($payload)
    {
        if (isset($this->uniqueDDates[$payload['delivery_date_from']])) {
            return;
        }
        $this->uniqueDDates[$payload['delivery_date_from']] = true;

        $orderDateFrom = $payload['order_date_from'] ?? '';
        $deliveryDateFrom = $payload['delivery_date_from'] ?? '';

        // skip position with incorrect order date
        if ($orderDateFrom !== date('Y-m-d', strtotime($orderDateFrom))) {
            return;
        }

        // skip position with incorrect delivery date
        if ($deliveryDateFrom !== date('Y-m-d', strtotime($deliveryDateFrom))) {
            return;
        }

        // skip position where delivery date older than order date
        if ($orderDateFrom > $deliveryDateFrom) {
            return;
        }

        return true;
    }

    /**
     * Build unique order_date_from's list and possible define order_date_to
     * @return array
     */
    private function chainOrders()
    {
        $orders = [];
        $prevPos = [];
        foreach ($this->orders as $dates) {
            $timestamp = $dates[0];
            if (isset($orders[$timestamp])) {
                continue;
            }

            $orders[$timestamp] = self::beforeDay($prevPos['order_date_from'] ?? '');
            $prevPos = $dates[1];
        }

        return $orders;
    }

    /**
     * Define possible delivery_date_to
     * @return array
     */
    public function chainDeliveries()
    {
        $orders = $this->chainOrders();
        $deliveries = [];
        $prevPos = [];
        foreach ($this->deliveries as $dates) {
            list($timestamp, $position) = $dates;

            $deliveries[$timestamp] = [
                $position['delivery_date_from'],
                self::beforeDay($prevPos['delivery_date_from'] ?? ''),
                $position['price'],
                strtotime($position['order_date_from']),
                $position['order_date_from'],
                $orders[strtotime($position['order_date_from'])], // possible order_date_to
            ];
            $prevPos = $dates[1];
        }

        return $deliveries;
    }
}
