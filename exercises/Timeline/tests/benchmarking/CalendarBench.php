<?php

require __DIR__ .'/../fixtures.php';

use GrowFlow\Calendar\Calendar;

class CalendarBench {
    public function benchDenormalize() {
        $fixtures = Fixtures::instance();
        $input = $fixtures->get('input_benchmarking');
        $calendar = new Calendar();
        $calendar->denormalize($input);
    }
}
