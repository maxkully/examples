<?php

/**
 *
 */

namespace GrowFlow\Calendar;

/**
 * Class Calendar
 * @package GrowFlow\Calendar
 */
class Calendar
{
    /**
     * @var PositionsCollection
     */
    public $schedule;

    /**
     * @param array $positions
     * @return array
     */
    public function denormalize(array $positions): array
    {
        $this->schedule = new PositionsCollection($positions);

        $output = [];
        foreach ($this->schedule->denormalize() as $item) {
            $output = array_merge($output, $item);
        };

        return $output;
    }
}
