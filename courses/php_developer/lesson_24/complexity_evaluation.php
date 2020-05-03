<?php

function factorial($n) {
    if ($n == 1) {
        return 1;
    }

    return $n * factorial($n - 1);
}

function do_something($source = array()) {
    if (count($source) % 2) {
        return;
    }

    $result = 0;

    $operateSource = [];
    foreach ($source as $list) {
        $operateList = [];
        foreach ($list as $item) {
            if ($item > rand(0, 1000000)) {
                $operateList[] = $item;
            }
        }
        $operateSource[] = $operateList;
    }

    foreach ($operateSource as $list) {
        $tmp = false;
        foreach ($list as $i => $item) {
            $tmp = factorial($item);
        }

        if ($tmp) {
            $result += $tmp;
        }
    }
}
