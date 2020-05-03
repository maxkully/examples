<?php

/**
 *
 */

namespace GrowFlow\Calendar;

use SplMaxHeap;

/**
 * Class PositionsCollection
 * @package GrowFlow\Calendar
 */
class PositionsCollection
{
    /** @var array */
    public $collection = [];

    /** @var array */
    public $input = [];

    /** @var array */
    public $output = [];

    /**
     * PositionsCollection constructor.
     * @param array $positions
     */
    public function __construct(array $positions)
    {
        foreach ($positions as $position) {
            $this->add($position);
        }
    }

    public function denormalize()
    {
        /** @var Timeline $collection */
        foreach ($this->collection as $posId => $collection) {
            $this->output[$posId] = $collection->build();
        }

        return $this->output;
    }

    public function findFromInput($pid, $orderDate, $deliveryDate)
    {
        $orderDate = strtotime($orderDate);
        $deliveryDate = strtotime($deliveryDate);

        $deliveryDates = new SplMaxHeap();
        foreach ($this->input[$pid] as $item) {
            if ($deliveryDate >= strtotime($item['delivery_date_from']) && $orderDate >= strtotime($item['order_date_from'])) {
                $deliveryDates->insert([strtotime($item['delivery_date_from']), $item]);
            }
        }

        $candidates = [];
        $deliveryDate = false;
        foreach ($deliveryDates as $dates) {
            $date = $dates[1];
            if (!$deliveryDate) {
                $deliveryDate = $date['delivery_date_from'];
            }
            if (!isset($candidates[$date['delivery_date_from']])) {
                $candidates[$date['delivery_date_from']] = new SplMaxHeap();
            }
            $candidates[$date['delivery_date_from']]->insert([strtotime($date['order_date_from']), $date]);
        }

        return $candidates[$deliveryDate]->current()[1];
    }

    public function findFromOutput($pid, $orderDate, $deliveryDate)
    {
        $orderDate = strtotime($orderDate);
        $deliveryDate = strtotime($deliveryDate);
        $result = [];

        foreach ($this->output[$pid] as $item) {
            $orderDateFrom = strtotime($item['order_date_from']);
            $orderDateTo = $item['order_date_to'] ? strtotime($item['order_date_to']) : INF;
            $deliveryDateFrom = strtotime($item['delivery_date_from']);
            $deliveryDateTo = $item['delivery_date_to'] ? strtotime($item['delivery_date_to']) : INF;

            if (
                $orderDate >= $orderDateFrom && $orderDate <= $orderDateTo
                && $deliveryDate >= $deliveryDateFrom && $deliveryDate <= $deliveryDateTo
            ) {
                $result[] = $item;
            }
        }

        return $result;
    }

    /**
     * @param $pos
     */
    private function add($pos)
    {
        $pId = $pos['position_id'] ?? '';
        if (!is_numeric($pId)) {
            return;
        }

        if (!isset($this->collection[$pId])) {
            $this->collection[$pId] = new Timeline($pId);
        }

        if (!isset($this->input[$pId])) {
            $this->input[$pId] = [];
        }

        $this->collection[$pId]->insert($pos);
        $this->input[$pId][] = $pos;
    }
}
