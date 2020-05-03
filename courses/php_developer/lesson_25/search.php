<?php

function binary_search($q, $source)
{
    $length = count($source);
    if (!$length) {
        return false;
    }

    $mid = floor($length / 2);
    $step = floor($length / 2);

    while ($mid >= 0 && $mid <= $length) {
        if ($step > 1) {
            $step = floor($step / 2);
        }

        if ($q > $source[$mid]) {
            $mid += $step;
        } elseif ($q < $source[$mid]) {
            $mid -= $step;
        } else {
            return $mid;
        }
    }

    return false;
}

function linear_search($q, $source)
{
    foreach ($source as $key => $value) {
        if ($value == $q) {
            return $key;
        }
    }
}

$source = [];
for ($i = 0; $i < 1000000; $i++) {
    $source[] = rand(0, 100000);
}


echo 'LINEAR SEARCH...' . PHP_EOL;
$start = time();
for ($i = 0; $i < 10000; $i++) {
    $k = rand(0, count($source) - 1);
    $res = linear_search($source[$k], $source);
}
$end = time();

var_dump($start);
var_dump($end);

echo 'Sorting array...' . PHP_EOL;
/* It's important! Do not remove! Binary search works only for sorted array */
sort($source);

echo 'BINARY SEARCH...' . PHP_EOL;
echo 'Check that worked correctly...' . PHP_EOL;
for ($i = 0; $i < 10; $i++) {
    $k = rand(0, count($source) - 1);
    $res = binary_search($source[$k], $source);
    echo ($source[$k] == $source[$res] ? 'TRUE' : 'FALSE') .'! Request: '.  $source[$k] . '; Result: '. $source[$res] . PHP_EOL;
}

echo 'Start benchmarking...' . PHP_EOL;
$start = time();
for ($i = 0; $i < 10000; $i++) {
    $k = rand(0, count($source) - 1);
    $res = binary_search($source[$k], $source);
}
$end = time();

var_dump($start);
var_dump($end);
